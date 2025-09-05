# Figma Component Decomposition Strategy: Breaking Down Large Components

## Overview

Strategic approach to decomposing complex, variant-heavy components into smaller, focused components to improve Figma performance.

---

## The Problem: Variant Explosion

### Design System Consumer Context

**Primary Users**: Business analysts (requirements engineers) and internal designers primarily use Figma in browser, not desktop app.

**Browser Performance Impact**: Large variant sets create significant performance degradation in browser-based Figma, affecting the majority of design system consumers who rely on lightweight, responsive components for their workflow.

### Performance Impact of Large Components

Button component with 480 variants causes performance issues in Figma across multiple pages.

**Community Confirmation**: Figma community has documented similar performance issues with large variant sets, requesting optimization for components with hundreds of variants. [Source: Figma Forum - Optimize performance in large variant sets](https://forum.figma.com/suggest-a-feature-11/optimize-performance-in-large-variant-sets-28624)

---

## Recommended Component Architecture

### Button_Aug Component Group Structure (Temporary)

#### 1. Button_Aug/Text

**Variants**: Size (4) × State (4) × Icon Position (3: none, left, right) × Button Type (3: primary, secondary, tertiary) = **144 variants**

```
Properties:
- Size: xs | sm | md | lg
- State: default | hover | pressed | disabled  
- Icon: none | left | right
- Button Type: primary | secondary | tertiary
- Text: Always visible

Children:
- Badge (show=off, default)
```

#### 2. Button_Aug/Icon-Only

**Variants**: Size (4) × State (4) × Button Type (2: secondary, tertiary) = **32 variants**

```
Properties:
- Size: xs | sm | md | lg (all 4 sizes)
- State: default | hover | pressed | disabled
- Button Type: secondary | tertiary only
- Icon: Single icon slot
- Text: Never visible

Children:
- Badge (show=off, default)
- Tooltip (show=off, default)
```

**Requirements:**
- **Icon-only**: Secondary and tertiary only (no primary)
- **Children**: Badge and tooltip as children with show=off default
- **Temporary naming**: Button_Aug to avoid disrupting existing button
- **Performance priority**: Optimized for browser-based Figma users (business analysts, requirements engineers, internal designers)

**Total**: 176 variants across 2 grouped components vs. 480 variants in single component

**Design System Consumer Benefit**: Lightweight components support browser-based workflow for majority of users (business analysts/requirements engineers and internal designers)

**Figma Organization**: Components grouped under `Button_Aug/` maintaining appearance of single component while enabling technical decomposition.

---

*Last updated: September 5, 2025*
