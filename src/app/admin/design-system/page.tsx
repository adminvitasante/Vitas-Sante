import { redirect } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Icon } from "@/components/ui/icon";
import { getSessionWithCapability } from "@/lib/server/authz";

// Internal design system — visible to admins only.
// One page to verify tokens, components, and voice direction.
// Source: src/design-system/tokens.ts + brand.md.

const colorBlocks: {
  group: string;
  items: { name: string; hex: string; token: string; text?: string }[];
}[] = [
  {
    group: "Primaries (froides — institution, confiance)",
    items: [
      { name: "Primary", hex: "#00346F", token: "primary" },
      { name: "Secondary", hex: "#046B5E", token: "secondary" },
      { name: "Tertiary", hex: "#003F0B", token: "tertiary" },
    ],
  },
  {
    group: "Chaudes (Haïti, humain)",
    items: [
      { name: "Warm", hex: "#D4804D", token: "warm" },
      { name: "Warm Subtle", hex: "#F5E6DC", token: "warm-subtle", text: "#6B3D1E" },
      { name: "Warm Ink", hex: "#6B3D1E", token: "warm-ink" },
    ],
  },
  {
    group: "Ink (texte — slate tinted warm)",
    items: [
      { name: "Ink", hex: "#1F2937", token: "ink" },
      { name: "Ink Muted", hex: "#475569", token: "ink-muted" },
      { name: "Ink Subtle", hex: "#94A3B8", token: "ink-subtle" },
    ],
  },
  {
    group: "Surfaces",
    items: [
      { name: "Surface", hex: "#FAFBFC", token: "surface", text: "#1F2937" },
      { name: "Surface Warm", hex: "#FAF4EC", token: "surface-warm", text: "#6B3D1E" },
      { name: "Surface Container Low", hex: "#F2F4F6", token: "surface-container-low", text: "#1F2937" },
    ],
  },
];

