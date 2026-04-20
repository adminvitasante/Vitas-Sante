import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";

// Shared support/help page used by all five roles.
export function RoleSupport({
  roleLabel,
  initials,
}: {
  roleLabel: string;
  initials: string;
}) {
  const faqs: Record<string, { q: string; a: string }[]> = {
    Membre: [
      { q: "Comment utiliser ma carte médicale?", a: "Présentez votre code membre VSC-XXXXX-HT au médecin Vita Santé. Il vérifiera votre éligibilité en temps réel." },
      { q: "Que se passe-t-il si mes crédits de visite sont épuisés?", a: "Vos crédits se réinitialisent chaque année au renouvellement. Vous pouvez aussi passer à un forfait supérieur à tout moment." },
      { q: "Puis-je ajouter un parent à mon forfait?", a: "Oui, depuis la section Dépendants de votre tableau de bord. Des frais supplémentaires peuvent s'appliquer." },
    ],
    Médecin: [
      { q: "Comment vérifier l'éligibilité d'un patient?", a: "Entrez son code VSC-XXXXX-HT dans Patient Care. Le système renvoie instantanément le statut, les crédits, et le forfait." },
      { q: "Quand suis-je payé pour une visite?", a: "Les visites validées sont facturées mensuellement. Les paiements arrivent sous 30 jours après chaque cycle." },
      { q: "Comment mettre à jour mes informations professionnelles?", a: "Depuis votre profil. Les changements de licence ou de clinique requièrent une nouvelle vérification admin." },
    ],
    Affilié: [
      { q: "Comment générer un lien de parrainage?", a: "Depuis la section Marketing, cliquez sur Generate Referral Link. Partagez-le sur WhatsApp, email, ou réseaux sociaux." },
      { q: "Quand suis-je payé pour mes commissions?", a: "Les commissions passent de PENDING à ACTIVE dès qu'un filleul complète son inscription et paie. Les versements sont mensuels." },
      { q: "Comment passer au niveau ELITE ou DIAMOND?", a: "ELITE: 10 filleuls actifs. DIAMOND: 50 filleuls actifs ET plus de 500 000 HTG de commissions totales." },
    ],
    Sponsor: [
      { q: "Comment financer de nouveaux bénéficiaires?", a: "Depuis Support More Members, choisissez le forfait, le nombre de places, et les bénéficiaires (spécifiques ou un pool à attribuer)." },
      { q: "Puis-je obtenir un rapport d'impact?", a: "Oui. Les rapports d'impact mensuels détaillent le nombre de visites, les conditions traitées, et la couverture géographique de vos bénéficiaires." },
      { q: "Comment fonctionne la facturation institutionnelle?", a: "Stripe émet une facture agrégée mensuelle. Nous acceptons virements et cartes corporate. Délai de paiement: 30 jours." },
    ],
    Admin: [
      { q: "Comment approuver une inscription?", a: "Depuis Members → filtrez par UNDER_REVIEW. Cliquez Approve après vérification des pièces. La carte membre est générée automatiquement." },
      { q: "Comment vérifier un médecin?", a: "Depuis Doctors → examinez les candidatures PENDING. Vérifiez licence auprès du MSPP. Cliquez Verify pour activer." },
      { q: "Un paiement Stripe a échoué — que faire?", a: "Le webhook déclenche automatiquement la période de grâce (30 jours). Aucune action admin requise sauf si le payeur le demande." },
    ],
  };

  const roleFaqs = faqs[roleLabel] ?? faqs["Membre"];

  return (
    <>
      <TopBar
        greeting="Support"
        subtitle={`${roleLabel} — aide et contact`}
        initials={initials}
      />

      <div className="max-w-3xl space-y-8">
        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-6">Questions fréquentes</h3>
          <div className="space-y-6">
            {roleFaqs.map((faq) => (
              <div key={faq.q}>
                <p className="font-bold text-sm text-on-surface mb-1">{faq.q}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm">
          <h3 className="font-headline font-bold text-lg text-primary mb-6">Nous contacter</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href="mailto:support@vitasante.ht"
              className="flex items-center gap-3 p-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl"
            >
              <div className="h-10 w-10 rounded-xl bg-primary-fixed flex items-center justify-center text-primary">
                <Icon name="mail" size="sm" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email</p>
                <p className="text-sm font-bold text-on-surface">support@vitasante.ht</p>
              </div>
            </a>
            <a
              href="https://wa.me/50912345678"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-4 bg-surface-container-low hover:bg-surface-container-high rounded-xl"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <Icon name="chat" size="sm" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">WhatsApp</p>
                <p className="text-sm font-bold text-on-surface">+509 1234 5678</p>
              </div>
            </a>
          </div>
          <p className="mt-6 text-xs text-on-surface-variant">
            Temps de réponse moyen: &lt; 24h en semaine, &lt; 48h le weekend.
          </p>
        </section>
      </div>
    </>
  );
}
