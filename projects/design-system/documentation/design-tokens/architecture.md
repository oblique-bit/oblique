# Token Architecture

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

**Note:** Global tokens (`ob.g.*`) are an exception to the standard reference hierarchy and can be referenced from any semantic level. See [global-tokens.md](./global-tokens.md) for details.

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

## Token Examples

### **Semantic Token**
```
ob.s3.color.neutral.fg.contrast_high.inversity_normal
│  │  │     │       │   │            │
│  │  │     │       │   │            └─ Inversity variant
│  │  │     │       │   └─ Contrast level
│  │  │     │       └─ Property
│  │  │     └─ Subcategory
│  │  └─ Category
│  └─ Level
└─ Design System
```

### **Component Token**
```
ob.c.button.color.bg.primary.enabled
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
- `inversity-normal` / `inversity-flipped`
- `emphasis-high` / `emphasis-low`
- `contrast-highest` / `contrast-high` / `contrast-medium` / `contrast-low`

### **State Compounds**
- `bg-base` / `bg-hover` / `bg-focus` / `bg-active`
- `fg-base` / `fg-hover` / `fg-focus` / `fg-disabled`

---

## Guidelines

1. **Singular naming** - Use `color` not `colors`
2. **Lowercase only** - All segments lowercase
3. **Hyphen separation** - Connect compound words with hyphens
4. **Two words max** - Keep compound terms concise
5. **Hierarchical order** - Follow established segment order
6. **Reference hierarchy** - Follow proper reference chain (`Component -> Semantic -> Primitive`), with global tokens being the exception

### **Primitive vs Semantic Naming Guidelines**

**Primitive = Appearance** → Describe *what it looks like*
**Semantic = Intent** → Describe *why it's used*

This separation ensures clean abstraction levels and future-proof naming:

```
CORRECT PATTERN:
ob.p.color.basic.transparent     → "transparent" = visual appearance (alpha 0)
ob.s0.color.neutral.no-color     → "no-color" = semantic intent (absence of fill)
ob.c.button.color.bg.secondary   → references semantic token

BENEFITS:
- Primitive describes visual appearance ("transparent", "blue", "large")
- Semantic describes usage intent ("no-color", "primary", "emphasis-high")  
- Component tokens describe component-specific styling, not visual appearance
- Future changes (replacing "no-color" with faint tints) won't break components
- Naming remains timeless regardless of visual changes
```

**Example Application:**
- **Primitive**: `transparent` → rgba(0, 0, 0, 0) *(what it looks like)*
- **Semantic**: `no-color` → references transparent *(why it's transparent)*
- **Component**: `button.bg.secondary` → references no-color *(semantic usage)*

---

*Last updated: July 13, 2025*
