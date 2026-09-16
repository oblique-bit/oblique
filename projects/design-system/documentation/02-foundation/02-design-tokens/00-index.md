# Oblique Design System - Token Documentation

**Design Tokens Hub** | *Complete documentation for the Oblique Design System token architecture*

---

## **Getting Started by Role**

| **New to Tokens?** | **Designer?** | **Developer?** | **Maintainer?** |
|---|---|---|---|
| **Tokenization Process** | **Designer Workflow** | **Developer Workflow** | [**System Requirements**](./01-system-requirements.md) |
| Start here to understand token creation and assignment | Figma + Tokens Studio workflow | Code implementation and assignment rules | Architecture and tooling priorities |

---

## **Foundation (Theory & Architecture)**

### **Core Concepts**
- [**Tokenization Process**](./99-workflows/README.md) - **START HERE** - Creating and assigning tokens in the design system
- [**Token Usage Guide**](./05-token-usage-guide.md) - **Which token do I use?** - Practical decision guide for color, dimension, and typography
- [**Architecture**](./02-architecture.md) - Token structure, layer system, and architectural patterns
- [**Token Naming**](./03-naming.md) - Naming conventions, patterns, and guidelines
- [**System Requirements**](./01-system-requirements.md) - Tooling compatibility priorities and cross-platform analysis
- **Modes System** - S1/S2/ob.s semantic levels and mode switching

---

## **Workflows (Practice by Role)**

### **For Maintainers**
- [**Maintainer Workflows**](./99-workflows/README.md) - Workflows and processes for design system maintainers
- [**Token Description Guidelines**](./99-workflows/token-description-guidelines.md) - How to write a token's `$description` field
- [**System Requirements**](./01-system-requirements.md) - Tooling compatibility and priorities
- [**Architecture**](./02-architecture.md) - Token structure and hierarchy rules
- [**Token Naming**](./03-naming.md) - Naming patterns and conventions

---

## **References (Documentation & Standards)**

### **Token Types**

The token docs are sorted along two axes. **Tiers** say where a token sits in the reference chain. **Categories** say what kind of value it holds, and cut across every tier.

#### **Tiers**
- [**Global Tokens**](./01-types/01-tiers/01-global-tokens.md) - System-wide foundation tokens
- [**Primitive Tokens**](./01-types/01-tiers/02-primitive-tokens.md) - Foundation values and architecture
- [**Semantic Tokens**](./01-types/01-tiers/03-semantic-tokens.md) - S1/S2/ob.s semantic layer system
- [**Component Tokens**](./01-types/01-tiers/04-component-tokens.md) - The top tier, in two peer branches: `ob.c.*` custom Oblique components and `ob.h.*` native HTML elements

#### **Categories**
- [**Colors**](./01-types/02-categories/01-color-tokens/) - Complete color system documentation
  - [Colors Overview](./01-types/02-categories/01-color-tokens/00-colors-overview.md)
  - [Primitive Colors](./01-types/02-categories/01-color-tokens/01-colors-primitive.md) | [Primitive Consumption](./01-types/02-categories/01-color-tokens/02-colors-primitive-consumption.md)
  - [Semantic Colors](./01-types/02-categories/01-color-tokens/03-colors-semantic.md)
  - [Brand](./01-types/02-categories/01-color-tokens/05-colors-semantic-brand.md) | [Neutral](./01-types/02-categories/01-color-tokens/04-colors-semantic-neutral.md) | [Interaction](./01-types/02-categories/01-color-tokens/06-colors-semantic-interaction.md) | [Status](./01-types/02-categories/01-color-tokens/07-colors-semantic-status.md) | [Free](./01-types/02-categories/01-color-tokens/08-colors-semantic-free.md)
- [**Dimension Tokens**](./01-types/02-categories/02-dimension-tokens.md) - Sizing and spacing, and how they resolve per mode
- [**Typography Tokens**](./01-types/02-categories/03-typography-tokens.md) - The rem base, the semantic scale, and the HTML text styles
- [**Motion Tokens**](./01-types/02-categories/04-motion-tokens.md) - Durations and easing curves, and the enabled/disabled motion mode
- [**Border Tokens**](./01-types/02-categories/05-border-tokens.md) - Radius, width, outline offset, and the focus-ring composites
- [**Shadow Tokens**](./01-types/02-categories/06-shadow-tokens.md) - The four elevation steps and how they export as Figma Effect Styles

### **Modes**
- [**Modes Overview**](./02-modes/00-modes-overview.md) - Complete mode system documentation
- [**Lightness Mode**](./02-modes/01-lightness.md) - Light/dark mode switching
- [**Emphasis Mode**](./02-modes/02-emphasis.md) - High/low emphasis design patterns
- [**UI Scale Mode**](./02-modes/03-ui-scale.md) - Component sizing variations (sm/md/lg)
- [**Typography-Context Mode**](./02-modes/04-typography-context.md) - Typography scaling for different contexts
- [**Density Mode**](./02-modes/05-density.md) - Interface density modes (compact/standard/spacious)
- [**Responsiveness**](./02-modes/06-viewport.md) - Viewport modes and responsive implementation
- [**Motion Mode**](./02-modes/07-motion.md) - Animation preference (enabled/disabled) and the reduced-motion class

### **Standards & Guidelines**
- [**Architecture**](./02-architecture.md) - Complete architectural patterns and layer system
- [**Token Naming**](./03-naming.md) - Complete naming conventions and compound units
- [**Token Description Guidelines**](./99-workflows/token-description-guidelines.md) - Documentation standards for maintainers

---

---

## **Most Common Tasks**

| **Task** | **Documentation** | **Quick Action** |
|---|---|---|
| **Which token do I use?** | [Token Usage Guide](./05-token-usage-guide.md) | Decision trees for color, dimension, typography |
| **Apply tokens in Figma** | Designer Workflow | Use Tokens Studio plugin, never Figma right panel |
| **Implement tokens in code** | Token Assignment Guidelines | Use ob.s semantic tokens for components |
| **Understand color hierarchy** | [Colors Overview](./01-types/02-categories/01-color-tokens/00-colors-overview.md) | Check S1→S2→ob.s semantic chain |
| **Fix broken token references** | [Architecture](./02-architecture.md) | Verify S1/S2/ob.s layer structure |
| **Understand naming patterns** | [Token Naming](./03-naming.md) | Review compound units and conventions |
| **Create new tokens** | [Tokenization Process](./99-workflows/README.md) | Ensure Figma compatibility first |
| **Mode customization** | Modes System | Modify S1 semantic level files |

---

## **Validation & Quality**

Use these validation scripts to ensure token integrity:

```bash
# Cross-page health check (recommended)
node scripts-custom/figma-doc-builders/validate-all.js
```

---

*Need help? Start with **Tokenization Process** for fundamentals, or jump directly to your role-specific workflow above.*
