# Oblique Design System - Token Documentation

**Design Tokens Hub** | *Complete documentation for the Oblique Design System token architecture*

---

## **Getting Started**

| **New to Design Tokens?** | **Need Quick Reference?** | **Implementation Guide?** |
|---|---|---|
| Start with [**Architecture**](./architecture.md) | Check [**Foundation Overview**](../02-foundation/01-principles.md) | Read [**Guidelines**](./guidelines-token-consumption.md) |

---

## **Documentation Structure**

### **Core Architecture**
- [**Architecture**](./architecture.md) - Token structure, levels, and naming patterns
- [**Foundation Overview**](../02-foundation/01-principles.md) - Complete terminology and definitions reference
- [**Theming**](./theming.md) - S1/S2/S3 03_semantic levels and theme implementation

### **Color System**
- [**Colors Overview**](./colors/colors-overview.md) - Color token structure and usage
- [**Primitive Colors**](./colors/colors-02_primitive.md) - Foundation color values and token architecture
- [**Semantic Colors**](./colors/colors-03_semantic.md) - Layer system, token resolution, and consumption patterns
  - [**Brand Colors**](./colors/colors-03_semantic-brand.md) - Federal identity and brand implementation
  - [**Neutral Colors**](./colors/colors-03_semantic-neutral.md) - Backgrounds, text, borders, surfaces
  - [**Interaction Colors**](./colors/colors-03_semantic-interaction.md) - Hover, active, visited, disabled states  
  - [**Status Colors**](./colors/colors-03_semantic-status.md) - Success, warning, error, info states

---

### ** Implementation Guides**
- [**Token Consumption Guidelines**](./guidelines-token-consumption.md) - How to use tokens correctly
- [**Designer Guidelines**](./guidelines-for-designers.md) - Design system usage for designers
- [**Tokenization Checklist**](./tokenization-checklist.md) - Quick reference for complete tokenization workflow
- [**Component Identification**](../07-workflow/maintainers/readme.md) - Component token patterns
- [**Responsiveness**](./responsiveness.md) - Responsive token implementation

### **Technical References**
- [**Global Tokens**](./01_global-tokens.md) - System-wide token reference
- [**Style Dictionary Setup**](./style-dictionary-underscore-setup.md) - Build configuration
- [**Migration Guide**](./style-dictionary-underscore-setup.md) - Legacy system migration

---

## **Quick References**

### **Current Token Structure** (Post-OUI-4001)
```
ob.{layer}.{category}.{...path}

Layers:
  g  → Global tokens
  p  → Primitive (foundation tokens)
  s1 → Semantic Level 1 (lightness - light/dark themes)
  s2 → Semantic Level 2 (emphasis - high/low emphasis)
  s3 → Semantic Level 3 (clean compilation of all 03_semantic colors)
  c  → Component tokens
  h  → HTML element tokens
```

### **File Structure**
```
src/lib/themes/
├── 02_primitive/           # Foundation values
├── 03_semantic/color/
│   ├── s1-lightness/   # Light/dark theme files
│   ├── s2-emphasis/    # High/low emphasis files
│   └── s3-03_semantic/    # Complete 03_semantic color compilation
└── component/          # Component-specific tokens
```

### **Key Concepts**
- **S1/S2/S3 System** - Three-level 03_semantic system built on 02_primitive foundations
- **S3 Semantic Compilation** - Complete, clean collection of all 03_semantic colors
- **Simplified Reference Chain** - S1→Primitive, S2→Primitive, S3→Primitive (direct 02_primitive references)
- **Theme Switching** - Achieved through S1 lightness 03_semantic level (light.json/dark.json)
- **Emphasis Control** - S2 03_semantic level handles high/low emphasis variations

---

## **Most Common Tasks**

| **Task** | **Documentation** | **Quick Action** |
|---|---|---|
| Add new component tokens | [Token Consumption Guidelines](./guidelines-token-consumption.md) | Use S3 03_semantic tokens only |
| Understand color hierarchy | [Colors Overview](./colors/colors-overview.md) | Check S1→S2→S3 chain |
| Fix broken token references | [Architecture](./architecture.md) | Verify layer structure |
| Style Dictionary integration | [Style Dictionary Setup](./style-dictionary-underscore-setup.md) | Preserve underscore units |
| Theme customization | [Theming](./theming.md) | Modify S1 03_semantic level files |

---

## **Validation & Quality**

Use these validation scripts to ensure token integrity:

```bash
# complete validation (recommended)
node scripts-custom/validate-all.js

# Component token validation
node scripts-custom/validate-all-components.js

# Semantic layer structure validation  
node scripts-custom/validate-03_semantic-mirroring.js
```

---

## **Current Status**

**Token Structure**: Post-OUI-4001 S1/S2/S3 hierarchy implemented  
**Documentation**: Updated to reflect current architecture  
**Validation**: Automated scripts ensure reference integrity  
**Migration**: Legacy L1/L2/L3 references removed  

**Last Updated**: August 28, 2025  
**Architecture Version**: Post-OUI-4001  
**Status**: Production Ready  

---

*Need help? Check the [Foundation Overview](../02-foundation/01-principles.md) for terminology or [Guidelines](./guidelines-token-consumption.md) for implementation patterns.*
