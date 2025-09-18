# Token Architecture
**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Define token architecture for the Oblique Design System

**About this document:** This document defines the token architecture for the Oblique Design System.

**Scope:** Token structure, naming patterns, and hierarchical organization.

---

## Token Structure

Tokens follow a hierarchical structure with dot-separated segments:

**Semantic Token Pattern:**
```
{namespace.semantic_level.category.subcategory.property.contrast.theme}
```

**Component Token Pattern:**
```
{namespace.semantic_level.component.category.property.variant.state}
```

**Global Token Pattern:**
```
{namespace.semantic_level.category.property}
```

**Note:** Global tokens (`ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`) are an exception to the standard reference hierarchy and can be referenced from any semantic level. See [01_global-tokens.md](./01_global-tokens.md) for details.

---

## Core Segments

### **Namespace**
- `ob` - Oblique namespace (all tokens start with this)

### **Levels**
- `p` - Primitive Level (base values)
- `s1` - Semantic Level 1 (lightness - light/dark theme handling)
- `s2` - Semantic Level 2 (emphasis - high/low emphasis variations)
- `s3` - Semantic Level 3 (compilation of all semantic colors - no modes)
- `c` - Component Level (Oblique custom components)
- `g` - Global Level (system-wide settings)
- `h` - HTML Level (HTML components)

### **Categories**
- `color` - Color-related tokens
- `typography` - Typography tokens
- `spacing` - Spacing and layout
- `sizing` - Size-related tokens

### **Properties**
- `bg` - Background
- `fg` - Foreground/text
- `border` - Border properties

### **Semantic Level Structure**
- `s1` - Lightness Semantic Level: Handles light/dark theme switching (light.json, dark.json)
- `s2` - Emphasis Semantic Level: Manages high/low emphasis levels (high.json, low.json)
- `s3` - Semantic Compilation: Complete collection of all semantic colors (semantic.json)

---

## CRITICAL: Token Naming vs File Structure

**IMPORTANT**: Token names DO NOT follow folder and JSON file naming conventions. File organization is for development convenience only.

### **File Structure vs Token Names**
```
File: 01_global/02-multipliers/dimension/md.json
Token Name: ob.g.multiplier.dimension.md
```

**Rule**: You cannot create tokens by knowing only the folder and JSON file name. You must understand the documented architecture patterns.

---

## Global Multiplier Tokens

Global multiplier tokens enable proportional scaling across the design system without token explosion.

### **Structure Pattern**
```
ob.g.multiplier.{category}.{size}
```

### **Multiplier Token Examples**

**Dimension Multipliers**
```
ob.g.multiplier.dimension.sm    → 0.8  (80% scaling)
ob.g.multiplier.dimension.md    → 1.0  (100% baseline)  
ob.g.multiplier.dimension.lg    → 1.2  (120% scaling)
```

**Spacing Multipliers**
```
ob.g.multiplier.spacing.sm      → 0.8  (compact spacing)
ob.g.multiplier.spacing.md      → 1.0  (standard spacing)
ob.g.multiplier.spacing.lg      → 1.2  (generous spacing)
```

**Typography Multipliers**
```
ob.g.multiplier.typography.sm   → 0.875 (87.5% scaling)
ob.g.multiplier.typography.md   → 1.0   (100% baseline)
ob.g.multiplier.typography.lg   → 1.125 (112.5% scaling)
```

**Viewport Multipliers**
```
ob.g.multiplier.viewport.desktop → 1.0  (desktop baseline)
ob.g.multiplier.viewport.mobile  → 1.25 (mobile enhancement)
```

### **Multiplier Token References**
```
{ob.g.multiplier.dimension.md}      ← Correct
{02-multipliers.dimension.md}       ← Incorrect
```

---

## Token Examples

