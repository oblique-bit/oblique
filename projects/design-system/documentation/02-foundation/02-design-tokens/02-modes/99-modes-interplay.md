# Modes Interplay

**Cross-mode component behavior and interaction patterns**

---

## **Overview**

This document covers how different token modes interact with each other and how components respond to multiple mode switches. Understanding mode interplay is essential for designing consistent experiences across different contexts.

## **Mode Independence**

Token modes are designed to be **deliberately independent** - product designers need to understand and control multiple modes together for complete layout control, while maintaining the flexibility to use any combination (e.g., compact density + large components).

### **Mode Responsibility Patterns**

Different modes control different aspects of component behavior:

**UI Scale Mode** controls individual component dimensions:
- **Scope**: Primarily affects individual interactive controls - small, self-contained elements such as buttons, inputs, tags, or pills
- **Control**: System consumer can override default component size based on contextual importance (sm/md/lg)

**Density Mode** controls spacing and layout density:
- **Scope**: Primarily affects layout containers and data-dense structures - elements that arrange multiple children, such as tables, lists, or forms
- **Purpose**: Information efficiency and screen real estate optimization

**Typography-Context Mode** controls text rendering:
- **Scope**: Text-heavy content areas
- **Purpose**: Optimal text presentation for different content types (interface vs prose)

**Motion Mode** controls animation preference:
- **Scope**: Every animated or transitioning element uniformly — no component-type scoping, unlike UI Scale or Density
- **Behavior**: Fully orthogonal; combines with any state of every other mode (Lightness, Emphasis, UI Scale, Density, Typography-Context, Viewport) with no conflicts. Disabling it shortens transitions to zero rather than removing them, so it never changes which mode a component reacts to elsewhere — see [07-motion.md](./07-motion.md).

### **Key Patterns**
1. **Individual interactive controls** → UI Scale mode only
2. **Layout containers** (elements arranging multiple children, e.g. tabular or list structures) → Density mode only
3. **Text-heavy content** → Typography-Context mode only
4. **Elements that combine structure and substantial text content** → Multiple modes (Density + Typography-Context)
5. **Fixed-size elements** (no size or spacing variation) → No mode reactivity
6. **Any element with a transition** → Motion mode, independent of and combinable with every pattern above

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

**Mobile (≤768px)**:
- **Density**: Compact recommended (space limitations)
- **UI Scale**: Small to medium (touch targets vs space)
- **Typography**: Interface context (scanning efficiency)

**Tablet (769px-1024px)**:
- **Density**: Compact + standard available
- **UI Scale**: Medium preferred (hybrid interaction)
- **Typography**: Context-dependent (interface for apps, prose for content)

**Desktop (≥1025px)**:
- **Density**: All densities available
- **UI Scale**: All sizes available
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

- **Mode Responsibility Patterns**: These patterns may be refined as components are designed and tested in mode interplay scenarios
- **Core Principles**: Individual interactive controls → ui_scale, layout containers → density remain the stable core patterns
- **Documentation**: Keep mode interplay documentation updated as system evolves

---

*This document serves as the central reference for understanding how different token modes interact and influence component behavior across the design system.*
