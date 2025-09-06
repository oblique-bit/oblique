# Figma Component Decomposition Strategy: Breaking Down Large Components

**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Strategic approach to decomposing complex, variant-heavy components into smaller, focused components

## **Target Audience**
**Primary:** DS/Oblique Designers, DS/Oblique Developers  
**Secondary:** Component Architects, Figma Library Maintainers  
**Prerequisites:** Advanced Figma component knowledge, performance optimization understanding  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

## Overview

Strategic approach to decomposing complex, variant-heavy components into smaller, focused components to improve Figma performance.

---

## The Problem: Variant Explosion

### Performance Impact of Large Components

Button component with 480 variants causes performance issues in Figma across multiple pages.

**User Impact**: Affects [internal designers and business analysts](../../02-foundation/02-personas.md) who primarily use browser-based Figma. Large variant sets create significant performance degradation in browser environments.

### Maintenance Complexity

**480-variant maintenance nightmare**: Current button architecture creates significant maintenance overhead:
- Component updates require touching hundreds of variants simultaneously
- Property changes cascade across entire variant set
- Quality assurance requires testing 480 different combinations
- Design system updates become time-intensive and error-prone

**Community Confirmation**: Figma community has documented similar performance issues with large variant sets, requesting optimization for components with hundreds of variants. [Source: Figma Forum - Optimize performance in large variant sets](https://forum.figma.com/suggest-a-feature-11/optimize-performance-in-large-variant-sets-28624)

---

## Recommended Component Architecture

### Button_Aug Component Group Structure (Temporary)

#### 1. Button_Aug/Text

**Variants**: Size (3) × State (4) × Icon Position (3: none, left, right) × Button Type (3: primary, secondary, tertiary) = **108 variants**

```
Properties:
- Size: sm | md | lg
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

**Total**: 176 variants across 2 grouped components vs. 480 variants in single component

**Figma Organization**: Components grouped under `Button_Aug/` maintaining appearance of single component while enabling technical decomposition.

---

*Last updated: September 5, 2025*
