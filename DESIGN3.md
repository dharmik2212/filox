# Design System Specification: The Digital Curator

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Curator."** 

While inspired by the utility of Google Photos, this system transcends the "utility app" aesthetic to achieve a high-end editorial feel. It treats user content as art and the interface as a silent, sophisticated gallery. We move away from the rigid, boxed-in layouts of traditional Material Design toward a more fluid, **Organic Minimalism**.

By leveraging intentional asymmetry, expansive whitespace, and sophisticated tonal layering, we break the "template" look. This system is designed to feel like a high-end physical portfolio—breathable, premium, and deeply intuitive. We prioritize "content-first" not just as a buzzword, but by ensuring the interface recedes entirely until needed.

---

## 2. Colors & Surface Philosophy

The palette is rooted in a vibrant primary blue but tempered by a sophisticated range of cool-toned neutrals that create a sense of expansive space.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or containment. Boundaries must be defined solely through background color shifts or tonal transitions.
- Use `surface` as your base.
- Use `surface-container-low` for large content areas.
- Use `surface-container-highest` for prominent interactive elements.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers, similar to stacked sheets of fine, heavy-weight paper.
- **Nesting:** To highlight a specific piece of content, place a `surface-container-lowest` card (pure white) on top of a `surface-container` background. This creates a soft, natural lift without the "heaviness" of a traditional card border.

### The "Glass & Gradient" Rule
To escape the "default" look, floating elements (like navigation bars or hovering action buttons) should utilize **Glassmorphism**. 
- **Recipe:** Apply `surface` at 80% opacity with a 20px - 40px backdrop blur. 
- **Signature Gradients:** For primary CTAs, use a subtle linear gradient from `primary` (#0058ba) to `primary-container` (#6c9fff). This adds a "soul" and depth to the interaction that flat hex codes cannot provide.

---

## 3. Typography: The Editorial Voice

We utilize a pairing of **Plus Jakarta Sans** for expressive moments and **Manrope** for functional clarity.

*   **Display & Headlines (Plus Jakarta Sans):** These are our "Editorial" levels. Use `display-lg` through `headline-sm` with generous letter-spacing (-0.02em) to create an authoritative, modern feel.
*   **Title & Body (Manrope):** Our "Workhorse" levels. Manrope’s geometric nature ensures that even at `body-sm`, the interface remains highly legible and "helpful."
*   **Visual Hierarchy:** Establish a "Tight vs. Loose" rhythm. Use large, bold headlines (`headline-lg`) placed near small, high-contrast labels (`label-md`) to create an intentional, curated scale shift that feels designed, not just "placed."

---

## 4. Elevation & Depth: Tonal Layering

Traditional shadows are often a crutch for poor layout. In this system, depth is achieved through color logic first.

*   **The Layering Principle:** Place `surface-container-lowest` elements on `surface-container-low` backgrounds to signify the highest level of interaction.
*   **Ambient Shadows:** If a floating effect is required (e.g., a modal), use a "Sunlight" shadow:
    *   Y: 16px, Blur: 32px, Color: `on-surface` at 6% opacity. 
    *   This mimics natural light rather than a digital drop shadow.
*   **The "Ghost Border" Fallback:** If accessibility requires a container boundary, use `outline-variant` at 15% opacity. Never use a 100% opaque border.
*   **Depth through Blur:** Use backdrop-blur on top-level navigation to allow the "colors" of the content below to bleed through, softening the interface and making it feel integrated with the user's photos.

---

## 5. Components

### Buttons
*   **Primary:** High-pill shape (`rounded-full`). Gradient of `primary` to `primary-container`. White text (`on-primary`). No shadow unless hovered.
*   **Secondary:** `surface-container-highest` background with `primary` text. No border.
*   **Tertiary:** Transparent background, `primary` text. Use for low-emphasis actions.

### Cards & Lists
*   **The Content Card:** Strictly no dividers. Use `rounded-lg` (2rem) for content containers. 
*   **Lists:** Separate list items with 16px of vertical whitespace rather than a 1px line. If items must be grouped, use a subtle `surface-container-low` backplate behind the entire group.

### Inputs & Selection
*   **Input Fields:** Use `surface-container-high` as the fill. On focus, transition the background to `surface-container-lowest` and add a 2px "Ghost Border" using the `primary` color at 40% opacity.
*   **Chips:** Selection chips use `primary-container` with `on-primary-container` text. Unselected chips use `surface-container-highest`.

### Signature Component: The "Contextual Floating Bar"
Instead of a heavy bottom nav, use a floating Glassmorphic bar.
- **Style:** `surface-container-lowest` at 85% opacity, `rounded-full`, backdrop-blur: 24px.
- **Positioning:** Floating 32px from the bottom edge, centered.

---

## 6. Do's and Don'ts

### Do
*   **DO** use whitespace as a functional element. If in doubt, add 16px more margin.
*   **DO** use `rounded-xl` (3rem) for large image containers to mimic the "Material 3" softness.
*   **DO** use the `secondary` color palette (`#3854b7`) for "system" tasks and `primary` for "user" tasks to create a mental model of helpfulness vs. action.

### Don't
*   **DON'T** use black (#000000) for text. Use `on-surface` (#232c51) to keep the contrast high but the tone sophisticated.
*   **DON'T** use 1px dividers to separate photos in a grid. Use a 4px or 8px "gutter" of the background color.
*   **DON'T** use "Standard" Material 3 shadows. They are too heavy for this editorial direction. Stick to Tonal Layering.
*   **DON'T** crowd the edges. Keep a minimum 24px (1.5rem) "Safe Zone" from the edges of the viewport for all content.