import { redirect } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getSessionUser } from "@/lib/server/authz";

export default async function SupportPage() {
  const me = await getSessionUser();
  if (!me) redirect("/auth/signin");

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const contacts = [
    {
      title: "Email",
      desc: "Réponse sous 24h en semaine.",
      icon: "email",
      action: "support@vitasante.ht",
      href: "mailto:support@vitasante.ht?subject=Assistance%20membre",
      external: false,
    },
    {
      title: "Téléphone",
      desc: "Lun-Sam 8h-18h (HAT).",
      icon: "phone",
      action: "+509 2222 0000",
      href: "tel:+50922220000",
      external: false,
    },
    {
      title: "WhatsApp",
      desc: "Réponse rapide, écrite.",
      icon: "forum",
      action: "Ouvrir WhatsApp",
      href: "https://wa.me/50912345678",
      external: true,
    },
    {
      title: "Aide en ligne",
      desc: "FAQ et guides détaillés.",
      icon: "help",
      action: "Centre d'aide",
      href: "/member/support",
      external: false,
    },
  ];

  const faqs: { q: string; a: string }[] = [
    {
      q: "Comment ajouter un bénéficiaire?",
      a: "Rendez-vous dans Dépendants → Ajouter un bénéficiaire. Vous choisissez le forfait et réglez via Stripe.",
    },
    {
      q: "Que couvre mon forfait?",
      a: "Consultez votre carte médicale pour les crédits restants, puis la page Forfaits pour la grille complète des couvertures.",
    },
    {
      q: "Comment planifier une télévisite?",
      a: "Un médecin vérifié vous enverra un lien WhatsApp ou email après votre demande. Utilisez l'annuaire pour trouver un généraliste.",
    },
    {
      q: "Où trouver ma carte membre?",
      a: "Rubrique Carte Médicale. Vous pouvez aussi la télécharger en PDF pour l'imprimer.",
    },
    {
      q: "Comment mettre à jour mon moyen de paiement?",
      a: "Contactez support@vitasante.ht avec votre ID membre. Un portail client Stripe sera bientôt disponible.",
    },
  ];

  return (
    <>
      <TopBar greeting="Support" subtitle="Nous sommes là pour vous aider." initials={initials} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((opt) => {
              const inner = (
                <>
                  <div className="h-12 w-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-4">
                    <Icon name={opt.icon} />
                  </div>
                  <h3 className="font-headline font-bold text-on-surface mb-1">{opt.title}</h3>
                  <p className="text-xs text-on-surface-variant flex-1 mb-4">{opt.desc}</p>
                  <span className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:shadow-lg transition-shadow text-center block">
                    {opt.action}
                  </span>
                </>
              );
              return opt.external || opt.href.startsWith("mailto:") || opt.href.startsWith("tel:") ? (
                <a
                  key={opt.title}
                  href={opt.href}
                  target={opt.external ? "_blank" : undefined}
                  rel={opt.external ? "noreferrer" : undefined}
                  className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col"
                >
                  {inner}
                </a>
              ) : (
                <Link
                  key={opt.title}
                  href={opt.href}
                  className="bg-surface-container-lowest rounded-3xl p-6 shadow-sm flex flex-col"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="lg:col-span-4">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
            <h3 className="font-headline font-bold text-lg text-primary mb-6">Questions fréquentes</h3>
            <div className="space-y-5">
              {faqs.map((faq) => (
                <details key={faq.q} className="group">
                  <summary className="flex items-center justify-between py-3 px-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high cursor-pointer list-none">
                    <span className="text-sm font-medium text-on-surface">{faq.q}</span>
                    <Icon
                      name="chevron_right"
                      size="sm"
                      className="text-on-surface-variant shrink-0 group-open:rotate-90 transition-transform"
                    />
                  </summary>
                  <p className="px-4 pt-3 pb-1 text-xs text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
