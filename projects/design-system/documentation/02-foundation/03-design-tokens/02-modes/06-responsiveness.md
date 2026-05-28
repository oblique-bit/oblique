# COR_viewport · xs / sm / md / lg / xl / 2xl

**Status:** Updated for current token architecture

## Introduction

**About this document:** This document helps developers understand which tokens to use for media queries, along with the viewport strategy, token structure, and themes in Figma and Tokens Studio.

**Scope:** Tokenized Design System only. Pre Design System releases like Oblique R13 are not affected.

**Viewport Strategy:** The tokenized system supports six breakpoints: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`.

## Breakpoint modes

`COR_viewport` defines six modes. Exact pixel thresholds are TBD — pending breakpoint decision.

| Mode | Breakpoint | Notes |
|---|---|---|
| `xs` | TBD | Narrowest — smallest phones |
| `sm` | TBD | Small phones |
| `md` | TBD | Default — most phones landscape / small tablets |
| `lg` | TBD | Tablets / large phones |
| `xl` | TBD | Tablets landscape / small desktops |
| `2xl` | TBD | Wide desktop |

**Previous strategy (two viewports):** The old `desktop` / `mobile` split used a single 768px threshold. The new six-breakpoint model aligns with standard responsive conventions (Bootstrap, Tailwind). Exact thresholds require a team decision before implementation.

## Global Breakpoint Primitives

### `ob.g.viewport.breakpoint.*`

Breakpoint primitive values defined in `src/lib/themes/01_global/themes-scoped/static.json`. Will expand from min/max to six values once thresholds are decided.

**Note:** These are raw breakpoint values. Use the global responsive tokens below for actual development.

## Global Responsive Tokens

### `ob.g.modes.viewport`

The primary token for media queries, defined in `src/lib/themes/01_global/themes-user/viewport/`. Token files will expand from `desktop.json` / `mobile.json` to `xs.json` through `2xl.json` once thresholds are finalised.

### `ob.g.viewport.multiplier`

Responsive scaling multiplier — currently two values (desktop: `4`, mobile: `5`). Will be extended per breakpoint once the six-mode model is adopted.

## Token File Structure

The responsive tokens are organized in the following files:

```
src/lib/themes/01_global/
|-- themes-scoped/
|   +-- static.json              # Contains ob.g.viewport.breakpoint.* primitives
+-- themes-user/
    +-- viewport/
        |-- desktop.json         # Desktop-specific responsive tokens
        +-- mobile.json          # Mobile-specific responsive tokens
```

## Usage Guidelines

### For Developers

1. **Use `ob.g.modes.viewport` for media queries** - This token automatically resolves to the correct breakpoint value based on the active theme
2. **Use `ob.g.modes.viewport` for conditional logic** - When you need to check the current viewport in code or Figma components
3. **Use `ob.g.viewport.multiplier` for responsive scaling** - When sizing elements that need to scale differently on mobile vs desktop

### For Figma Designers

1. **Use `ob.g.modes.viewport` in component variants** - Set up component variants that respond to the viewport token
2. **Reference breakpoint tokens** - Use the primitive breakpoint tokens when defining custom breakpoints in prototypes

## Current Device Landscape

For reference, here's how common devices map to our two-viewport strategy:

| Device | Screen Width (px) | Classification | Breakpoint Used |
|--------|-------------------|----------------|-----------------|
| iPhone SE (1st/2nd Gen) | 320 / 375 | Mobile | `ob.g.viewport.breakpoint.min` (0px) |
| iPhone 13/14/15 | 390 | Mobile | `ob.g.viewport.breakpoint.min` (0px) |
| Google Pixel 7 | 412 | Mobile | `ob.g.viewport.breakpoint.min` (0px) |
| Samsung Galaxy S22 | 360 | Mobile | `ob.g.viewport.breakpoint.min` (0px) |
| iPad (9.7", portrait) | 768 | Desktop | `ob.g.viewport.breakpoint.max` (768px) |
| iPad Pro 11" (portrait) | 834 | Desktop | `ob.g.viewport.breakpoint.max` (768px) |
| iPad Pro 12.9" (portrait) | 1024 | Desktop | `ob.g.viewport.breakpoint.max` (768px) |
| MacBook Air/Pro | ≥1280 | Desktop | `ob.g.viewport.breakpoint.max` (768px) |
| Common desktop monitor | ≥1440 | Desktop | `ob.g.viewport.breakpoint.max` (768px) |

## Industry Standards Comparison

| Design System | Mobile Max | Desktop Min |
|---------------|------------|-------------|
| Bootstrap | 767px | 768px |
| Tailwind CSS | 639px | 640px |
| Material Design | 599px | 600px+ (Tablet), 840px (Desktop) |
| Apple HIG | ~767px | ~768px |
| IBM Carbon | 672px | 1056px |
| **Oblique** | **767px** | **768px** |

---

**Last Updated:** January 2025  
**Related Documentation:** Token Consumption Guidelines, Modes System