export default async function DesignSystemPage() {
  const me = await getSessionWithCapability("ADMIN");
  if (!me) redirect("/auth/signin");

  const initials = me.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen px-8 py-8">
      <TopBar
        greeting="Design System"
        subtitle="Vita Santé — tokens, composants, voix"
        initials={initials}
      />

      <div className="max-w-5xl space-y-12">
        {/* Essence */}
        <section className="bg-surface-warm rounded-3xl p-8 border-l-4 border-warm">
          <p className="text-xs font-bold text-warm-ink uppercase tracking-widest mb-2">
            Essence
          </p>
          <p className="font-headline text-2xl font-extrabold text-ink leading-headline tracking-headline">
            Soins premium pour Haïti.
            <br />
            <span className="text-warm">Pensés pour ceux qui aiment à distance.</span>
          </p>
          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Sérieux", body: "Produit médical, pas un spa" },
              { title: "Chaleur", body: "Rassurer, pas intimider" },
              { title: "Fierté haïtienne", body: "Évoquer sans cliché" },
            ].map((g) => (
              <li key={g.title} className="p-4 bg-surface-container-lowest rounded-xl">
                <p className="font-bold text-ink mb-1">{g.title}</p>
                <p className="text-xs text-ink-muted">{g.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Colors */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-primary mb-6">Palette</h2>
          <div className="space-y-8">
            {colorBlocks.map((block) => (
              <div key={block.group}>
                <h3 className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-3">
                  {block.group}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {block.items.map((c) => (
                    <div
                      key={c.token}
                      className="rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30"
                    >
                      <div
                        className="h-24 flex items-end p-4"
                        style={{ background: c.hex, color: c.text ?? "white" }}
                      >
                        <span className="font-headline font-bold text-sm tracking-wide">
                          {c.name}
                        </span>
                      </div>
                      <div className="bg-surface-container-lowest p-3 text-xs">
                        <p className="font-mono font-bold text-ink">{c.hex}</p>
                        <p className="font-mono text-ink-muted">.{c.token}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-primary mb-6">Typographie</h2>
          <div className="bg-surface-container-lowest rounded-2xl p-8 space-y-6 shadow-clinical">
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
                Display · Manrope 800 · tracking-tight
              </p>
              <p className="font-headline font-extrabold text-5xl text-primary tracking-headline leading-headline">
                Votre mère en Haïti.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
                Heading · Manrope 800
              </p>
              <h3 className="font-headline font-extrabold text-2xl text-ink">
                Comment Vita Santé fonctionne
              </h3>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
                Body · Inter · leading-body 1.7
              </p>
              <p className="text-base text-ink leading-body max-w-xl">
                La santé de vos proches en Haïti, suivie depuis votre téléphone. Un forfait
                annuel, une carte médicale numérique, un réseau de médecins vérifiés.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
                Caption · Inter 500
              </p>
              <p className="text-xs text-ink-subtle font-medium tracking-wider">
                9 forfaits · à partir de $99/an · réseau en croissance
              </p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-primary mb-6">Boutons</h2>
          <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-clinical">
            <div className="flex flex-wrap gap-3 mb-6">
              <button className="px-6 py-3 rounded-xl bg-primary text-on-primary font-headline font-bold text-sm hover:opacity-90 transition-opacity">
                Primaire
              </button>
              <button className="px-6 py-3 rounded-xl border-2 border-primary text-primary font-headline font-bold text-sm hover:bg-primary hover:text-on-primary transition-colors">
                Secondaire
              </button>
              <button className="px-6 py-3 rounded-xl bg-warm text-white font-headline font-bold text-sm hover:opacity-90 transition-opacity shadow-warm">
                Accent humain
              </button>
              <button className="px-6 py-3 rounded-xl bg-surface-container-low text-ink font-headline font-bold text-sm hover:bg-surface-container-high transition-colors">
                Tertiaire
              </button>
              <button className="px-6 py-3 rounded-xl bg-error text-on-error font-headline font-bold text-sm hover:opacity-90 transition-opacity">
                Destructif
              </button>
            </div>
            <p className="text-xs text-ink-muted leading-body">
              Règle: le bouton primaire bleu pour l&apos;action canonique, l&apos;accent chaud
              (terre cuite) uniquement pour les moments &quot;humains&quot; (ex: candidater
              comme médecin, contacter un conseiller).
            </p>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-primary mb-6">Cartes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-clinical border-l-4 border-primary">
              <Icon name="shield" className="text-primary mb-3" />
              <p className="font-bold text-ink mb-1">Carte institutionnelle</p>
              <p className="text-sm text-ink-muted">
                Fond blanc, bord gauche primary, shadow-clinical. Pour données médicales et
                informations de confiance.
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-clinical border-l-4 border-warm">
              <Icon name="favorite" className="text-warm mb-3" />
              <p className="font-bold text-ink mb-1">Carte humaine</p>
              <p className="text-sm text-ink-muted">
                Même structure avec bord warm. Pour témoignages, moments familiaux, section
                &quot;pour la Diaspora&quot;.
              </p>
            </div>
          </div>
        </section>

        {/* Voice */}
        <section>
          <h2 className="font-headline text-2xl font-bold text-primary mb-6">Voix</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-error-container rounded-2xl">
              <p className="text-xs font-bold text-on-error-container uppercase tracking-widest mb-2">
                ❌ Éviter
              </p>
              <p className="text-sm text-on-error-container leading-body italic">
                &quot;Your health is our mission. Access premium medical care and secure health
                coverage, bridging the gap between distances with clinical excellence.&quot;
              </p>
              <p className="text-xs text-on-error-container/70 mt-2">
                Générique, boutique-spa, parle à personne.
              </p>
            </div>
            <div className="p-6 bg-secondary-container rounded-2xl">
              <p className="text-xs font-bold text-on-secondary-container uppercase tracking-widest mb-2">
                ✓ Utiliser
              </p>
              <p className="text-sm text-on-secondary-container leading-body italic">
                &quot;La santé de vos proches en Haïti, suivie depuis votre téléphone. Un forfait
                annuel, une carte médicale numérique, un réseau de médecins vérifiés.&quot;
              </p>
              <p className="text-xs text-on-secondary-container/70 mt-2">
                Concret, deuxième personne, chiffres, parle au vrai destinataire.
              </p>
            </div>
          </div>
        </section>

        {/* Reference */}
        <section className="bg-surface-container-low rounded-2xl p-6">
          <p className="text-xs font-bold text-ink-muted uppercase tracking-widest mb-2">
            Source
          </p>
          <p className="text-sm text-ink leading-body">
            Les tokens vivent dans{" "}
            <code className="bg-surface-container-lowest px-2 py-0.5 rounded text-xs font-mono">
              src/design-system/tokens.ts
            </code>{" "}
            et le guide de voix dans{" "}
            <code className="bg-surface-container-lowest px-2 py-0.5 rounded text-xs font-mono">
              src/design-system/brand.md
            </code>
            . Tout changement de ces fichiers se propage à l&apos;app via Tailwind.
          </p>
        </section>
      </div>
    </div>
  );
}
