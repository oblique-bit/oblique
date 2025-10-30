# Component-Size Mode
**Date:** September 17, 2025  
**Version:** v1.0 - Extracted from combined density-size concept  
**Status:** Done in https://github.com/oblique-bit/oblique/tree/tokens-develop-02.05

## Overview

This document outlines the **Component-Size** mode system for component scaling through unified size modes, ensuring consistent component relationships and accessible user experiences.

## Key principles

### **Harmonious component integration**
- Components work together consistently without visual conflicts
- Size relationships feel natural and intentional
- Proper component hierarchy maintained across all size variants
- Larger components maintain visual dominance over smaller ones

### **Effortless user experience** 
- Consistent interaction patterns across different contexts
- Predictable sizing behavior reduces cognitive load
- Context-appropriate scaling for different user types
- Maintained usability across all size variants

### **Accessible by design**
- All size variants maintain usability standards
- Touch targets preserved across scales (minimum 44px)
- Text readability preserved in size modes
- Focus indicators properly sized for context
- Universal design principles applied to all size variants

### **Developer experience**
- Components automatically coordinate without requiring manual size matching by developers
- Clear inheritance patterns reduce implementation complexity
- Single size collection reduces decision fatigue
- Unified naming convention across all components
- Automatic inheritance reduces manual sizing work
- Clear implementation patterns for development teams

---

## Size system (done)

### **Definition**
- **Triggers inset spacing** (inside components, mostly atoms and molecules)
- **Determines size of components** (primarily when grouped, in relation and context)

### **Implementation**
- **Figma**: Variable collection with modes `sm`, `md`, `lg`
- **Tokens Studio**: Theme group with themes `sm`, `md`, `lg`
- **Current naming**: Uses `component-size` theme group in `$themes.json` (located at `/src/lib/themes/`) - called this way because only certain components react to it currently, but can be expanded and renamed later when more components support size modes

### **Shared component sizes philosophy**
Shared sizes are beneficial for:
- **Visual and interaction consistency** (end user experience)
- **Efficiency** (product designer workflow)  
- **All components share one size collection**
- **Contextual inheritance** (sizing flows through interface hierarchy)
- **Component token boundaries** (each component defines its supported size range)
- **Reduced cognitive load** (designers work with unified size modes rather than individual component sizing decisions)

### **Individual visual size with unified naming**
- **Universal naming**: `sm`, `md`, `lg` across all components
- **Component-relative scaling**: Each component's "large" is large relative to itself
- **Visual compatibility**: LG button is larger than LG badge, but both are "large" and visually harmonious
- **Maintains relationships**: Badge can't be larger than a button at the same size level

### **What one size represents (e.g., LG)**
- **LG version of component itself**: Each component scales relative to its own baseline
- **Context for grouped components**: All components react and follow the size context/mode
- **Harmonious relationships**: Components maintain proportional relationships across sizes

### **Shared size context with boundaries**
Size functions as an overarching contextual layer that flows through the interface hierarchy:

**Global size declaration**: Container sets size context (sm/md/lg) for all descendants
```css
.form-section[data-size="lg"] {
  --size-context: lg;
}
```

**Component boundary respect**: Each component inherits the global context. Individual context can be set like for the navigation, both in Figma (baked-in variable mode inside the component) and code.

**Design system governance**: Maintainers define and document size boundaries based on:
- **Functional constraints**: Minimum usability requirements
- **Visual hierarchy**: Maintaining component relationships  
- **Context appropriateness**: Preventing visual overwhelm or under-emphasis

### **Proportional constraints**
Some components require **width = height** to maintain visual proportion:

**Square components:**
- **icon_holder**: Must maintain 1:1 aspect ratio for visual harmony

**Token structure:**
```json
"ob.c.icon_holder.size.standard": {
  "value": "{ob.s.dimension.dynamic.surface.md.rem}",
  "description": "Standard icon holder size, equivalent to 24px."
},
"ob.c.icon_holder.size.mini": {
  "value": "{ob.s.dimension.dynamic.surface.xs.rem}",
  "description": "Mini icon holder size for compact contexts, equivalent to 16px."
}
```

