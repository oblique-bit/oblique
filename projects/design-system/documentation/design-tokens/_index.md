# Oblique Design System - Token Documentation

**Design Tokens Hub** | *Complete documentation for the Oblique Design System token architecture*

---

## 🚀 **Getting Started**

| **New to Design Tokens?** | **Need Quick Reference?** | **Implementation Guide?** |
|---|---|---|
| Start with [**Architecture**](./architecture.md) | Check [**Glossary**](./glossary.md) | Read [**Guidelines**](./guidelines-token-consumption.md) |

---

## 📚 **Documentation Structure**

### **🏗️ Core Architecture**
- [**Architecture**](./architecture.md) - Token structure, layers, and naming patterns
- [**Glossary**](./glossary.md) - Complete terminology and definitions reference
- [**Theming**](./theming.md) - S1/S2/S3 semantic layers and theme implementation

### **🎨 Color System**
- [**Colors Overview**](./colors/colors.md) - Color token structure and usage
- [**Semantic Colors**](./colors/colors-semantic.md) - S1/S2/S3 color hierarchy
- [**Brand Colors**](./colors/colors-semantic-brand.md) - Brand-specific color tokens
- [**Interaction Colors**](./colors/colors-semantic-interaction.md) - Interactive state colors
- [**Status Colors**](./colors/colors-semantic-status.md) - Status and feedback colors
- [**Neutral Colors**](./colors/colors-semantic-neutral.md) - Neutral color palette

### **📐 Implementation Guides**
- [**Token Consumption Guidelines**](./guidelines-token-consumption.md) - How to use tokens correctly
- [**Designer Guidelines**](./guidelines-for-designers.md) - Design system usage for designers
- [**Component Identification**](./component-identification.md) - Component token patterns
- [**Responsiveness**](./responsiveness.md) - Responsive token implementation

### **🔧 Technical References**
- [**Compound Units**](./compound-units.md) - Underscore naming patterns (e.g., `contrast_high`)
- [**Global Tokens**](./global-tokens.md) - System-wide token reference
- [**Style Dictionary Setup**](./style-dictionary-underscore-setup.md) - Build configuration
- [**Migration Guide**](./underscore-migration-plan.md) - Legacy system migration

---

## 🎯 **Quick References**

### **Current Token Structure** (Post-OUI-4001)
```
ob.{layer}.{category}.{...path}

Layers:
  p  → Primitive (s0 static tokens)
  s1 → Semantic Level 1 (lightness - light/dark themes)
  s2 → Semantic Level 2 (emphasis - high/low emphasis)
  s3 → Semantic Level 3 (clean compilation of all semantic colors)
  c  → Component tokens
  h  → HTML element tokens
  g  → Global tokens
```

### **File Structure**
```
src/lib/themes/
├── primitive/           # s0 - Static base values
├── semantic/color/
│   ├── s1-lightness/   # Light/dark theme files
│   ├── s2-emphasis/    # High/low emphasis files
│   └── s3-semantic/    # Complete semantic color compilation
└── component/          # Component-specific tokens
```

### **Key Concepts**
- **S1/S2/S3 System** - Three-layer semantic system with direct S1 references
- **S3 Semantic Compilation** - Complete, clean collection of all semantic colors
- **Simplified Reference Chain** - S3→S1 and S2→S1 (direct references, no hierarchy)
- **Theme Switching** - Achieved through S1 lightness layer (light.json/dark.json)
- **Emphasis Control** - S2 layer handles high/low emphasis variations

---

## ⚡ **Most Common Tasks**

| **Task** | **Documentation** | **Quick Action** |
|---|---|---|
| Add new component tokens | [Token Consumption Guidelines](./guidelines-token-consumption.md) | Use S3 semantic tokens only |
| Understand color hierarchy | [Colors Overview](./colors/colors.md) | Check S1→S2→S3 chain |
| Fix broken token references | [Architecture](./architecture.md) | Verify layer structure |
| Style Dictionary integration | [Style Dictionary Setup](./style-dictionary-underscore-setup.md) | Preserve underscore units |
| Theme customization | [Theming](./theming.md) | Modify S1 layer files |

---

## 🛡️ **Validation & Quality**

Use these validation scripts to ensure token integrity:

```bash
# Comprehensive validation (recommended)
node scripts-custom/validate-all.js

# Component token validation
node scripts-custom/validate-all-components.js

# Semantic layer structure validation  
node scripts-custom/validate-semantic-mirroring.js
```

---

## 📊 **Current Status**

✅ **Token Structure**: Post-OUI-4001 S1/S2/S3 hierarchy implemented  
✅ **Documentation**: Updated to reflect current architecture  
✅ **Validation**: Automated scripts ensure reference integrity  
✅ **Migration**: Legacy L1/L2/L3 references removed  

**Last Updated**: August 28, 2025  
**Architecture Version**: Post-OUI-4001  
**Status**: Production Ready  

---

*Need help? Check the [Glossary](./glossary.md) for terminology or [Guidelines](./guidelines-token-consumption.md) for implementation patterns.*
