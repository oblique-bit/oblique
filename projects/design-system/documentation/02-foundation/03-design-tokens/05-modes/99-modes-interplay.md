# Modes Interplay

**Cross-mode component behavior and interaction patterns**

---

## **Overview**

This document covers how different token modes interact with each other and how components respond to multiple mode switches. Understanding mode interplay is essential for designing consistent experiences across different contexts.

## **Mode Independence**

Token modes are designed to be **deliberately independent** - product designers need to understand and control multiple modes together for complete layout control, while maintaining the flexibility to use any combination (e.g., compact density + large components).

### **Mode Responsibility Patterns**

Different modes control different aspects of component behavior:

**Component-Size Mode** controls individual component dimensions:
- **Scope**: Primarily affects **Molecules** (following Atomic Design principles)
- **Components**: Button, Pills, Tags, Inputs - individual component sizing (sm/md/lg)
- **Control**: System consumer can override default component size based on contextual importance

**Density Mode** controls spacing and layout density:
- **Scope**: Primarily affects **Data components and Organisms**
- **Components**: Tables, Lists, Forms - container spacing and layout density
- **Purpose**: Information efficiency and screen real estate optimization

**Typography-Context Mode** controls text rendering:
- **Scope**: Text-heavy components and content areas
- **Components**: All text elements - optimized for interface vs prose contexts
- **Purpose**: Optimal text presentation for different content types

---

## **Component Reactivity to Mode Switches**

**Status**: Architectural direction - subject to refinement as components are redesigned and tested in component interplay scenarios.

| Component | Density | Component-Size | Typography-Context | Notes |
|-----------|:-------:|:--------------:|:-----------------:|-------|
| **Button** | 0 | ✅ | 0 | Individual sizing |
| **Input/TextField** | 0 | ✅ | 0 | Form hierarchy sizing |
| **Avatar** | 0 | 0 | 0 | Fixed  |
| **Tag** | 0 | ✅ | 0 | Monochromatic navigation/input |
| **Pill** | 0 | ✅ | 0 | Colored status communication |
| **Badge** | 0 | 0 | 0 | Does not react |
| **Icon** | 0 | ✅ | 0 | LOCKED - inherits from parent |
| **Text components** | 0 | 0 | ✅ | Typography context (interface/prose) |
| **Table** | ✅ | 0 | 0 | Row/cell spacing controlled by density |
| **List** | ✅ | 0 | 0 | Item spacing from density |
| **Navigation Menu** | 0 | 0 | 0 | Fixed |
| **Form Container** | ✅ | 0 | 0 | Spacing between fields from density |
| **Button Container** | ✅ | 0 | 0 | Button group spacing from density |
| **Card** | ✅ | 0 | 0 | Container with density-controlled spacing |
| **Modal** | ✅ | 0 | ✅ | Density spacing + text context |
| **Tabs** | ✅ | 0 | 0 | Tab spacing from density |
| **Expansion Panel** | ✅ | 0 | 0 | Panel spacing from density |
| **Infobox** | 0 | 0 | 0 | Fixed |
| **Notification** | 0 | ✅ | 0 | Component-size affects notification dimensions |
| **Tooltip** | 0 | 0 | 0 | Fixed |
| **Spinner** | 0 | 0 | 0 | Fixed |
| **Slide Toggle** | 0 | 0 | 0 | Fixed |
| **Pagination** | 0 | 0 | 0 | Fixed  |

### **Legend**
- **✅** = Component reacts to mode switch
- **0** = Component does not react to mode switch
- **Density** = `compact/standard/spacious` affects spacing and layout
- **Component-Size** = `sm/md/lg` affects individual component dimensions
- **Typography-Context** = `interface/prose` affects text rendering and spacing

### **Key Patterns**
1. **Molecules** (Button, Input, Tag, Pill) → Component-Size mode only  
2. **Organisms** (Table, List, Form Container) → Density mode only
3. **Text Components** → Typography-Context mode only
4. **Complex Components** (Modal) → Multiple modes (Density + Typography-Context)
5. **Fixed Components** (Avatar, Badge, Tooltip) → No mode reactivity

---

## **Recommended Mode Combinations**

### **Context-Based Combinations**

#### **Compact density + small size**
- **Use case**: Frequently used apps for power user personas
- **User type**: Power users prioritizing information density
- **Context**: Data-heavy interfaces, administrative tools
- **Typography**: Interface context for UI efficiency

#### **Medium density + medium size (default)**
- **Use case**: Standard applications  
- **User type**: Standard users requiring balanced approach
- **Context**: General purpose applications, dashboards
- **Typography**: Mixed - interface for UI, prose for content areas

#### **Generous density + large size**
- **Use case**: Simple flows, onboarding, simple dashboards, marketing websites
- **User type**: Users prioritizing clarity and ease of use
- **Context**: Marketing sites, onboarding flows, accessibility-focused interfaces
- **Typography**: Prose context for reading-heavy content

---

## **Cross-Mode Constraints**

### **Device-Responsive Mode Selection**

Different screen sizes impose constraints on mode combinations:

**📱 Mobile (≤768px)**:
- **Density**: Compact recommended (space limitations)
- **Component-Size**: Small to medium (touch targets vs space)
- **Typography**: Interface context (scanning efficiency)

**📟 Tablet (769px-1024px)**:
- **Density**: Compact + comfortable available
- **Component-Size**: Medium preferred (hybrid interaction)
- **Typography**: Context-dependent (interface for apps, prose for content)

**🖥️ Desktop (≥1025px)**:
- **Density**: All densities available
- **Component-Size**: All sizes available
- **Typography**: Full context flexibility

### **Accessibility Considerations**

**Touch Target Requirements**:
- Mobile needs 44-48px touch targets regardless of density mode
- May override density constraints for interactive elements
- Creates potential inconsistency in row heights when mixing interactive/non-interactive content

**Visual Accessibility**:
- Large component sizes improve accessibility
- Generous density provides better visual separation
- Typography-context prose mode enhances readability

---

## **Mode Conflicts & Resolution**

### **Known Conflicts**

**Mobile Touch Targets vs Compact Density**:
- **Conflict**: Compact density may conflict with minimum touch target requirements
- **Resolution**: Touch target minimums override density constraints
- **Impact**: May create inconsistent row heights in mixed layouts

**Information Density vs Readability**:
- **Conflict**: Maximum information density (compact + small + interface) may impact readability
- **Resolution**: Test with users and apply accessibility minimums
- **Guidance**: Consider user task complexity when choosing extreme combinations

### **Design Guidelines for Conflicts**

1. **Accessibility First**: Accessibility requirements override mode preferences
2. **User Testing**: Validate extreme combinations with actual users
3. **Context Appropriate**: Match mode intensity to user task complexity
4. **Progressive Enhancement**: Start with moderate combinations, adjust based on feedback

---

## **Implementation Notes**

### **Technical Considerations**

- **Mode Independence**: Each mode is implemented independently in the token system
- **Component Logic**: Components must handle multiple mode inputs gracefully
- **Fallback Behavior**: Components should degrade gracefully when modes conflict
- **Performance**: Multiple mode switches should not impact runtime performance

### **Design System Governance**

- **Mode Matrix**: This matrix may be refined as components are redesigned
- **Core Principles**: Molecule → component-size, Organism → density patterns remain stable
- **Documentation**: Keep mode interplay documentation updated as system evolves

---

*This document serves as the central reference for understanding how different token modes interact and influence component behavior across the design system.*