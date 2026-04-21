import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getSessionUser } from "@/lib/server/authz";
import { getMemberMedicalCard, getBeneficiaryMedicalCard } from "@/lib/server/queries";

// Generates a real credit-card-sized PDF of the member's medical card.
// Uses pdf-lib (pure JS, no Chromium) so it runs on Vercel with zero
// special config. QR encodes the member code for doctor-scan verification.
//
// Optional query param ?beneficiary=<userId> lets the logged-in payer
// download the PDF of a dependent they fund. The server verifies the
// caller is the payer on that enrollment before returning the file.

export async function GET(req: NextRequest) {
  const me = await getSessionUser();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const beneficiaryId = url.searchParams.get("beneficiary");

  const data = beneficiaryId
    ? await getBeneficiaryMedicalCard(beneficiaryId, me.id)
    : await getMemberMedicalCard(me.id);

  if ("error" in data) {
    return NextResponse.json({ error: data.error }, { status: 403 });
  }

  const user = data.user as { name: string; email: string; phone: string | null } | null;
  const enrollment = data.enrollment as {
    member_id_code: string | null;
    status: string;
    plans: { name_en: string; name_fr: string; tier: string; visits_per_year: number } | null;
    credit_accounts: { visits_remaining: number; visits_total: number }[] | null;
    subscriptions: { current_period_end: string } | null;
  } | null;

  if (!user || !enrollment?.member_id_code) {
    return NextResponse.json(
      { error: "Aucune adhésion active. La carte n'est disponible qu'une fois l'adhésion validée." },
      { status: 404 }
    );
  }

  const pdfBytes = await buildCardPdf({
    memberName: user.name,
    memberCode: enrollment.member_id_code,
    planName: (enrollment.plans?.name_fr ?? enrollment.plans?.name_en ?? "Vita Santé").toUpperCase(),
    planTier: enrollment.plans?.tier ?? "CORE",
    validThru: enrollment.subscriptions?.current_period_end ?? null,
    visitsRemaining: enrollment.credit_accounts?.[0]?.visits_remaining ?? 0,
    visitsTotal: enrollment.credit_accounts?.[0]?.visits_total ?? 0,
    status: enrollment.status,
    phone: user.phone,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="vita-sante-${enrollment.member_id_code}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}

async function buildCardPdf(params: {
  memberName: string;
  memberCode: string;
  planName: string;
  planTier: string;
  validThru: string | null;
  visitsRemaining: number;
  visitsTotal: number;
  status: string;
  phone: string | null;
}) {
  // Page: letter size, card printed roughly credit-card proportions (86mm × 54mm)
  // at a readable scale on the page, with member details below for photocopy use.
  const doc = await PDFDocument.create();
  doc.setTitle(`Vita Santé — Carte Membre — ${params.memberCode}`);
  doc.setAuthor("Vita Santé Club");
  doc.setSubject("Carte membre numérique");
  doc.setCreator("Vita Santé Member Portal");

  const page = doc.addPage([612, 792]); // US Letter (8.5×11 in @ 72dpi)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);

  // Brand palette (matches Tailwind tokens in the web card).
  const primary = rgb(0x00 / 255, 0x34 / 255, 0x6f / 255);
  const secondary = rgb(0x04 / 255, 0x6b / 255, 0x5e / 255);
  const white = rgb(1, 1, 1);
  const slate = rgb(0.26, 0.3, 0.36);
  const mutedSlate = rgb(0.55, 0.58, 0.62);

  // ── Header ─────────────────────────────────────────────
  page.drawText("VITA SANTÉ CLUB", {
    x: 50, y: 740, size: 16, font: bold, color: primary,
  });
  page.drawText("Carte Membre · Digital Identity", {
    x: 50, y: 720, size: 10, font: reg, color: slate,
  });
  page.drawLine({
    start: { x: 50, y: 710 }, end: { x: 562, y: 710 },
    thickness: 0.5, color: mutedSlate,
  });

  // ── Card visual (landscape, ~340×210 px at 72dpi ≈ 4.72×2.92 in) ──
  const cardX = 50;
  const cardY = 480;
  const cardW = 400;
  const cardH = 210;

  page.drawRectangle({
    x: cardX, y: cardY, width: cardW, height: cardH,
    color: primary,
  });
  // Decorative band
  page.drawRectangle({
    x: cardX, y: cardY + cardH - 8, width: cardW, height: 8,
    color: secondary,
  });

  // Plan tier + name
  page.drawText(`${params.planTier} MEMBER`, {
    x: cardX + 20, y: cardY + cardH - 36, size: 9, font: bold, color: white,
  });
  page.drawText(params.planName, {
    x: cardX + 20, y: cardY + cardH - 58, size: 14, font: bold, color: white,
  });

  // Name
  page.drawText(params.memberName, {
    x: cardX + 20, y: cardY + 100, size: 20, font: bold, color: white,
  });
  // Member code
  page.drawText("MEMBER ID", {
    x: cardX + 20, y: cardY + 80, size: 7, font: bold, color: rgb(1, 1, 1),
  });
  page.drawText(params.memberCode, {
    x: cardX + 20, y: cardY + 62, size: 14, font: bold, color: white,
  });

  // Valid thru
  if (params.validThru) {
    const d = new Date(params.validThru);
    const validStr = `${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    page.drawText("VALID THRU", {
      x: cardX + 20, y: cardY + 38, size: 7, font: bold, color: white,
    });
    page.drawText(validStr, {
      x: cardX + 20, y: cardY + 22, size: 11, font: bold, color: white,
    });
  }

  // QR on the right of the card
  const qrDataUrl = await QRCode.toDataURL(`vsc:${params.memberCode}`, {
    margin: 1,
    width: 260,
    color: { dark: "#00346f", light: "#ffffff" },
  });
  const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await doc.embedPng(qrBytes);
  const qrSize = 120;
  page.drawRectangle({
    x: cardX + cardW - qrSize - 32, y: cardY + (cardH - qrSize) / 2,
    width: qrSize + 16, height: qrSize + 16,
    color: white,
  });
  page.drawImage(qrImage, {
    x: cardX + cardW - qrSize - 24,
    y: cardY + (cardH - qrSize) / 2 + 8,
    width: qrSize,
    height: qrSize,
  });
  page.drawText("PROVIDER SCAN", {
    x: cardX + cardW - qrSize - 24, y: cardY + (cardH - qrSize) / 2 - 6,
    size: 6, font: bold, color: mutedSlate,
  });

  // ── Details block below card ────────────────────────────
  const detailsY = 430;
  page.drawText("Coordonnées", {
    x: 50, y: detailsY, size: 11, font: bold, color: primary,
  });

  const rows: [string, string][] = [
    ["Nom complet", params.memberName],
    ["Code membre", params.memberCode],
    ["Forfait", params.planName],
    ["Niveau", params.planTier],
    ["Visites restantes", `${params.visitsRemaining} / ${params.visitsTotal}`],
    ["Statut d'adhésion", params.status],
  ];
  if (params.phone) rows.push(["Téléphone", params.phone]);
  if (params.validThru) {
    rows.push(["Valable jusqu'au", new Date(params.validThru).toLocaleDateString("fr-FR")]);
  }

  let rowY = detailsY - 22;
  for (const [label, value] of rows) {
    page.drawText(label.toUpperCase(), {
      x: 50, y: rowY, size: 7, font: bold, color: mutedSlate,
    });
    page.drawText(value, {
      x: 180, y: rowY, size: 10, font: reg, color: slate,
    });
    rowY -= 18;
  }

  // ── Usage instructions ──────────────────────────────────
  const instrY = rowY - 24;
  page.drawText("Comment utiliser cette carte", {
    x: 50, y: instrY, size: 11, font: bold, color: primary,
  });

  const instructions = [
    "1. Présentez votre code membre au médecin Vita Santé lors de votre visite.",
    "2. Le médecin scanne le QR ou saisit le code pour vérifier votre éligibilité.",
    "3. Le système confirme votre forfait, vos crédits, et le copay applicable.",
    "4. Aucun paiement à avancer chez les prestataires du réseau.",
  ];
  let instrRowY = instrY - 20;
  for (const line of instructions) {
    page.drawText(line, {
      x: 50, y: instrRowY, size: 9, font: reg, color: slate,
    });
    instrRowY -= 16;
  }

  // ── Footer ─────────────────────────────────────────────
  page.drawLine({
    start: { x: 50, y: 80 }, end: { x: 562, y: 80 },
    thickness: 0.5, color: mutedSlate,
  });
  page.drawText(
    `© ${new Date().getFullYear()} Vita Santé Club · support@vitasante.ht · Généré le ${new Date().toLocaleDateString("fr-FR")}`,
    { x: 50, y: 60, size: 8, font: reg, color: mutedSlate }
  );
  page.drawText(
    "Cette carte numérique est un substitut valide à la carte physique dans tout le réseau Vita Santé.",
    { x: 50, y: 46, size: 7, font: reg, color: mutedSlate }
  );

  return doc.save();
}
