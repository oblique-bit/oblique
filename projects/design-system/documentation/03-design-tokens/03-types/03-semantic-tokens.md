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
    *   *(For more details, see the [Dimension and Sizing Scale Research](research.md)).*

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

Some utility color tokens (e.g., `ob.s3.color.neutral.no_color`) are **intentionally defined to reference a primitive directly**, bypassing the S1 and S2 semantic tiers.

This is a deliberate architectural exception for values that are:
- **Static and invariant** — the value does not change between light/dark or emphasis modes.
- **Not subject to theming** — routing through S1 (lightness) and S2 (emphasis) would add ceremony with no semantic benefit.

For these tokens, S3 references `ob.p.*` directly instead of going through the full `S3 → S2 → S1 → primitive` chain.

```json
// ✔️ Intentional: ob.s3.color.neutral.no_color references primitive directly
// Reason: transparent is always transparent — no mode variation exists
"no_color": {
  "$type": "color",
  "$value": "{ob.p.color.basic.transparent}",
  "$description": "Static utility color. No mode variation. Bypasses S1/S2 intentionally."
}
```

This pattern is the **exception**, not the rule. All other S3 color tokens must follow the full reference chain.
