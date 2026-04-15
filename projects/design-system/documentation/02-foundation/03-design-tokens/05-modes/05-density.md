# Density System Specification
**Date:** November 3, 2025  
**Version:** v2.0
**Status:** Implementation Ready

## Overview

This document outlines the **Density** system for component scaling, ensuring consistent layout breathing room and visual density control across different interface contexts.

**UX Impact**: Density directly affects how much information users can consume at once and how comfortable the interface feels. Compact density maximizes screen real estate for data-heavy workflows, while generous density provides breathing room for focus-intensive tasks. The right density choice improves both usability and user satisfaction by matching interface density to user context and cognitive load.

### **Research Foundation**
This concept is based on  [spacing and density research](https://confluence.bit.admin.ch/display/EUI/*Spacing+-+Research+-+Density+in+Design+Systems) conducted specifically for our design system context. The research validates density as an established UX pattern.

### **Mode Relationships**

Density mode works independently alongside other modes. For complete understanding of how density interacts with ui_scale and typography-context modes, see [Modes Interplay](./99-modes-interplay.md).

## Scope & Distinction: Density vs UI Scale modes

### **Clear mode Boundaries**
To avoid confusion about what impacts component sizing, we establish clear **responsibility patterns** between our two primary scaling systems:

**UI Scale mode controls** individual component dimensions and affects primarily **Molecules** (following Atomic Design principles):
- **Button**, **Pills**, **Tags**, **Inputs** - individual component sizing (sm/md/lg)
- **Control**: [System consumer](../07-workflow/consumers/README.md#target-audience) can override the default component size based on contextual importance

**Density mode controls** spacing and layout density, primarily affecting **Data components and some Organisms**:
- **Tables**, **Lists**, **Forms** - container spacing and layout density
- **Purpose**: Information efficiency and screen real estate optimization  
- **Control**: System [mode](../01-introduction/glossary.md#mode-figma-context) defined by [product designer](02-personas.md#21-productproject-designers) to match product needs (compact/comfortable/spacious). Unlike Lightness [modes](../01-introduction/glossary.md#mode-figma-context) (light/dark), density is not offered as an end-user switch, though products may optionally add this in application settings for specific use cases. In practice, [product designers](02-personas.md#21-productproject-designers) select the appropriate density **[variable mode](../01-introduction/glossary.md#mode-figma-context)** in Figma's right panel when designing their interfaces.

### **What Density Controls vs What It Doesn't**
**✅ Density Controls:**
- **Information efficiency**: Controls how much content fits on screen without compromising usability
- **Product-level density**: System [mode](../01-introduction/glossary.md#mode-figma-context) set by [product designer](02-personas.md#21-productproject-designers) to match specific product needs
- **Container-level control**: Affects layout containers (tables, forms, lists) not individual components
- **Outer spacing**: Triggers spacing outside components, mostly atoms and molecules
- **Visual density**: Determines overall page layout density with outer gaps, margins, and layout breathing room
- **Specific areas**: Section spacing, card gaps, component margins

**❌ Density Does NOT Control:**
- **Typography density** - this is controlled by typography-context mode (interface/prose)
- **Internal component padding** or inset spacing within individual components

### **Density-Specific Component Behavior**

Density mode specifically affects the following component categories:

For complete component reactivity and density-reactive component lists, see [Modes Interplay](./99-modes-interplay.md).

---

## **Density Implementation Guidelines**

### **Density Level Definitions**

**Compact Density:**
- **Use case**: Data-heavy interfaces, power user workflows
- **Spacing**: Minimal breathing room, maximum information density
- **Target**: Administrative tools, dashboards, data tables

**Standard Density (Default):**
- **Use case**: General purpose applications
- **Spacing**: Balanced approach between information and comfort
- **Target**: Most web applications and standard interfaces

**Spacious Density:**
- **Use case**: Focus-intensive tasks, marketing content
- **Spacing**: Generous breathing room for clarity and ease
- **Target**: Onboarding flows, marketing sites, accessibility-focused interfaces

For responsive behavior, device constraints, mode conflicts, and design rationale, see [Modes Interplay](./99-modes-interplay.md).

---

## **Technical Implementation Specification**

### **Density Multiplier System**
**Current Multipliers:** Compact: 0.75, Standard: 1.0, Spacious: 1.5

### **Requirements Hierarchy (Implementation Priority)**
1. **All values different** between compact/standard/spacious modes (HIGHEST PRIORITY)
2. **Even numbers** preferred for better grid composition
3. **Divisible by 4** ideal for grid alignment (when achievable without violating #1)

### **Core Implementation Rules**
- ✅ **No 1px or 3px** base values in system (needed only for sizing edge-cases)
- ✅ **96px maximum** output (64px base × 1.5 spacious)
- ✅ **All values different** between compact/standard/spacious modes
- ✅ **Whole numbers only** for CSS compatibility (no decimals in final outputs)
- ✅ **Even numbers enforced** where possible without creating duplicates

### **Corrector Examples (Mathematical Corrections Applied)**

**Why Correctors Are Needed:**
Raw multiplication creates problematic values that violate design requirements. Correctors fix these issues:

**✅ 4px base (xs token):**
- **Raw compact**: 4px × 0.75 = 3px ❌ (violates "no 3px" rule)
- **Corrected compact**: 3px - 1px = 2px ✅ (C:-1px corrector applied)
- **Result**: Clean 2px/4px/6px progression

**✅ 12px base (xl token):**  
- **Raw compact**: 12px × 0.75 = 9px ❌ (odd number, awkward spacing)
- **Corrected compact**: 9px + 1px = 10px ✅ (C:+1px corrector applied)
- **Result**: Clean 10px/12px/18px progression

### **Token Architecture**

**Corrector Rules:**
- ✅ **Never correct the base value** - Standard mode must always remain unchanged
- ✅ **Only correct compact/spacious** - Apply correctors only to density variations  
- ✅ **Preserve mathematical base** - Standard mode = pure base value without correctors
- ✅ **Correctors for uniqueness** - Add correctors to meet "all values different" requirement
- ✅ **Correctors for grid alignment** - Apply correctors to achieve even numbers or 4px alignment

**Naming Convention:**
- ✅ **Flat T-shirt structure** - Uses xs/sm/md/lg/xl/2xl/3xl/4xl/5xl/6xl/7xl/8xl/9xl/10xl/11xl
- ✅ **No hierarchical categories** - Removed micro.sm, element.xs, spacing.md, container.lg structure
- ✅ **Simple progressive naming** - Direct xs → sm → md → lg → xl → 2xl → ... → 11xl progression

**Px/Rem Consistency:**
- ✅ **Parallel corrector system** - Decimal rem correctors are acceptable in development
- ✅ **Mathematical relationship maintained** - All rem values = px values ÷ 16

### **Complete Density Resolution Values**

| T-Shirt | Compact | Standard | Spacious | Px Corrector | Rem Corrector |
|---------|---------|----------|----------|--------------|---------------|
| xs | 2px / 0.125rem | 4px / 0.25rem | 6px / 0.375rem | C:-1px | C:-0.0625rem |
| sm | 4px / 0.25rem | 6px / 0.375rem | 8px / 0.5rem | C:-0.5px | C:-0.03125rem |
| md | 6px / 0.375rem | 8px / 0.5rem | 12px / 0.75rem | - | - |
| lg | 8px / 0.5rem | 10px / 0.625rem | 16px / 1rem | C:+0.5px | C:+0.03125rem, S:+1px, S:+0.0625rem |
| xl | 10px / 0.625rem | 12px / 0.75rem | 18px / 1.125rem | C:+1px | C:+0.0625rem |
| 2xl | 12px / 0.75rem | 16px / 1rem | 24px / 1.5rem | - | - |
| 3xl | 16px / 1rem | 20px / 1.25rem | 32px / 2rem | C:+1px, S:+2px | C:+0.0625rem, S:+0.125rem |
| 4xl | 20px / 1.25rem | 24px / 1.5rem | 40px / 2.5rem | C:+2px, S:+4px | C:+0.125rem, S:+0.25rem |
| 5xl | 24px / 1.5rem | 28px / 1.75rem | 44px / 2.75rem | C:+3px, S:+2px | C:+0.1875rem, S:+0.125rem |
| 6xl | 24px / 1.5rem | 32px / 2rem | 48px / 3rem | - | - |
| 7xl | 32px / 2rem | 36px / 2.25rem | 56px / 3.5rem | C:+5px, S:+2px | C:+0.3125rem, S:+0.125rem |
| 8xl | 32px / 2rem | 40px / 2.5rem | 64px / 4rem | C:+2px, S:+4px | C:+0.125rem, S:+0.25rem |
| 9xl | 36px / 2.25rem | 48px / 3rem | 72px / 4.5rem | - | - |
| 10xl | 44px / 2.75rem | 56px / 3.5rem | 88px / 5.5rem | C:+2px, S:+4px | C:+0.125rem, S:+0.25rem |
| 11xl | 48px / 3rem | 64px / 4rem | 96px / 6rem | - | - |

### **Implementation Notes**

**Grid Compatibility Philosophy:**
Individual values don't need 4px alignment if the total component height/width aligns to 4px grid for layout consistency.

**JSON File Structure:**
- **standard.json** - Pure base values with standard multiplier (1.0)
- **compact.json** - Base values with compact multiplier (0.75) + correctors
- **spacious.json** - Base values with spacious multiplier (1.5) + correctors

**Token References Pattern:**
```json
{
  "xs": {
    "px": {
      "$value": "({ob.p.dimension.px.4} * {ob.g.multiplier.dimension.density.compact}) - 1px",
      "$description": "C:-1px corrector applied"
    },
    "rem": {
      "$value": "({ob.p.dimension.rem.400} * {ob.g.multiplier.dimension.density.compact}) - 0.0625rem",
      "$description": "C:-0.0625rem corrector applied"
    }
  }
}
```

**Tokens Studio Compatibility Notes:**
- ✅ **Parentheses required**: Mathematical expressions use `({token} * {multiplier}) ± corrector` syntax
- ✅ **Spaces mandatory**: All operators must have spaces around them for Tokens Studio compatibility
- ✅ **Units required**: Corrector values must include units (`1px`, `0.5rem`) for proper evaluation
- ✅ **Simple operations**: Tokens Studio supports basic arithmetic but complex expressions need parentheses for proper evaluation

---

## Open Tasks

### **Implementation Status**
1. ✅ **Density Analysis Complete** - Mathematical validation and corrector strategy finalized
2. ✅ **Token Structure Defined** - Flat T-shirt naming and corrector rules established
3. 🔄 **JSON Implementation** - standard.json complete, compact.json and spacious.json pending
4. ⏳ **Figma Variable Mode Setup** - Configure Token Studio for density theme switching

---

*This document provides the complete technical specification for the density system implementation.*
