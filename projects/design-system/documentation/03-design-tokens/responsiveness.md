# Responsive Tokens Documentation

**Status:** Updated for current token architecture

## Introduction

**About this document:** This document helps developers understand which tokens to use for media queries, along with the viewport strategy, token structure, and themes in Figma and Tokens Studio.

**Scope:** Tokenized Design System only. Pre Design System releases like Oblique R13 are not affected.

**Viewport Strategy:** The tokenized system currently supports two viewports: desktop and mobile.

## Global Breakpoint Primitives

### `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`

The supported breakpoint primitive values defined in `src/lib/themes/01_global/themes-scoped/static.json`:

- `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` - 0px (base for mobile viewports)
- `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` - 768px (desktop threshold)

**Note:** These are raw breakpoint values. Use the global responsive tokens below for actual development.

## Global Responsive Tokens

### `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport`

The primary token for media queries, defined in `src/lib/themes/01_global/themes-user/viewport/`:

| Theme | Token | References | Resolved Value | Description |
|-------|-------|------------|----------------|-------------|
| Desktop | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport` | `{ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport}` | `768px` | Applies when viewport is 768px and larger |
| Mobile | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport` | `{ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport}` | `0px` | No media query needed; applies to all viewports |

### `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport`

Used primarily as a variable in Figma. Enables component variants to respond to the active viewport:

- **Desktop theme:** `"desktop"`
- **Mobile theme:** `"mobile"`

**Usage example:**
- Figma component "button/container"
- Component variant: `viewport=mobile, buttons-order=primary-first, buttons=3, size=md, has-primary=true`
- Effect: Enforces vertical stacking and full-width layout for buttons on mobile viewport only

### `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport-responsive`

Responsive scaling multiplier that adjusts based on viewport:

- **Desktop theme:** `4` (standard scale)
- **Mobile theme:** `5` (1.25x larger for touch accessibility)

## Token File Structure

The responsive tokens are organized in the following files:

```
src/lib/themes/01_global/
|-- themes-scoped/
|   +-- static.json              # Contains ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.* primitives
+-- themes-user/
    +-- viewport/
        |-- desktop.json         # Desktop-specific responsive tokens
        +-- mobile.json          # Mobile-specific responsive tokens
```

## Usage Guidelines

### For Developers

1. **Use `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport` for media queries** - This token automatically resolves to the correct breakpoint value based on the active theme
2. **Use `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport` for conditional logic** - When you need to check the current viewport in code or Figma components
3. **Use `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport-responsive` for responsive scaling** - When sizing elements that need to scale differently on mobile vs desktop

### For Figma Designers

1. **Use `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport` in component variants** - Set up component variants that respond to the viewport token
2. **Reference breakpoint tokens** - Use the primitive breakpoint tokens when defining custom breakpoints in prototypes

## Current Device Landscape

For reference, here's how common devices map to our two-viewport strategy:

| Device | Screen Width (px) | Classification | Breakpoint Used |
|--------|-------------------|----------------|-----------------|
| iPhone SE (1st/2nd Gen) | 320 / 375 | Mobile | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (0px) |
| iPhone 13/14/15 | 390 | Mobile | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (0px) |
| Google Pixel 7 | 412 | Mobile | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (0px) |
| Samsung Galaxy S22 | 360 | Mobile | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (0px) |
| iPad (9.7", portrait) | 768 | Desktop | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (768px) |
| iPad Pro 11" (portrait) | 834 | Desktop | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (768px) |
| iPad Pro 12.9" (portrait) | 1024 | Desktop | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (768px) |
| MacBook Air/Pro | ≥1280 | Desktop | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (768px) |
| Common desktop monitor | ≥1440 | Desktop | `ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport` (768px) |

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
**Related Documentation:** [Token Consumption Guidelines](./guidelines-token-consumption.md), [Theming](./theming.md)
