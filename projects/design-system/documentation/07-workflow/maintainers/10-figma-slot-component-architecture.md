# Figma Slot Component Architecture

**Version:** 1.0  
**Date:** September 5, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Implement flexible slot-based component architecture in Figma to reduce variant explosion

## **Target Audience**
**Primary:** DS/Oblique Designers, DS/Oblique Developers  
**Secondary:** Component Architects, Figma Advanced Users  
**Prerequisites:** Advanced Figma component knowledge, understanding of slot patterns, component architecture  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

## Overview

Slot components are a powerful technique for creating flexible and reusable components with dynamic content in Figma. They're inspired by the `<slot>` HTML element and prevent designers from detaching components while providing content flexibility.

---

## What is a Slot Component?

A slot component is a **placeholder within a main component** that can be replaced with other components or custom content. Instead of creating hundreds of variants for every possible content configuration, you create a single "shell" component with designated "slots."

### **Core Concept**
```
Main Component (Shell)
├── Fixed Structure (headers, footers, layout)
├── Slot 1 (Instance Swap Property) → Flexible Content
├── Slot 2 (Instance Swap Property) → Flexible Content
└── Optional Children (Boolean Properties) → Show/Hide
```

---

## Key Benefits and Use Cases

### **Addresses Our Current Challenges**

**1. Reduces Variant Explosion**
- **Problem**: Our button component has 480 variants (documented in [Component Decomposition Strategy](./09-figma-component-decomposition-strategy.md))
- **Solution**: Single component with slots instead of hundreds of variants

**2. Prevents Detaching**
- **Problem**: Designers detach instances to add custom content, breaking library connections
- **Solution**: Sanctioned way to add custom content without detaching

**3. Promotes Consistency**
- **Problem**: Detached components lose design system constraints
- **Solution**: Slots enforce consistent structure while allowing content flexibility

**4. Improves Scalability**
- **Problem**: Can't anticipate every use case
- **Solution**: Flexible slots for designers to build custom content

### **Optimal Use Cases**

| **Component Type** | **Slot Application** | **Oblique Example** |
|-------------------|---------------------|-------------------|
| **Modals** | Fixed header/footer, flexible body slot | Alert dialogs with custom content |
| **Cards** | Media slot, title slot, action slot | Content cards with various layouts |
| **Accordions** | Fixed title bar, flexible content slot | FAQ sections with mixed content |
| **Containers** | Fixed constraints, flexible content slot | Page/section containers with dynamic content |
| **Navigation** | Fixed structure, flexible menu slots | Nav bars with custom menu items |

---

## How to Create Slot Components

### **Step-by-Step Process**

**1. Create Placeholder Component**
- Design simple component acting as "slot"
- Name clearly: "Slot", "Placeholder", "Replace Me"
- Visual style: Dashed border, neutral background
- Make it obvious for users

**2. Nest the Placeholder**
- Place placeholder instance inside main component
- Position within layout structure
- Apply proper constraints

**3. Apply Auto Layout**
- **Critical**: Set up Auto Layout on main component AND placeholder
- Enables automatic resizing when slot content changes
- Ensures responsive behavior

**4. Configure Instance Swap**
- Select placeholder in main component
- Create Instance Swap Property
- Set preferred instances for common use cases

### **Implementation Example: Card Component**

```
Card Component Structure:
├── Header (Fixed)
├── Media Slot (Instance Swap Property)
│   └── Placeholder Component → Swappable with images, videos, graphics
├── Content Slot (Instance Swap Property)  
│   └── Placeholder Component → Swappable with text blocks, lists, forms
├── Action Slot (Instance Swap Property)
│   └── Placeholder Component → Swappable with buttons, links, controls
└── Footer (Fixed)
```

---

## Integration with Oblique Design System

### **Current Slot-like Patterns**

Our design system already uses slot-like patterns:

**1. Button_Aug Architecture**
- **Badge Child**: Boolean property (show=off default) - Slot-like hiding
- **Tooltip Child**: Boolean property (show=off default) - Slot-like hiding
- **Icon Position**: Acts as icon slot with positioning control

**2. Container Component System**
- **Content Areas**: Flexible content within fixed constraints
- **Responsive Variants**: Container=wide|narrow acting as content slots

### **Recommended Implementation Roadmap**

**Phase 1: Establish Slot Standards**
1. Create placeholder component library
2. Document slot naming conventions
3. Define Auto Layout requirements

**Phase 2: Refactor Existing Components**
1. **Button_Aug**: Convert to full slot architecture
2. **Container Components**: Add explicit content slots
3. **Navigation Components**: Implement menu slots

