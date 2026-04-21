"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

// Share panel — lets the payer push the beneficiary's member code +
// public card URL via WhatsApp, Email, or clipboard. The beneficiary
// opens the link on their phone to see their card, or shows the code
// directly at the clinic. No login required.

export function ShareCard({
  beneficiaryName,
  beneficiaryEmail,
  beneficiaryPhone,
  memberCode,
  planName,
  beneficiaryId,
}: {
  beneficiaryName: string;
  beneficiaryEmail: string | null;
  beneficiaryPhone: string | null;
  memberCode: string;
  planName: string;
  beneficiaryId: string;
}) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
  }, []);

  const publicUrl = origin ? `${origin}/card/${memberCode}` : `.../card/${memberCode}`;
  const firstName = beneficiaryName.split(" ")[0] || beneficiaryName;
  const message = `Bonjour ${firstName},\n\nVotre carte Vita Santé est prête.\n\n• Code membre: ${memberCode}\n• Forfait: ${planName}\n• Voir la carte: ${publicUrl}\n\nPrésentez ce code chez tout médecin du réseau Vita Santé en Haïti pour accéder à vos soins.\n\nSupport: support@vitasante.ht`;

  // WhatsApp accepts phone without + or spaces. Strip non-digits.
  const whatsappPhone = (beneficiaryPhone || "").replace(/\D/g, "");
  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`
    : null;

  const mailtoUrl = beneficiaryEmail
    ? `mailto:${beneficiaryEmail}?subject=${encodeURIComponent("Votre carte Vita Santé")}&body=${encodeURIComponent(message)}`
    : null;

  async function copy(what: "code" | "link") {
    const text = what === "code" ? memberCode : publicUrl;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch {}
      document.body.removeChild(ta);
    }
    setCopied(what);
    setTimeout(() => setCopied(null), 2000);
  }

  async function downloadPdf() {
    const res = await fetch(`/api/member/medical-card-pdf?beneficiary=${beneficiaryId}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vita-sante-${memberCode}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <h3 className="font-headline font-bold text-lg text-primary">
        Partager avec {firstName}
      </h3>
      <p className="text-xs text-ink-muted leading-body">
        Envoyez le code membre directement à {firstName}. Ils pourront le présenter
        chez n&apos;importe quel médecin du réseau.
      </p>

      {/* WhatsApp */}
      {whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between p-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors rounded-2xl group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white">
              <Icon name="chat" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">WhatsApp</p>
              <p className="text-[10px] text-ink-muted">{beneficiaryPhone}</p>
            </div>
          </div>
          <Icon name="arrow_forward" size="sm" className="text-ink-muted group-hover:translate-x-1 transition-transform" />
        </a>
      ) : (
        <div className="w-full flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl opacity-60">
          <Icon name="chat" className="text-ink-subtle" />
          <p className="text-sm text-ink-muted">Numéro de téléphone manquant</p>
        </div>
      )}

      {/* Email */}
      {mailtoUrl ? (
        <a
          href={mailtoUrl}
          className="w-full flex items-center justify-between p-4 bg-primary-fixed/40 hover:bg-primary-fixed transition-colors rounded-2xl group"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-on-primary">
              <Icon name="mail" />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">Email</p>
              <p className="text-[10px] text-ink-muted">{beneficiaryEmail}</p>
            </div>
          </div>
          <Icon name="arrow_forward" size="sm" className="text-ink-muted group-hover:translate-x-1 transition-transform" />
        </a>
      ) : (
        <div className="w-full flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl opacity-60">
          <Icon name="mail" className="text-ink-subtle" />
          <p className="text-sm text-ink-muted">Email manquant</p>
        </div>
      )}

      {/* Copy public link — beneficiary opens it on their phone */}
      <button
        type="button"
        onClick={() => copy("link")}
        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${
          copied === "link"
            ? "bg-secondary-container"
            : "bg-surface-container-low hover:bg-surface-container-high"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${copied === "link" ? "bg-secondary text-on-secondary" : "bg-primary-fixed text-primary"}`}>
            <Icon name={copied === "link" ? "check" : "link"} />
          </div>
          <div className="text-left min-w-0">
            <p className="text-sm font-bold text-ink">
              {copied === "link" ? "Lien copié !" : "Copier le lien de la carte"}
            </p>
            <p className="text-[10px] font-mono text-ink-muted truncate">{publicUrl}</p>
          </div>
        </div>
      </button>

      {/* Copy code */}
      <button
        type="button"
        onClick={() => copy("code")}
        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors ${
          copied === "code"
            ? "bg-secondary-container"
            : "bg-surface-container-low hover:bg-surface-container-high"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${copied === "code" ? "bg-secondary text-on-secondary" : "bg-surface-container-high text-ink"}`}>
            <Icon name={copied === "code" ? "check" : "content_copy"} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-ink">
              {copied === "code" ? "Copié !" : "Copier le code seul"}
            </p>
            <p className="text-[10px] font-mono text-ink-muted">{memberCode}</p>
          </div>
        </div>
      </button>

      {/* PDF download (scoped to beneficiary) */}
      <button
        type="button"
        onClick={downloadPdf}
        className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-colors rounded-2xl group"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-warm-subtle flex items-center justify-center text-warm-ink">
            <Icon name="picture_as_pdf" />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-ink">Télécharger le PDF</p>
            <p className="text-[10px] text-ink-muted">Imprimer ou envoyer en pièce jointe</p>
          </div>
        </div>
        <Icon name="download" size="sm" className="text-ink-muted group-hover:translate-y-0.5 transition-transform" />
      </button>
    </div>
  );
}
