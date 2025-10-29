# Density Concept
**Date:** October 29, 2025  
**Version:** v1.0
**Status:** UX Stakeholder Presentation and Approval pending

## Overview

This document outlines the **Density** system for component scaling, ensuring consistent layout breathing room and visual density control across different interface contexts.

**UX Impact**: Density directly affects how much information users can consume at once and how comfortable the interface feels. Compact density maximizes screen real estate for data-heavy workflows, while generous density provides breathing room for focus-intensive tasks. The right density choice improves both usability and user satisfaction by matching interface density to user context and cognitive load.

### **Research Foundation**
This concept is based on  [spacing and density research](https://confluence.bit.admin.ch/display/EUI/*Spacing+-+Research+-+Density+in+Design+Systems) conducted specifically for our design system context. The research validates density as an established UX pattern.

### **Why This Document Covers Multiple modes**

We discuss **Density [mode](../01-introduction/glossary.md#mode-figma-context)** alongside other [modes](../01-introduction/glossary.md#mode-figma-context) because they are **deliberately independent** - [product designers](02-personas.md#21-productproject-designers) need to understand and control both density (layout spacing) and component-size (individual dimensions) together for complete layout control, while maintaining the flexibility to use any combination (e.g., compact density + large components).

## Scope & Distinction: Density vs Component-Size modes

### **Clear mode Boundaries**
To avoid confusion about what impacts component sizing, we establish clear **responsibility patterns** between our two primary scaling systems:

**Component-Size mode controls** individual component dimensions and affects primarily **Molecules** (following Atomic Design principles):
- **Button**, **Pills**, **Tags**, **Inputs** - individual component sizing (sm/md/lg)
- **Control**: [System consumer](../07-workflow/consumers/README.md#target-audience) can override the default component size based on contextual importance

**Density mode controls** spacing and layout density, primarily affecting **Data components and Organisms**:
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

### **Component Reactivity Reference**
The **Component [mode](../01-introduction/glossary.md#component-mode) Responsiveness Matrix** below provides the reference for which components react to which [modes](../01-introduction/glossary.md#mode-figma-context). 

**Note**: This matrix may be refined as components are redesigned and moved to an overarching document. Core principles (molecules → component-size, organisms → density) remain stable.

---

## Component Reactivity to mode Switches

**Status**: Architectural direction - subject to refinement as components are redesigned and tested in component interplay scenarios.

| Component | Density | Component-Size | Typography-Context | Notes |
|-----------|:-------:|:--------------:|:-----------------:|-------|
| **Button** | 0 | ✅ | 0 | Individual sizing |
| **Input/TextField** | 0 | ✅ | 0 | Form hierarchy sizing |
| **Avatar** | 0 | 0 | 0 | Fixed  |
| **Tag** | 0 | ✅ | 0 | Monochromatic navigation/input |
| **Pill** | 0 | ✅ | 0 | Colored status communication |
| **Badge** | 0 | 0 | 0 | Does not react
| **Icon** | 0 | ✅ | 0 | LOCKED - inherits from parent |
| **Text** | 0 | 0 | ✅ | Typography context (interface/prose) |
| **Table** | ✅ | 0 | 0 | Row/cell spacing controlled by density |
| **List** | ✅ | 0 | 0 | Item spacing from density |
| **Navigation Menu** | 0 | 0 | 0 | Fixed |
| **Form Container** | ✅ | 0 | 0 | spacing between fields from density |
| **Button Container** | ✅ | 0 | 0 | Button group spacing from density |
| **Card** | ✅ | 0 | 0 | Container with density-controlled spacing |
| **Modal** | ✅ | 0 | ✅ | Density spacing + text context |
| **Tabs** | ✅ | 0 | 0 | Tab spacing from density |
| **Expansion Panel** | ✅ | 0 | 0 | Panel spacing from density |
| **Infobox** | 0 | 0 | 0 | Fixed |
| **Notification** | 0 | ✅ | 0 |  |
| **Tooltip** | 0 | 0 | 0 | Fixed |
| **Spinner** | 0 | 0 | 0 | Fixed |
| **Slide Toggle** | 0 | 0 | 0 | Fixed |
| **Pagination** | 0 | 0 | 0 | Fixed  |

### **Legend**
- **✅** = Component reacts to mode switch
- **0** = Component does not react to mode switch
- **Density** = `compact/comfortable/spacious` affects spacing and layout
- **Component-Size** = `sm/md/lg` affects individual component dimensions
- **Typography-Context** = `interface/prose` affects text rendering and spacing

### **Key Patterns**
1. **Molecules** (Button, Input, Tag, Pill) → Component-Size mode only  
2. **Organisms** (Table, List, Form Container) → Density mode only
3. **Inheritance** (Badge, Icon) → Inherit sizing from parent component

---

## Guidelines: How to Combine Density and Component-Size modes

### **Recommended mode combinations for different contexts**

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

## Responsive Density Behavior

### **Device-Appropriate Density Constraints**

Different screen sizes have different density requirements due to space limitations and interaction patterns:

**📱 Mobile (≤768px)**: **Compact density recommended**
- Limited screen real estate requires maximum information efficiency
- Touch interaction patterns expect tighter spacing
- Users comfortable with scrolling for more content
- **Guideline**: Designers should restrict to compact density on mobile devices
- *Note: Technical enforcement in Figma is under investigation*

**📟 Tablet (769px-1024px)**: **Compact + Comfortable recommended**
- Moderate screen space allows some breathing room
- Hybrid touch/cursor interaction supports both densities

**🖥️ Desktop (≥1025px)**: **All densities available** 
- Ample screen space supports spacious layouts
- Cursor precision enables comfortable larger touch targets

### **Implementation Strategy**
[Product designers](02-personas.md#21-productproject-designers) set density based on viewport, overriding any broader density preferences for optimal device experience. This ensures interfaces remain usable and appropriate regardless of the underlying density system choice.

---

## Design Rationale: Independent modes

We kept **density and component-size [modes](../01-introduction/glossary.md#mode-figma-context)** separate because real products need **mixed combinations** (small buttons in spacious layouts, large CTAs in compact interfaces) - merged [modes](../01-introduction/glossary.md#mode-figma-context) would force predetermined combinations and limit [product designers'](02-personas.md#21-productproject-designers) flexibility.

### **Grid Independence**

Unlike other design systems (Dell, Horizon), we currently do not tie grid to density [modes](../01-introduction/glossary.md#mode-figma-context). Grid governs horizontal spacing (consistent gutters), while density governs vertical spacing. This may change when we tackle Grid as a foundational system.

---

## Open tasks

### **Pending Tasks**
1. **📋 Stakeholder Approval**: Present density concept to stakeholders for approval and feedback

### **Implementation** (Post-Approval)  
2. **� Token Architecture Refactoring**: Restructure dimension tokens to support multiple modes (component-size, density)
3. **⚙️ mode Implementation**: Implement density [variable modes](../01-introduction/glossary.md#mode-figma-context) in [token](../01-introduction/glossary.md#token) system.
4. **🧪 Testing & Validation**:
 Validate component behavior across all density and size combinations. Test [variable modes](../01-introduction/glossary.md#mode-figma-context) in Figma


---

*This document focuses specifically on the density system for layout spacing and visual breathing room control.*
