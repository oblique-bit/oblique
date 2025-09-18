# Research Summary: Dimension and Sizing Scales

**Date**: 2025-09-14

## 1. Objective

To establish a robust, scalable, and industry-aligned dimension token system by analyzing the practices of leading design systems. This research was initiated to correct inconsistencies and broken references in the existing token structure.

## 2. Design Systems Analyzed

The following design systems were analyzed based on existing competitive analysis files found in the project (`_private/competitive-analysis/`):

1.  **IBM Carbon**: `carbon-layout-tokens.js`
2.  **Shopify Polaris**: `shopify-polaris-tokens.js`
3.  **Microsoft Fluent UI**: `fluent-spacing-tokens.ts`

## 3. Key Findings & Principles Adopted

### 3.1. Core Unit & Grid System

-   **Observation**: All three systems heavily rely on a **4px or 8px grid**. Carbon and Polaris are explicitly 4px-based, while Fluent uses multiples that are consistent with a 4px grid.
-   **Decision**: Our primitive dimension scale **must** be based on a **4px grid** for major steps. This ensures consistency and predictability in layouts. Values below 4px are reserved for micro-adjustments.

### 3.2. Granularity and Scale

-   **Observation**: The systems provide a wide range of values, from very small "nudge" values (e.g., 1px, 2px) for fine-tuning, up to large values for page layouts. The scale is not strictly linear but follows a logical progression (e.g., 4, 8, 12, 16, 24, 32, 48...).
-   **Decision**: Our primitive scale **must** be comprehensive, including:
    -   **Micro-values** (1px, 2px) for details like borders.
    -   A **core set of values** from 4px to 64px that follow the 4px grid.
    -   A **macro set of values** for larger layout spacing (e.g., 80px, 96px, 128px and up).

### 3.3. Semantic Grouping

-   **Observation**: While primitives are raw values, they are consumed by semantic tokens that describe their intended use (e.g., `spacing-xs`, `container-padding`, `gap`).
-   **Decision**: A clear, multi-level semantic structure is required to give meaning to the primitive values. This led to the proposal of the 5-tier semantic dimension model (`detail`, `element`, `surface`, `container`, `layout`).

## 4. Conclusion

The adopted strategy is to build a new primitive dimension scale based on a 4px grid, providing a wide and granular range of values. These primitives will then be consumed by a newly defined 5-tier semantic model to ensure that token names are intuitive and their application is consistent. This approach aligns with industry best practices and provides a solid foundation for the design system.
