## Semantic Token Requirements

Semantic tokens provide context to primitive values and are the bridge between the raw primitives and the final components.

1.  **Contextual Naming**: Semantic tokens must be named based on their intended use case, not their value (e.g., `surface-padding`, not `spacing-16px`).

2.  **Consume Primitives**: All semantic tokens **must** reference a primitive token for their value. They should not contain raw, hard-coded values.

3.  **Calculation Layer**: The semantic layer is the **only** layer where calculations (e.g., multiplying a primitive by a global multiplier) are permitted. This is primarily for creating `dynamic` tokens.

4.  **Static and Dynamic Variants**:
    *   **`static`**: Tokens that have a fixed value and do not change with global multipliers.
    *   **`dynamic`**: Tokens that scale based on a global multiplier (e.g., `{ob.p.dimension.px.8} * {ob.g.multiplier.dimension}`).

5.  **Semantic Dimension Structure**: The `ob.s.dimension` tokens must follow a 5-tier semantic model to provide clear, intuitive meaning for spacing and sizing:
    *   **`detail` (1px-2px)**: For micro-level elements like borders and hairlines.
    *   **`element` (4px-12px)**: For the internal spacing within components (e.g., padding inside a button).
    *   **`surface` (16px-24px)**: For padding on self-contained UI surfaces (e.g., cards, tooltips).
    *   **`container` (32px-64px)**: For padding within larger content containers that group multiple surfaces.
    *   **`layout` (80px+)**: For spacing between major, independent sections of a page layout.
    *   *(For more details, see the Dimension and Sizing Scale Research).*

### Examples

#### ✔️ Do: Create semantic tokens that perform calculations.

The semantic layer is the correct and only place to create dynamic tokens by multiplying a primitive by a global multiplier.

```json
// In: 03_03_semantic/dimension/static.json
"surface": {
  "xs": {
    "px": {
      "$type": "dimension",
      "$value": "{ob.p.dimension.px.16} * {ob.g.multiplier.dimension}",
      "$description": "16px - Small surface padding, gaps between elements (dynamic)"
    }
  }
}
```

#### ❌ Don't: Create semantic tokens that reference non-existent primitives.

A major point of failure was creating semantic tokens that pointed to primitive keys that did not exist (e.g., `ob.p.dimension.px.100`). This led to widespread broken references and required a full system reset.

```json
// In: 03_03_semantic/dimension/static.json
// THIS IS WHAT CAUSED THE SYSTEM TO BREAK
"element": {
  "xs": {
    "px": {
      "$type": "dimension",
      "$value": "{ob.p.dimension.px.100}", // ".100" does not exist in the new primitives
      "$description": "8px - small icons, no scaling - pixel units"
    }
  }
}
```

### Intentional Primitive Bypass for Static Utility Colors

Some utility color tokens (e.g., `ob.s.color.neutral.no_color`) are **intentionally defined to reference a primitive directly**, bypassing the S1 and S2 semantic tiers.

This is a deliberate architectural exception for values that are:
- **Static and invariant** — the value does not change between light/dark or emphasis modes.
- **Not subject to theming** — routing through S1 (lightness) and S2 (emphasis) would add ceremony with no semantic benefit.

For these tokens, ob.s references `ob.p.*` directly instead of going through the full `ob.s → S2 → S1 → primitive` chain.

```json
// ✔️ Intentional: ob.s.color.neutral.no_color references primitive directly
// Reason: transparent is always transparent — no mode variation exists
"no_color": {
  "$type": "color",
  "$value": "{ob.p.color.basic.transparent}",
  "$description": "Static utility color. No mode variation. Bypasses S1/S2 intentionally."
}
```

This pattern is the **exception**, not the rule. All other ob.s color tokens must follow the full reference chain.

### Element-Type Splits at ob.s

At ob.s, color tokens are named not only by state but also by the **element type** they color (`fg`, `bg`, `border`, etc.). When a single interaction state affects multiple element types that may resolve to different colors, each element type **must have its own token** — even if the values happen to be identical today.

The canonical example is the selected/active state in navigation and segmented button contexts:

- `ob.s.color.interaction.state.border.selected.*` — the indicator element (underline, active border)
- `ob.s.color.interaction.state.fg.selected.*` — the label text color

These cannot share one token because:
1. **Semantic correctness** — `fg` means text and icon. Applying it to a border element is a naming lie.
2. **Independent theming** — the indicator typically carries the saturated brand accent color, while the label may stay monochromatic. A single token cannot express two different resolved values.

### Choosing the Right Contrast Level

Multiple contrast levels are provided intentionally to give teams design flexibility — different surfaces and contexts call for different contrast decisions, and a single-level system would force either over-contrast or under-contrast everywhere.

Not every primitive shade is available as a semantic token. Shades that would produce obviously unreadable pairings are deliberately excluded. This shapes the palette to combinations that are meaningful and safe, while still leaving room for intentional contrast decisions.

Choosing between the available levels involves a trade-off between two competing properties:

**Luminance contrast** — how readable text or icons are against the surface. Higher contrast levels improve legibility and accessibility.

**Chromatic salience** — how strongly the hue communicates its category. Saturated, mid-range colors carry the most recognizable signal (e.g., the immediate "this is red = error" read). Pushing luminance to its maximum desaturates the hue, weakening the categorical color signal.

The general selection heuristic:

| Contrast level | Favors | Typical use |
|---|---|---|
| `contrast_highest` | Legibility | Large text surfaces, body content on status backgrounds |
| `contrast_high` | Balance | Standard status containers, primary status text |
| `contrast_medium` | Balance | Secondary labels, supporting text, subtle surfaces |
| `contrast_low` | Chroma / scannability | Compact elements where instant category recognition matters more than readability |

Avoid `contrast_highest` on backgrounds where instant color hue recognition is critical — highest contrast reduces chroma and weakens the categorical status signal. Prefer `contrast_high` or `contrast_medium` for surfaces where the hue itself must be immediately scannable.