### **Semantic Token**
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index
│  │  │      │     │   │       │
│  │  │      │     │   │       └─ State
│  │  │      │     │   └─ Variant
│  │  │      │     └─ Property
│  │  │      └─ Category
│  │  └─ Component
│  └─ Level
└─ Design System
```

---

## Compound Terms

Key compound patterns used in tokens:

### **Semantic Compounds**
- `inversity_normal` / `inversity_flipped`
- `emphasis_high` / `emphasis_low`
## Lightness Categorization Levels

- `contrast_highest` / `contrast_high` / `contrast_medium` / `contrast_low`

### **State Compounds**
- `bg_base` / `bg_hover` / `bg_focus` / `bg_active`
- `fg_base` / `fg_hover` / `fg_focus` / `fg-disabled`

---

## Guidelines

1. **Singular naming** - Use `color` not `colors`
2. **Lowercase only** - All segments lowercase
3. **Hyphen separation** - Connect compound words with hyphens
4. **Two words max** - Keep compound terms concise
5. **Hierarchical order** - Follow established segment order
6. **Reference hierarchy** - Follow proper reference chain (`Component -> Semantic -> Primitive`), with 01_global tokens being the exception

### **Primitive vs Semantic Naming Guidelines**

**Primitive = Appearance** → Describe *what it looks like*
**Semantic = Intent** → Describe *why it's used*

This separation ensures clean abstraction levels and future-proof naming:

```
CORRECT PATTERN:
ob.p.color.red.50.red.50.red.50     → "transparent" = visual appearance (alpha 0)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index   → references semantic token

BENEFITS:
- Primitive describes visual appearance ("transparent", "blue", "large")
- Semantic describes usage intent ("no_color", "primary", "emphasis_high")  
- Component tokens describe component-specific styling, not visual appearance
- Future changes (replacing "no_color" with faint tints) won't break components
- Naming remains timeless regardless of visual changes
```

**Example Application:**
- **Primitive**: `transparent` → rgba(0, 0, 0, 0) *(what it looks like)*
- **Semantic**: `no_color` → references transparent *(why it's transparent)*
- **Component**: `button.bg.secondary` → references no_color *(semantic usage)*

---

## Token Architecture Requirements

The design system's token architecture follows a strict, hierarchical structure to ensure scalability, maintainability, and clarity.

1.  **Three Core Layers**: The architecture consists of three primary layers:
    *   **Primitives (`ob.p`)**: The single source of truth for raw, context-free values.
    *   **Semantics (`ob.s`)**: The contextual layer that maps primitives to specific use cases.
    *   **Component Themes (`ob.h`, `ob.c`)**: The consumption layer that applies semantic tokens to UI components.

2.  **Unidirectional Flow**: The token flow is strictly unidirectional: `Primitives` -> `Semantics` -> `Components`. A layer can only reference the layer directly above it.

3.  **No Calculations in Consumer Layers**: All calculations, particularly those involving 01_global multipliers (`ob.g.*`), **must** occur exclusively within the semantic layer (`ob.s`). Component theme layers (`ob.h`, `ob.c`) are forbidden from performing calculations and must consume pre-defined `static` or `dynamic` semantic tokens.

### Examples

#### ✔️ Do: Consume pre-defined semantic tokens in components.

Component-level tokens should directly reference a token from the semantic layer (`ob.s`). This keeps the component layer clean and free of logic.

```json
// In: ob.h.button.json (Component Theme Layer)
{
  "min_height": {
    "$value": "{ob.s.dimension.dynamic.container.xs.rem}"
  }
}
```

#### ❌ Don't: Perform calculations in the component layer.

Calculations using 01_global multipliers (`ob.g.*`) are strictly forbidden at the component (`ob.h`, `ob.c`) level. This was a critical mistake that violated the architecture. All calculations must be done in the semantic layer.

```json
// In: ob.h.button.json (Component Theme Layer)
// THIS IS FORBIDDEN!
{
  "font_size": {
    "$value": "{ob.p.fontSizeUnitless.400} * {ob.g.multiplier.typography}"
  }
}
```

---

*Last updated: July 13, 2025*
