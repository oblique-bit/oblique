# Primitive Token Architecture

This document outlines the architecture and strategy for primitive tokens in the Oblique Design System. The goal is to establish a clear, scalable, and maintainable foundation for all other token tiers.

## Guiding Principles

1.  **Clarity over Brevity**: Token names and structures should be self-explanatory.
2.  **Strict Tiering**: Primitives are the atomic, context-agnostic foundation. They should not be used directly in components.
3.  **Unit Integrity**: A token's value should include its unit (`px`, `rem`) to prevent ambiguity at the consumption layer.
4.  **Flexibility**: The system must support both fluid (`rem`) and absolute (`px`) units to cater to different layout and component needs.
5.  **Scalability**: The architecture must accommodate new tokens and scales without requiring extensive refactoring.

---

## Core Primitive Files

The primitive layer is split into two distinct files based on the type of value they represent.

### 1. `02_primitive/dimension.json`

This file is the source of truth for all length-based values.

-   **Purpose**: To provide a single, flat scale of pixel-based length values for use in semantic tokens.
-   **Structure**:
    -   One `px` key holding a flat list of tokens.
    -   Values are unitless numbers (`$type: "number"`) — for example the token for `8px` has `"$value": "8"`, not `"8px"`. The unit is added downstream, when a semantic token consumes the value.
-   **Naming Convention**:
    -   The key for each token is an integer that **directly corresponds to its pixel value**. For example, the token for `8px` is named `"8"`.
    -   **Example**: `{ "ob": { "p": { "dimension": { "px": { "8": { "$type": "number", "$value": "8" } } } } } }`

#### There is no parallel `rem` primitive scale

The primitive layer stores one `px` scale only. `rem` is computed at the **semantic** layer from the `px` value (`{...px} / 16 * 1rem`), not stored as a separate primitive — see [Dimension Tokens](../03-token-categories/00-dimension.md) for the full semantic-layer breakdown.

-   **`px` (Absolute Scale)**: Provides pixel-based units. These are static and do not scale with the user's browser font-size settings. They are ideal for elements that must maintain a fixed size, such as borders, fine lines, or icons where pixel-perfect rendering is critical.
-   **`rem` (Fluid Scale)**: Provides rem-based units, which are relative to the root `<html>` element's font size. This allows components and layouts to scale proportionally based on user preferences, which is essential for accessibility. Computing it at the semantic layer, rather than duplicating it as a second primitive scale, keeps the two units from ever drifting out of sync.

### 2. `02_primitive/number.json`

This file is the source of truth for all **unitless** or abstract numeric values.

-   **Purpose**: To house numbers that require transformation at build time or are naturally unitless (like line height). This separation prevents the pollution of the `dimension/static.json` file with non-standard units.
-   **Structure**:
    -   Categorized by the CSS property they are intended for (e.g., `line-height`, `letter-spacing`, `percentage`).
-   **Use Cases**:
    -   **`line-height`**: These are unitless multipliers (e.g., `1.5`).
    -   **`letter-spacing`**: These are abstract numbers (e.g., `50`). A Style Dictionary transform will convert this to an `em` value (e.g., `0.05em`) during the build process. This keeps the primitive abstract and delegates the platform-specific implementation to the build tool.
    -   **`percentage`**: Numbers intended for use as percentages (e.g., `50` for `50%`).

---

## Scaling and Theming

-   **Dynamic Scaling**: Dynamic semantic tokens (e.g., `ob.s.dimension.dynamic.ui_scale.spacing.sm`) achieve different sizes for modes (e.g., `sm`, `md`, `lg`) by applying a multiplier (`ob.g.mode_collection.ui_scale.multiplier.dimension.*`) to a base primitive value.
-   **Static Tokens**: Static semantic tokens (e.g., `ob.s.border_width.md`) reference primitives directly without a multiplier. They remain constant across all modes.
-   **Unit Choice**: The choice between the `px` primitive and a computed `rem` value is made at the **semantic token level**. This allows the system to define, for example, that all paddings should be fluid (`rem`) while all border widths should be absolute (`px`).

## Primitive Token Requirements

Primitive tokens are the foundational, context-agnostic values of the design system.

1.  **Single Source of Truth**: Primitives are the single source of truth for all visual design attributes (e.g., colors, dimensions, fonts).
2.  **Context-Free**: Primitive tokens must be named based on their value, not their use case (e.g., `blue-500`, not `primary-color`).
3.  **Dimension Scale**: The primitive dimension scale must be structured to support the full range of component and layout needs, from hairlines to large containers. It must adhere to the following structure:
    *   **Micro-Scale for Fine Details**: The scale must begin with `1px`, `2px`, `3px`, and `6px` to accommodate the smallest design elements such as borders, dividers, and micro-spacings. This ensures pixel-perfect control where needed.
    *   **Core Grid-Based Scale**: Following the micro-scale, all subsequent values must align with a **4px grid** (e.g., `4px`, `8px`, `12px`, `16px`). This establishes a consistent, rhythmic foundation for all components and layouts.
    *   **Full Range**: The scale must provide values from the `1px` micro-value to large macro values required for page layouts, ensuring no gaps exist for component requirements.

## Example Workflow

1.  **Need**: A component needs a `16px` padding.
2.  **Semantic Definition**: A semantic token `ob.s.dimension.static.ui_scale.spacing.xs.rem` is created.
3.  **Primitive Reference**: This semantic token references the `px` primitive for `16px` and computes the `rem` value from it: `{ob.s.dimension.static.ui_scale.spacing.xs.px} / 16 * 1rem`, where the `.px` value itself references `{ob.p.dimension.px.16}`.
4.  **Component Usage**: The component uses the semantic token: `padding: var(--ob-s-dimension-static-ui_scale-spacing-xs-rem);`.

This architecture ensures that the system is well-structured, easy to understand, and flexible enough to handle the diverse requirements of a modern, multi-platform design system.

---

### Examples

#### Do: Name primitive `px` tokens after their exact pixel value.

The primitive `px` scale should be a flat, value-named list with no gaps in the required micro and grid steps.

```json
// In: 02_primitive/dimension.json
"8": {
  "$type": "number",
  "$value": "8"
}
```

#### Don't: Use a t-shirt scale, or leave gaps, in the primitive `px` scale.

The primitive layer holds one flat `px` scale keyed by pixel value. It should not be renamed to a t-shirt scale, and it should not skip required steps (`1`, `2`, `3`, `6`, then the 4px grid).

```json
// In: 02_primitive/dimension.json
// WRONG - t-shirt naming hides the actual pixel value
"sm": {
  "$type": "number",
  "$value": "8"
}
```
