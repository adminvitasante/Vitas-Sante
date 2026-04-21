"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { initiateVisit, completeVisit } from "@/lib/server/visits";

// Doctor-facing UI to verify a member + initiate + complete a visit.
// Maps directly onto the visits RPCs (initiate_visit, complete_visit).
export function VisitWorkflow({ doctorId, doctorUserId }: { doctorId: string; doctorUserId: string }) {
  const t = useTranslations("doctor.workflow");
  const [stage, setStage] = useState<"idle" | "verifying" | "verified" | "completed" | "error">("idle");
  const [memberCode, setMemberCode] = useState("");
  const [visitType, setVisitType] = useState<"GENERALIST" | "SPECIALIST" | "TELEVISIT" | "HOME_VISIT">("GENERALIST");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<{
    visitId: string;
    beneficiaryName: string;
    memberIdCode: string;
    planSlug: string;
    visitsRemaining: number;
  } | null>(null);
  const [notes, setNotes] = useState("");
  const [copay, setCopay] = useState("5.00");
  const [completed, setCompleted] = useState<{ creditsRemaining: number } | null>(null);

  async function verify() {
    if (!memberCode.trim()) return;
    setLoading(true);
    setError(null);
    setStage("verifying");

    const res = await initiateVisit({
      doctorId,
      memberIdCode: memberCode.trim().toUpperCase(),
      visitType,
      network: "HAITI",
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Vérification échouée");
      setStage("error");
      return;
    }

    setVerified({
      visitId: res.visit_id!,
      beneficiaryName: res.beneficiary_name!,
      memberIdCode: res.member_id_code!,
      planSlug: res.plan_slug!,
      visitsRemaining: res.visits_remaining ?? 0,
    });
    setStage("verified");
  }

  async function complete() {
    if (!verified) return;
    setLoading(true);
    setError(null);

    const copayCents = Math.round(parseFloat(copay) * 100);

    const res = await completeVisit({
      visitId: verified.visitId,
      doctorUserId,
      notes: notes.trim() || undefined,
      copayCents: Number.isFinite(copayCents) ? copayCents : undefined,
    });

    setLoading(false);

    if (!res.success) {
      setError(res.error || "Clôture échouée");
      return;
    }

    setCompleted({ creditsRemaining: res.credits_remaining ?? 0 });
    setStage("completed");
  }

  function reset() {
    setStage("idle");
    setMemberCode("");
    setVisitType("GENERALIST");
    setVerified(null);
    setCompleted(null);
    setNotes("");
    setCopay("5.00");
    setError(null);
  }

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
          <Icon name="how_to_reg" size="sm" />
        </div>
        <div>
          <h3 className="font-headline font-bold text-lg text-primary">{t("heading")}</h3>
          <p className="text-xs text-on-surface-variant">{t("sub")}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl bg-error-container px-4 py-3 text-sm text-on-error-container">
          <Icon name="error" size="sm" />
          {error}
        </div>
      )}

      {stage === "idle" || stage === "verifying" || stage === "error" ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="memberCode" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                {t("memberCode")}
              </label>
              <input
                id="memberCode"
                value={memberCode}
                onChange={(e) => setMemberCode(e.target.value)}
                placeholder="VSC-00000-HT"
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm font-mono text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label htmlFor="visitType" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                {t("visitType")}
              </label>
              <select
                id="visitType"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as typeof visitType)}
                className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface"
              >
                <option value="GENERALIST">{t("typeGeneralist")}</option>
                <option value="SPECIALIST">{t("typeSpecialist")}</option>
                <option value="TELEVISIT">{t("typeTelevisit")}</option>
                <option value="HOME_VISIT">{t("typeHomeVisit")}</option>
              </select>
            </div>
          </div>
          <Button onClick={verify} disabled={loading || !memberCode.trim()} className="w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Icon name="progress_activity" size="sm" className="animate-spin" />
                {t("verifying")}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Icon name="search" size="sm" />
                {t("verify")}
              </span>
            )}
          </Button>
        </div>
      ) : null}

      {stage === "verified" && verified && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-secondary-container p-5">
            <div className="flex items-start gap-3">
              <Icon name="check_circle" className="text-on-secondary-container !text-3xl" />
              <div className="flex-1">
                <p className="font-bold text-on-secondary-container">{verified.beneficiaryName}</p>
                <p className="text-xs text-on-secondary-container/80 font-mono mt-1">{verified.memberIdCode}</p>
                <p className="text-xs text-on-secondary-container/80 mt-1">
                  {t("planLabel")}: <span className="font-bold capitalize">{verified.planSlug}</span> — {t("visitsLeft", { n: verified.visitsRemaining })}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              {t("notes")}
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface"
              placeholder={t("notesPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="copay" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              {t("copay")}
            </label>
            <input
              id="copay"
              type="number"
              step="0.01"
              min="0"
              value={copay}
              onChange={(e) => setCopay(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface"
            />
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={reset} className="flex-1">
              Annuler
            </Button>
            <Button onClick={complete} disabled={loading} className="flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="progress_activity" size="sm" className="animate-spin" />
                  {t("completing")}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="task_alt" size="sm" />
                  {t("complete")}
                </span>
              )}
            </Button>
          </div>
        </div>
      )}

      {stage === "completed" && completed && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-secondary-container p-6 text-center">
            <Icon name="verified" className="text-on-secondary-container !text-5xl mb-2" />
            <p className="font-headline font-bold text-lg text-on-secondary-container">{t("doneTitle")}</p>
            <p className="text-sm text-on-secondary-container/80 mt-1">
              {t("doneBody", { n: completed.creditsRemaining })}
            </p>
          </div>
          <Button onClick={reset} className="w-full">
            <span className="flex items-center justify-center gap-2">
              <Icon name="add" size="sm" />
              {t("newPatient")}
            </span>
          </Button>
        </div>
      )}
    </section>
  );
}
