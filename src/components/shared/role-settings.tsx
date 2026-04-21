import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { LanguageToggle } from "@/components/shared/language-toggle";

// Shared settings page used by all five roles. Each role's /settings route
// imports this component and passes its role label + user context.
export function RoleSettings({
  roleLabel,
  userName,
  userEmail,
  initials,
}: {
  roleLabel: string;
  userName: string;
  userEmail: string;
  initials: string;
}) {
  const notifRows = [
    { label: "Rappels de rendez-vous", desc: "Avant chaque visite programmée", enabled: true },
    { label: "Reçus de paiement", desc: "Confirmation par email", enabled: true },
    { label: "Alertes de crédits faibles", desc: "Quand il reste ≤ 2 visites", enabled: true },
    { label: "Renouvellement d'abonnement", desc: "30 jours avant échéance", enabled: true },
  ];

  return (
    <>
      <TopBar
        greeting="Paramètres"
        subtitle={`${roleLabel} — gérez vos préférences`}
        initials={initials}
      />

      <div className="max-w-3xl space-y-8">
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-2">Compte</h3>
          <p className="text-sm text-on-surface-variant mb-6">
            Connecté en tant que <span className="font-semibold text-on-surface">{userName}</span> ({userEmail})
          </p>
        </section>

        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-6">Notifications</h3>
          <div className="space-y-5">
            {notifRows.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-outline-variant/20 last:border-0">
                <div>
                  <p className="text-sm font-bold text-on-surface">{item.label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{item.desc}</p>
                </div>
                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${item.enabled ? "bg-primary" : "bg-surface-container-high"}`}>
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${item.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-6">Langue et région</h3>
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Icon name="translate" size="sm" className="text-primary" />
                <div>
                  <p className="text-sm font-medium text-ink">Langue de l&apos;interface</p>
                  <p className="text-xs text-ink-muted">Le changement est instantané et se souvient de votre choix.</p>
                </div>
              </div>
              <LanguageToggle variant="settings" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="schedule" size="sm" className="text-primary" />
                <span className="text-sm font-medium text-on-surface">Fuseau horaire</span>
              </div>
              <select className="rounded-xl border border-outline-variant bg-surface px-4 py-2 text-sm text-on-surface">
                <option>America/Port-au-Prince (EST)</option>
                <option>America/New_York (EST)</option>
                <option>America/Montreal (EST)</option>
                <option>Europe/Paris (CET)</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-error/20">
          <h3 className="font-headline font-bold text-lg text-error mb-2">Zone sensible</h3>
          <p className="text-sm text-on-surface-variant mb-6">Ces actions sont irréversibles.</p>
          <div className="flex flex-wrap gap-4">
            <button className="px-5 py-2.5 border border-error text-error rounded-xl text-sm font-bold hover:bg-error/5 transition-colors">
              Désactiver mon compte
            </button>
            <button className="px-5 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold hover:bg-surface-container-low transition-colors">
              Exporter mes données
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