**Phase 3: New Slot Components**
1. **Modal/Dialog System**: Header/body/footer slots
2. **Card System**: Media/content/action slots
3. **Form Components**: Label/input/help slots

---

## Technical Requirements

### **Auto Layout Configuration**

**Main Component Setup:**
- **Direction**: Vertical or Horizontal as needed
- **Spacing**: Consistent with design tokens
- **Padding**: Reference container tokens
- **Resizing**: "Hug contents" for adaptive sizing

**Slot Placeholder Setup:**
- **Fill**: "Fill container" for flexible sizing
- **Constraints**: Appropriate for content type
- **Min/Max**: Set reasonable limits

### **Instance Swap Properties**

**Naming Convention:**
```
{ComponentName}_{SlotName}_Slot
Examples:
- Card_Media_Slot
- Modal_Body_Slot
- Nav_Menu_Slot
```

**Preferred Instances:**
- Set common use case components
- Include "Empty" placeholder option
- Reference design system component library

---

## Connection to Existing Documentation

### **Solves Problems Identified In:**

**1. [Component Decomposition Strategy](./09-figma-component-decomposition-strategy.md)**
- **480 variant problem**: Slots reduce variants dramatically
- **Performance issues**: Fewer variants = better performance
- **Maintenance complexity**: Single component easier to maintain

**2. [Container Component Concept](../../03-design-tokens/container-component-concept.md)**
- **Content flexibility**: Slots provide dynamic content areas
- **Nested support**: Slot architecture supports nesting naturally

**3. [Button Component Behavior](../../04-components/02-button.md)**
- **Badge/Tooltip children**: Already slot-like with Boolean properties
- **Container variants**: Can be enhanced with slot architecture

### **Enhances Existing Patterns:**

**1. Component Token Architecture**
- Slots work with existing `ob.c.tag.container.spacing.gap` tokens
- Maintain semantic token relationships
- Support responsive behavior patterns

**2. Figma Variable Integration**
- Slots compatible with S1/S2/S3 variable architecture
- Support viewport=mobile|desktop modes
- Work with container=wide|narrow variants

---

## Best Practices

### **Design Guidelines**

**1. Slot Identification**
- Clear visual indicators for placeholder components
- Consistent naming across all slot components
- Documentation for each slot's purpose and constraints

**2. Content Constraints**
- Define acceptable content types for each slot
- Set size limits and responsive behavior
- Provide default/empty states

**3. Library Organization**
- Group slot components logically
- Create slot component documentation
- Maintain version control for slot updates

### **Developer Handoff**

**1. Slot Documentation**
- Document slot purposes and constraints
- Provide content guidelines for each slot
- Reference design token usage

**2. Implementation Notes**
- Specify responsive behavior
- Document Auto Layout expectations
- Provide HTML/CSS equivalent patterns

---

## Migration Strategy

### **From Variant-Heavy to Slot Architecture**

**Assessment Phase:**
1. Identify components with >50 variants
2. Analyze content variation patterns
3. Map potential slot opportunities

**Conversion Phase:**
1. Create placeholder components
2. Rebuild main component with slots
3. Test with common use cases
4. Update library documentation

**Rollout Phase:**
1. Publish updated components
2. Provide migration guides for designers
3. Monitor adoption and gather feedback
4. Iterate based on usage patterns

---

## Success Metrics

### **Measurable Improvements**

**1. Component Efficiency**
- **Before**: 480 button variants
- **Target**: <50 variants with slots

**2. Library Maintenance**
- **Before**: Updates require touching hundreds of variants
- **Target**: Single component updates

**3. Designer Experience**
- **Before**: Detaching required for custom content
- **Target**: Zero detaching with slot flexibility

**4. Performance**
- **Before**: Large variant sets cause Figma performance issues
- **Target**: Improved Figma performance with fewer variants

---

## Related Documentation

- [Component Decomposition Strategy](./09-figma-component-decomposition-strategy.md) - Addresses variant explosion problem
- [Container Component Concept](../../03-design-tokens/container-component-concept.md) - Flexible container architecture
- [Button Component Behavior](../../04-components/02-button.md) - Current slot-like implementations
- [Component Token Architecture](../../03-design-tokens/component-tokens.md) - Token integration patterns

---

**Document Maintainers:** Design System Team  
**Review Schedule:** Quarterly  
**Next Review:** December 2025  
**Related Tickets:** OUI-3966 (Component Migration), OUI-4019 (Token Architecture)

---

*This slot component architecture provides a scalable foundation for flexible component design while maintaining the integrity and consistency of the Oblique Design System.*
