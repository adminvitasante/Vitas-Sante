# Design System Specification: The Clinical Atelier

## 1. Overview & Creative North Star
**The Creative North Star: "The Clinical Atelier"**

This design system moves away from the sterile, cold "hospital" aesthetic and toward a high-end, curated health experience. We are not building a generic portal; we are designing a digital sanctuary. The philosophy centers on **Editorial Authority**—using bold typographic scales and intentional white space to guide the user with the same precision as a medical professional.

To break the "standard template" feel, this system utilizes **Tonal Depth** and **Asymmetric Balance**. Elements are not just placed on a grid; they are layered like translucent anatomical diagrams. By leaning into a bilingual (FR/EN) structure, the layout remains flexible, ensuring that longer French strings do not compromise the premium, airy aesthetic.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Deep Medical Blue" (`primary`) and "Professional Teal" (`secondary`), but the sophistication lies in how we treat the surfaces.

### The "No-Line" Rule
**Explicit Instruction:** Prohibit 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions.
*   *Implementation:* Use `surface-container-low` for a background section sitting on a `surface` base. If a container needs to pop, use `surface-container-lowest`.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine paper.
*   **Base Layer:** `surface` (#f7f9fb)
*   **Secondary Content Areas:** `surface-container-low` (#f2f4f6)
*   **Primary Interaction Cards:** `surface-container-lowest` (#ffffff)
*   **High-Priority Overlays:** `surface-bright` (#f7f9fb) with Glassmorphism.

### The "Glass & Gradient" Rule
To evoke a sense of modern precision, use Glassmorphism for floating navigation and modal headers.
*   **Token:** `surface` at 80% opacity + 20px Backdrop Blur.
*   **Signature Textures:** For Hero CTAs and high-trust banners, use a subtle linear gradient from `primary` (#00346f) to `primary_container` (#004a99) at a 135-degree angle. This adds "soul" and depth that a flat color cannot achieve.

---

## 3. Typography: Editorial Authority
We utilize a dual-typeface system to balance clinical reliability with modern accessibility.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision. Use `display-lg` (3.5rem) for high-impact editorial statements. Headlines should feel authoritative—never centered, always left-aligned to mimic professional journals.
*   **Body & Titles (Inter):** The gold standard for readability. Inter’s tall x-height ensures that bilingual medical terminology is legible even at `body-sm` (0.75rem).
*   **The Hierarchy Goal:** Use extreme contrast between `display-md` and `label-md`. This creates a clear "Information Scent," allowing users to scan complex health data effortlessly.

---

## 4. Elevation & Depth
We eschew traditional "box-shadows" in favor of **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` card (Pure White) on a `surface-container-low` (Pale Grey/Blue) background. The 1% shift in value creates a "natural lift" that feels premium and secure.
*   **Ambient Shadows:** If an element must float (e.g., a critical notification), use:
    *   `box-shadow: 0 20px 40px rgba(0, 27, 63, 0.06);`
    *   *Note:* The shadow is tinted with `on_primary_fixed` to mimic natural light passing through a blue-tinted lens.
*   **The "Ghost Border" Fallback:** If accessibility requires a stroke, use `outline_variant` at 20% opacity. High-contrast solid borders are strictly forbidden.

---

## 5. Components

### Buttons
*   **Primary:** A gradient fill (`primary` to `primary_container`). Use `xl` (0.75rem) roundedness. No border.
*   **Secondary:** Ghost style. No background, `outline` text, but becomes `secondary_fixed` on hover to provide a "glow" effect.
*   **State:** Focused states should use a 2px offset ring in `surface_tint`.

### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Card Styling:** Use `surface-container-lowest` with a `lg` (0.5rem) corner radius.
*   **Separation:** Use vertical white space (32px or 48px) to define content blocks. For list items, use a subtle hover state transition to `surface-container-high`.

### Health-Specific Inputs
*   **Input Fields:** Use `surface-container-low` as the fill. On focus, the background shifts to `surface-container-lowest` with a 2px `primary` underline. This mimics high-end stationery.
*   **Bilingual Toggles:** A custom `secondary_container` switch that clearly labels [FR | EN], ensuring the user always knows their linguistic context.

### Additional Signature Components
*   **The "Vitals Display":** A glassmorphic card using `tertiary` (#003f0b) for positive health trends, utilizing `on_tertiary_container` for high-contrast data visualization.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** embrace asymmetry. Allow images to bleed off the edge of the grid while keeping text strictly aligned to the left margin.
*   **Do** use `secondary` (Teal) sparingly for "Success" and "Health" indicators—it is a scalpel, not a paintbrush.
*   **Do** prioritize "Breathing Room." If you think a section has enough padding, add 16px more.

### Don’t:
*   **Don’t** use pure black (#000) for text. Use `on_surface` (#191c1e) for a softer, more high-end feel.
*   **Don’t** use standard Material Design "Drop Shadows." They feel "app-like" and cheap. Use Tonal Layering.
*   **Don’t** center-align long blocks of text. It breaks the editorial flow and reduces readability for medical content.