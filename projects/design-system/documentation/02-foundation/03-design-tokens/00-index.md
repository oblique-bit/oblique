# Oblique Design System - Token Documentation

**Design Tokens Hub** | *Complete documentation for the Oblique Design System token architecture*

---

## **Getting Started by Role**

| **New to Tokens?** | **Designer?** | **Developer?** | **Maintainer?** |
|---|---|---|---|
| **Tokenization Process** | **Designer Workflow** | **Developer Workflow** | [**System Requirements**](./01-system-requirements.md) |
| Start here to understand token creation and assignment | Figma + Tokens Studio workflow | Code implementation and assignment rules | Architecture and tooling priorities |

---

## **📚 Foundation (Theory & Architecture)**

### **Core Concepts**
- [**Tokenization Process**](./99-workflows/tokenization-process.md) - **START HERE** - Creating and assigning tokens in the design system
- [**Architecture**](./02-architecture.md) - Token structure, layer system, and architectural patterns
- [**Token Naming**](./03-naming.md) - Comprehensive naming conventions, patterns, and guidelines  
- [**System Requirements**](./01-system-requirements.md) - Tooling compatibility priorities and cross-platform analysis
- **Modes System** - S1/S2/S3 semantic levels and mode switching

---

## **⚡ Workflows (Practice by Role)**

### **🔄 Core Process**
- **Complete Workflows** - All token workflows organized by role and process

### **🎨 For Designers**
- **Designer Workflow** - Complete Figma + Tokens Studio process
  - Token application checklist
  - Layer naming standards  
  - Validation requirements
  - Common violation patterns

### **👩‍💻 For Developers**  
- **Token Assignment Guidelines** - How to implement tokens in code
  - S1/S2/S3 consumption rules
  - Interactive vs. non-interactive components
  - Code generation patterns

### **🔧 For Maintainers**
- [**System Requirements**](./01-system-requirements.md) - Tooling compatibility and priorities
- [**Architecture**](./02-architecture.md) - Token structure and hierarchy rules
- [**Token Naming**](./03-naming.md) - Naming patterns and conventions

---

## **📖 References (Documentation & Standards)**

### **🎯 Token Types**
- [**Global Tokens**](./01-types/01-global-tokens.md) - System-wide foundation tokens
- [**Primitive Tokens**](./01-types/02-primitive-tokens.md) - Foundation values and architecture
- [**Semantic Tokens**](./01-types/03-semantic-tokens.md) - S1/S2/S3 semantic layer system
- [**Semantic Typography**](./01-types/04-semantic-typography-tokens.md) - Text styling and hierarchy
- [**Typography Foundation**](./01-types/05-typography-foundation.md) - Typography system foundation
- [**Component Tokens**](./01-types/06-component-tokens.md) - Component-specific token patterns
- [**Colors**](./01-types/07-color-tokens/) - Complete color system documentation
  - [Colors Overview](./01-types/07-color-tokens/00-colors-overview.md)
  - [Primitive Colors](./01-types/07-color-tokens/01-colors-primitive.md) 
  - [Semantic Colors](./01-types/07-color-tokens/03-colors-semantic.md)
  - [Brand](./01-types/07-color-tokens/05-colors-semantic-brand.md) | [Neutral](./01-types/07-color-tokens/04-colors-semantic-neutral.md) | [Interaction](./01-types/07-color-tokens/06-colors-semantic-interaction.md) | [Status](./01-types/07-color-tokens/07-colors-semantic-status.md)

### **🌓 Modes**
- **Modes Overview** - Complete mode system documentation
- **Lightness Mode** - Light/dark theme switching
- **Emphasis Mode** - High/low emphasis design patterns
- **UI Scale Mode** - Component sizing variations (sm/md/lg)
- **Typography-Context Mode** - Typography scaling for different contexts
- **Density Mode** - Interface density modes (compact/comfortable/spacious)
- **Responsiveness** - Viewport modes and responsive implementation

### **🔧 Standards & Guidelines**
- [**Architecture**](./02-architecture.md) - Complete architectural patterns and layer system
- [**Token Naming**](./03-naming.md) - Complete naming conventions and compound units
- **Token Description Guidelines** - Documentation standards for maintainers

---

---

## **⚡ Most Common Tasks**

| **Task** | **Documentation** | **Quick Action** |
|---|---|---|
| **Apply tokens in Figma** | Designer Workflow | Use Tokens Studio plugin, never Figma right panel |
| **Implement tokens in code** | Token Assignment Guidelines | Use S3 semantic tokens for components |
| **Understand color hierarchy** | [Colors Overview](./01-types/07-color-tokens/00-colors-overview.md) | Check S1→S2→S3 semantic chain |
| **Fix broken token references** | [Architecture](./02-architecture.md) | Verify S1/S2/S3 layer structure |
| **Understand naming patterns** | [Token Naming](./03-naming.md) | Review compound units and conventions |
| **Create new tokens** | [Tokenization Process](./99-workflows/tokenization-process.md) | Ensure Figma compatibility first |
| **Mode customization** | Modes System | Modify S1 semantic level files |

---

## **🔍 Validation & Quality**

Use these validation scripts to ensure token integrity:

```bash
# Complete validation (recommended)
node scripts-custom/validate-all.js

# Component token validation  
node scripts-custom/validate-all-components.js

# Semantic layer structure validation
node scripts-custom/validate-semantic-mirroring.js

# Token reference tracing
npm run trace-token "ob.c.button.primary.bg"
npm run search-tokens "button disabled"
```

---

## **📋 Current Status**

**Token Structure**: Post-OUI-4001 S1/S2/S3 hierarchy implemented  
**Documentation**: Reorganized by user role and workflow  
**Tooling Priority**: Figma > Code > Tokens Studio > W3C standards  
**Validation**: Automated scripts ensure reference integrity  

**Last Updated**: October 30, 2025  
**Architecture Version**: Post-OUI-4001  
**Status**: Production Ready  

---

*Need help? Start with **Tokenization Process** for fundamentals, or jump directly to your role-specific workflow above.*
