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

### 1. `primitive/dimension.json`

This file is the source of truth for all length-based, unitized values.

-   **Purpose**: To provide a complete and parallel set of `px` and `rem` values for use in semantic tokens.
-   **Structure**:
    -   Contains two main keys: `px` and `rem`.
    -   Each key holds a flat list of tokens representing a numeric scale.
-   **Naming Convention**:
    -   The key for each token is an integer that **directly corresponds to its pixel value**. For example, the token for `8px` is named `"8"`.
    -   This makes the scale intuitive. A designer or developer can look at a value and immediately know its name.
    -   **Example**: `{ "ob": { "p": { "dimension": { "px": { "8": { "$value": "8px" } } } } } }`

#### `px` vs. `rem` Scales

-   **`px` (Absolute Scale)**: Provides pixel-based units. These are static and do not scale with the user's browser font-size settings. They are ideal for elements that must maintain a fixed size, such as borders, fine lines, or icons where pixel-perfect rendering is critical.
-   **`rem` (Fluid Scale)**: Provides rem-based units, which are relative to the root `<html>` element's font size. This allows components and layouts to scale proportionally based on user preferences, which is essential for accessibility.

The `dimension.json` file maintains **parallel scales**. For every `px` value, a corresponding `rem` value is available, calculated from a `16px` base.

### 2. `primitive/number.json`

This file is the source of truth for all **unitless** or abstract numeric values.

-   **Purpose**: To house numbers that require transformation at build time or are naturally unitless (like line height). This separation prevents the pollution of the `dimension.json` file with non-standard units.
-   **Structure**:
    -   Categorized by the CSS property they are intended for (e.g., `line-height`, `letter-spacing`, `percentage`).
-   **Use Cases**:
    -   **`line-height`**: These are unitless multipliers (e.g., `1.5`).
    -   **`letter-spacing`**: These are abstract numbers (e.g., `50`). A Style Dictionary transform will convert this to an `em` value (e.g., `0.05em`) during the build process. This keeps the primitive abstract and delegates the platform-specific implementation to the build tool.
    -   **`percentage`**: Numbers intended for use as percentages (e.g., `50` for `50%`).

---

## Scaling and Theming

-   **Dynamic Scaling**: Dynamic semantic tokens (e.g., `ob.s.dimension.dynamic.padding.small`) achieve different sizes for modes (e.g., `sm`, `md`, `lg`) by applying a multiplier (`ob.g.multiplier.dimension`) to a base primitive value.
-   **Static Tokens**: Static semantic tokens (e.g., `ob.s.dimension.static.border.default`) reference primitives directly without a multiplier. They remain constant across all modes.
-   **Unit Choice**: The choice between referencing a `px` or `rem` primitive is made at the **semantic token level**. This allows the system to define, for example, that all paddings should be fluid (`rem`) while all border widths should be absolute (`px`).

## Example Workflow

1.  **Need**: A component needs a `16px` padding.
2.  **Semantic Definition**: A semantic token `ob.s.dimension.default.padding.medium` is created.
3.  **Primitive Reference**: This semantic token references the `rem` primitive for `16px`: `{ob.p.dimension.rem.16}`.
4.  **Component Usage**: The component uses the semantic token: `padding: var(--ob-s-dimension-default-padding-medium);`.

This architecture ensures that the system is well-structured, easy to understand, and flexible enough to handle the diverse requirements of a modern, multi-platform design system.
