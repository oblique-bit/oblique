# Token Architecture

**About this document:** This document defines the token architecture for the Oblique Design System.

**Scope:** Token structure, naming patterns, and hierarchical organization.

---

## 🏗️ **Token Structure**

Tokens follow a hierarchical structure with dot-separated segments:

**Semantic Token Pattern:**
```
{namespace.layer.category.level.subcategory.property.contrast.theme}
```

**Component Token Pattern:**
```
{namespace.layer.component.category.property.variant.state}
```

**Global Token Pattern:**
```
{namespace.layer.category.property}
```

**Note:** Global tokens (`ob.g.*`) are an exception to the standard reference hierarchy and can be referenced from any level. See [global-tokens.md](./global-tokens.md) for details.

---

## 🔧 **Core Segments**

### **Namespace**
- `ob` - Oblique namespace (all tokens start with this)

### **Layers**
- `p` - Primitive layer (base values)
- `s` - Semantic layer (contextual meaning)
- `c` - Component layer (component-specific)
- `g` - Global layer (system-wide settings)
- `h` - HTML layer (HTML element tokens)

### **Categories**
- `color` - Color-related tokens
- `typography` - Typography tokens
- `spacing` - Spacing and layout
- `sizing` - Size-related tokens

### **Properties**
- `bg` - Background
- `fg` - Foreground/text
- `border` - Border properties

### **Levels (Semantic Layer)**
- `l1` - Level 1 semantic tokens (lightness)
- `l2` - Level 2 semantic tokens (inversity)
- `l3` - Level 3 semantic tokens (emphasis)

---

## 📋 **Token Examples**

### **Semantic Token**
```
ob.s.color.l2.interaction.emphasis-high.bg-base.contrast-high.inversity-normal
│  │  │     │   │           │            │       │              │
│  │  │     │   │           │            │       │              └─ Theme
│  │  │     │   │           │            │       └─ Contrast level
│  │  │     │   │           │            └─ Property
│  │  │     │   │           └─ Compound term
│  │  │     │   └─ Category
│  │  │     └─ Level
│  │  └─ Category
│  └─ Layer
└─ Namespace
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
│  └─ Layer
└─ Namespace
```

---

## 🔗 **Compound Terms**

Key compound patterns used in tokens:

### **Theme Compounds**
- `inversity-normal` / `inversity-flipped`
- `emphasis-high` / `emphasis-low`
- `contrast-highest` / `contrast-high` / `contrast-medium` / `contrast-low`

### **State Compounds**
- `bg-base` / `bg-hover` / `bg-focus` / `bg-active`
- `fg-base` / `fg-hover` / `fg-focus` / `fg-disabled`

---

## 📋 **Guidelines**

1. **Singular naming** - Use `color` not `colors`
2. **Lowercase only** - All segments lowercase
3. **Hyphen separation** - Connect compound words with hyphens
4. **Two words max** - Keep compound terms concise
5. **Hierarchical order** - Follow established segment order
6. **Reference hierarchy** - Follow proper reference chain (`Component → Semantic → Primitive`), with global tokens being the exception

---

*Last updated: July 13, 2025*
