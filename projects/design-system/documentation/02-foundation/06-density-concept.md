# Density Concept
**Date:** September 17, 2025  
**Version:** v1.0 - Extracted from combined density-size concept  
**Status:** To do

## Overview

This document outlines the **Density** system for component scaling, ensuring consistent layout breathing room and visual density control across different interface contexts.

## Design goals

### **Harmonious layout integration**
- Page layouts work together consistently without visual conflicts
- Density relationships feel natural and intentional
- Proper visual hierarchy maintained across all density variants

### **Effortless user experience** 
- Consistent spacing patterns across different contexts
- Predictable density behavior reduces cognitive load
- Context-appropriate spacing for different user types

### **Accessible by design**
- All density variants maintain usability standards
- Visual breathing room preserved across scales

### **Developer experience**
- Components automatically coordinate without requiring manual spacing matching by developers
- Clear inheritance patterns reduce implementation complexity
- Consistent API across density system

---

## Density system (to do)

### **Definition**
- **Triggers outer spacing** (outside components, mostly atoms and molecules)
- **Determines visual density** of one page layout
- **Does not trigger inset spacings** of smaller components like badges, buttons, form fields 

### **Implementation**
- **Figma**: Variable collection with variable modes (x, y, z - todo)
- **Tokens Studio**: Theme group in .json files with themes (x, y, z - todo)

### **Scope**
- Page-level visual density control
- Layout spacing between components
- Overall interface breathing room

---

## Spacing roles

### **Density system spacing**
- **Spacing as tool**: Controls outer gaps, margins, and layout breathing room
- **Affects**: Section spacing, card gaps, component margins
- **Does not affect**: Internal component padding or inset spacing

---

## Density and size interplay

### **Coordinated combinations and design context matching**

#### **Compact density + small size**
- **Use case**: Frequently used apps for power user personas
- **User type**: Power users prioritizing information density
- **Context**: Data-heavy interfaces, administrative tools

#### **Medium density + medium size (default)**
- **Use case**: Standard applications  
- **User type**: Standard users requiring balanced approach
- **Context**: General purpose applications, dashboards

#### **Generous density + large size**
- **Use case**: Simple flows, onboarding, simple dashboards, marketing websites
- **User type**: Users prioritizing clarity and ease of use
- **Context**: Marketing sites, onboarding flows, accessibility-focused interfaces

---

## Key principles

### **Visual hierarchy maintenance**
- Density relationships ensure proper layout hierarchy
- Larger spacing maintains visual separation
- Consistency across contexts and use cases
- Components work together consistently without visual conflicts

### **Designer and developer efficiency**
- Single density collection reduces decision fatigue
- Unified naming convention across all layouts
- Automatic inheritance reduces manual spacing work
- Clear implementation patterns for development teams

### **User experience consistency**
- Predictable spacing relationships across interface
- Context-appropriate density for different user types
- Consistent layout patterns across different contexts
- Maintained usability across all density variants

### **Accessibility First**
- Visual breathing room maintained in coordinated components
- Content readability preserved in density modes
- Focus indicators properly spaced for context
- Universal design principles applied to all density variants

---

## Token examples

### **Density token collection**
| Token Name | Compact | Medium | Generous |
|------------|---------|--------|----------|
| `ob.density.layout.section.gap` | 16px | 24px | 32px |
| `ob.density.layout.card.gap` | 12px | 16px | 24px |
| `ob.density.component.margin` | 8px | 12px | 16px |
| `ob.density.list.item.padding` | 8px | 12px | 16px |

### **Combined token usage example**
```css
/* Container sets density context */
.form-section[data-density="compact"] {
  --density-context: compact;
  gap: var(--ob-density-layout-section-gap-compact);
}
```

---

*This document focuses specifically on the density system for layout spacing and visual breathing room control.*