---

## Spacing roles

### **Size system spacing**
- **Spacing as tool**: Controls internal padding, gaps within components
- **Affects**: Button padding, input padding, icon gaps, internal component spacing
- **Does not affect**: Layout spacing between different components

---

## Context awareness and inheritance

### **Component role classification**
#### **Size Context Providers** (Set sizing context)

- **`dialog`** - Sets size context for all contents
- **`form`** - Sets height-matching context
- **`input`** - Sets context for tags, buttons, badges - also if no overarching context set by  form
- **`service-nav`** - Sets compact context for actions

#### **Size Context Consumers** (Inherit from context)
- **`tag`** - Inherits from input fields
- **`button`** - Inherits in form/dialog contexts
- **`badge`** - Inherits from nearby components
- **`icon`** - Always inherits from parent

### **Size coordination principle**
- **Input text field LG ≠ badge LG** (different visual sizes)
- **Both maintain visual relation** when scaled together
- **Container-level inheritance**: Set MD on container → all children inherit MD and scale together
- **Dimensional relationships preserved** across size changes

### **Inheritance types and key relationships**

#### **Inheritance Patterns**
1. **Locked inheritance from parents** (automatic mode/token inheritance pro component)
2. **Overridable inheritance** (can be changed if needed)
3. **No inheritance** (totally free - MD as default, but designer can override via variable modes)

#### **Key Component Relationships**
- **Input + Tag inside**: Height matching for multi-select scenarios
- **Input + Button**: Form row alignment  
- **Dialog + All Contents**: Size inheritance
- **Infobox + Button**: Action buttons in notifications
- **Any Component + Tooltip**: Context-aware help text
- **Any Component + Icon**: Always inherits from parent component

### **Scaling Direction**
- **Primarily vertical scaling** (up and down)
- **Horizontal scaling** as secondary consideration for limited set of organisms such as Dialog.

---



### **Fixed size (static size)**
- **Layout components**: master-layout navigation, paginator
- **Rationale**: Consistency and recognition prioritized over size flexibility
- **HowTo:**: Consumes static size/dimension tokens that do not react on mode/context.

---

**Core principle**: Size acts as an overarching context mode (sm/md/lg) that flows through the interface, but individual components have predetermined size boundaries set by design system maintainers.

**Technical implementation**:
- Components respect global size context when within their supported range
- Components fallback to nearest boundary when context exceeds their limits
- Size boundaries are documented and enforced at token level

### **Size inheritance workflow**
- **Large group level**: Apply to organisms, sections, templates
- **Contextual overrides**: Product designers can override for specific elements (e.g., primary conversion buttons)
- **Business/UX exceptions**: Requirements can override grouped size patterns

### **Development approach**
- **Holistic unification**: Size system implemented in single pass when all components ready
- **Workflow**: Set LG container → all inside components inherit LG

### **Accessibility implementation**
- **Touch target maintenance**: Minimum 44px touch targets preserved across all size variants
- **Readability standards**: Text contrast and sizing meet WCAG guidelines
- **Keyboard navigation**: Focus indicators properly sized for all contexts
- **Screen reader compatibility**: Size changes don't break assistive technology

---

## Size modes context matching

### **Size mode usage guidelines**

#### **Small size (sm)**
- **Use case**: Data-heavy interfaces, compact layouts
- **User type**: Power users preferring compact components
- **Context**: Administrative tools, dashboards with lots of data

#### **Medium size (md) - default**
- **Use case**: Standard applications  
- **User type**: General users requiring balanced approach
- **Context**: General purpose applications, standard interfaces

#### **Large size (lg)**
- **Use case**: Accessibility-focused interfaces, marketing sites
- **User type**: Users prioritizing clarity and ease of interaction
- **Context**: Onboarding flows, marketing sites, accessibility-focused interfaces

---

