# Density Concept
**Date:** October 29, 2025  
**Version:** v1.0
**Status:** UX Stakeholder Presentation and Approval pending

## Overview

This document outlines the **Density** system for component scaling, ensuring consistent layout breathing room and visual density control across different interface contexts.

**UX Impact**: Density directly affects how much information users can consume at once and how comfortable the interface feels. Compact density maximizes screen real estate for data-heavy workflows, while generous density provides breathing room for focus-intensive tasks. The right density choice improves both usability and user satisfaction by matching interface density to user context and cognitive load.

### **Research Foundation**
This concept is based on  [spacing and density research](https://confluence.bit.admin.ch/display/EUI/*Spacing+-+Research+-+Density+in+Design+Systems) conducted specifically for our design system context. The research validates density as an established UX pattern.

### **Mode Relationships**

Density mode works independently alongside other modes. For complete understanding of how density interacts with component-size and typography-context modes, see [Modes Interplay](./99-modes-interplay.md).

## Scope & Distinction: Density vs Component-Size modes

### **Clear mode Boundaries**
To avoid confusion about what impacts component sizing, we establish clear **responsibility patterns** between our two primary scaling systems:

**Component-Size mode controls** individual component dimensions and affects primarily **Molecules** (following Atomic Design principles):
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

**✅ Density-Reactive Components:**
- **Tables** - Row and cell spacing
- **Lists** - Item spacing and padding  
- **Form Containers** - Field spacing and layout gaps
- **Button Containers** - Button group spacing
- **Cards** - Container padding and content spacing
- **Modals** - Internal spacing and layout
- **Tabs** - Tab spacing and container padding
- **Expansion Panels** - Panel spacing and content gaps

**❌ Density-Neutral Components:**
- **Individual Buttons** - Size controlled by component-size mode
- **Input Fields** - Individual sizing not affected by density
- **Icons, Badges, Tooltips** - Fixed sizing regardless of density

For complete component reactivity across all modes, see [Modes Interplay](./99-modes-interplay.md).

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

---

## Responsive Density Behavior

### **Device-Appropriate Density Constraints**

Different screen sizes have different density requirements due to space limitations and interaction patterns:

**📱 Mobile (≤768px)**: **Compact density recommended**
- Small screens need tighter spacing to fit more content
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

## Conflicts & Unknown Issues

### **Mobile Touch Targets vs Density**

**Conflict**: Mobile needs compact density but also 44-48px touch targets. Increasing button size creates inconsistent row heights - rows with buttons become taller than rows without buttons.

**Status**: Needs specific guidelines for mixed-density layouts where accessibility overrides density constraints.

---

## **Design Rationale**

Density focuses specifically on **layout spacing and container behavior**. For rationale on why modes are kept independent and how they combine, see [Modes Interplay](./99-modes-interplay.md).

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
