# Vita Santé — brand & voice guide

## Essence

> **Soins premium pour Haïti. Pensés pour ceux qui aiment à distance.**

Three guardrails for every decision (copy, visual, feature):

1. **Sérieux** — produit médical, pas un spa. Pas de flou marketing.
2. **Chaleur** — la Diaspora achète pour protéger un parent. Rassurer, pas intimider.
3. **Fierté haïtienne** — évoquer Haïti sans drapeau ni vodou. Le colibri porte ça.

## Voice

### Do

- Parler en **"vous"** (formel, respectueux, adapté à la Diaspora francophone)
- **Phrases courtes**, verbes actifs, deuxième personne
- Nommer le vrai destinataire: *votre mère*, *votre parent*, *votre cousine*
- Chiffres concrets: *8 visites par an*, *$99/an*, *Réseau à Port-au-Prince, Cap-Haïtien, Les Cayes*
- Ton professionnel mais humain

### Don't

- ❌ "Clinical Atelier", "sanctuary", "curated journey" (boutique-spa)
- ❌ "bridging the gap" (cliché ONG)
- ❌ "world-class", "ecosystem", "seamless" (SaaS generic)
- ❌ Chiffres inventés ("98% satisfaction" sans utilisateurs)
- ❌ Mélange français/anglais dans la même phrase
- ❌ Drapeau haïtien comme élément décoratif

### Exemples

**Avant**:
> "Access premium medical care and secure health coverage for you and your loved ones, bridging the gap between distances with trust and clinical excellence."

**Après**:
> "La santé de vos proches en Haïti, suivie depuis votre téléphone. Un forfait annuel, une carte médicale numérique, un réseau de médecins vérifiés."

---

## Palette

### Primaires (froides — institution, confiance)

| Token | Hex | Usage |
|---|---|---|
| primary | `#00346F` | Headline, CTAs principaux, fond héros institutionnel |
| secondary | `#046B5E` | Santé, nature, statuts positifs |
| tertiary | `#003F0B` | Accents discrets, labels |

### Chaudes (nouvelles — humain, Haïti)

| Token | Hex | Usage |
|---|---|---|
| warm | `#D4804D` | CTAs secondaires "humains", témoignages, moments familiaux |
| warmSubtle | `#F5E6DC` | Backgrounds alternés (section "Pour la Diaspora", témoignages) |
| warmInk | `#6B3D1E` | Texte sur fond crème |

### Ink (texte)

| Token | Hex | Usage |
|---|---|---|
| ink | `#1F2937` | Corps principal — slate chaud, jamais noir pur |
| inkMuted | `#475569` | Texte secondaire, descriptions |
| inkSubtle | `#94A3B8` | Captions, metadata |

**Règle d'accessibilité**: tout texte sur fond clair doit atteindre ratio contraste WCAG AA (4.5:1 corps, 3:1 titres).

---

## Typographie

- **Manrope 800** (Extrabold) pour headlines — moderne, présente, lisible FR
- **Inter 400/500/600** pour corps — neutre, honnête
- `tracking-tight -0.02em` sur les très grands titres (≥ 4xl)
- `leading-1.7` sur les paragraphes français (mots longs)
- **Jamais** `text-transform:uppercase` sur plus de 3 mots

---

## Photographie

### Pour le moment (avant shoot brand)

- Photos Unsplash documentaires, *vrais humains* (jamais IA)
- Privilégier: portraits chauds, moments familiaux, mains croisées, lumière naturelle
- Éviter: hôpitaux américains aseptisés, médecins blancs génériques, bureaux corporate

### Long terme (à commissionner)

- Shoot avec un médecin partenaire haïtien réel
- Une famille diasporique réelle (avec consentement écrit et compensation)
- Lumière naturelle, grain fin, couleurs chaudes
- Budget recommandé: $1500-3000 pour série de 10 visuels

### Interdits

- Stock photos IA génératives (reconnaissables à la symétrie faciale trop parfaite)
- Images cliniques froides type catalogue d'hôpital américain

---

## Iconographie

- Material Symbols Outlined (léger, utile)
- Jamais plus d'1 icône par "information unit"
- Taille par défaut: 20-24px (size="sm")
- Couleur: hériter du contexte, jamais rouge sauf erreur vraie

---

## Motion

- Durées courtes (120-240ms)
- Courbes `cubic-bezier(0.2, 0, 0, 1)` (decelerate)
- **Jamais** de rebonds, scale > 1.03, animations spectacle
- Hover: subtil (opacity, couleur, translate 2-4px max)

---

## Espacement

Rythme vertical: 4 → 8 → 16 → 24 → 48 → 96px
Rythme horizontal: padding latéral section = 24px mobile / 96px desktop
Gap entre blocs: 32-48px sections, 16-24px cards

---

## Lexique bilingue (termes clés)

| Français | Anglais | Notes |
|---|---|---|
| Membre | Member | Bénéficiaire du soin |
| Payeur | Payer | Celui qui règle (Diaspora) |
| Bénéficiaire | Beneficiary | = Membre, utilisé dans contexte admin |
| Affilié | Affiliate | Jamais "ambassadeur" |
| Parrain / Marraine | Sponsor | Pour sponsor institutionnel |
| Forfait | Plan | Jamais "abonnement" (ambigu avec subscription payante) |
| Carte membre | Member card | Pas "membership ID" |
| Crédit de visite | Visit credit | 1 crédit = 1 consultation |
| Co-paiement | Copay | Garder "co-paiement" avec trait d'union |
| Réseau | Network | Pas "écosystème" |
| Médecin | Doctor | Pas "professionnel de santé" (lourd) |

---

## Composants de référence

Voir `/admin/design-system` dans l'app pour l'inventaire live de chaque composant.
