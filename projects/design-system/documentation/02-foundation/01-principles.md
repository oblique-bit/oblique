# Oblique Design System Principles
**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Approved by Product Owner

---

##  **Introduction**

The Oblique Design System provides two primary deliverables for federal application development:

### **Code Assets (Implementation)**
**Purpose:** To be implemented in federal applications  
**Contains:** Production-ready components, utilities, and design tokens  
**Target Users:** Frontend developers, full-stack developers, technical teams  
**Output:** Functional user interfaces that citizens interact with  

### **Design Files (Figma - Design Process)**
**Purpose:** To be used for designing federal applications  
**Contains:** Component libraries, design tokens (variables), templates, and guidelines  
**Target Users:** UX/UI designers, product designers, design teams  
**Output:** Design specifications and prototypes for development implementation  

### **100% Token Consistency Commitment**
**Design Tokens (Variables in Figma):** We maintain **100% consistency** between code and design environments.

**Implementation:**
- **Same Token Names:** `ob.p.color.red.50` exists identically in both code and Figma
- **Same Token Values:** `#2379A4` appears exactly the same in both environments  
- **Same Token Structure:** Hierarchical organization (`primitive → semantic → component`) mirrors across platforms
- **Synchronized Updates:** Token changes propagate simultaneously to both code and Figma

**Benefits:**
- **Workflow Efficiency:** Designers and developers use identical references  
- **Visual Consistency:** No discrepancy between design intent and implementation  
- **Interaction Consistency:** Behavioral tokens ensure identical user experience  
- **Maintenance Simplicity:** Single token change updates both environments  
- **Team Communication:** Shared vocabulary eliminates translation errors  

This token consistency ensures that what end users experience matches exactly what designers intended, creating consistent federal application experiences.

---

## **Core Philosophy**

The Oblique Design System is built on the principle of **Code-Figma Alignment** with **Code Priority** for implementation accuracy and user experience fidelity.

---

## **Design System Principles**

### **Principle 1: Code-Figma Convergence**
**"Design and code should be as close as possible to each other"**

**Implementation:**
- Design tokens shared between Figma and code
- Component behavior mirrored across platforms
- Visual consistency maintained through synchronized updates
- Single source of truth for design decisions

**Goal:** Eliminate the traditional design-to-development handoff friction by maintaining parallel component systems.

---

### **Principle 2: Code-First Implementation Priority**
**"Code has slightly higher priority as the primary reference for user-facing behavior"**

**Rationale:**
- **User Reality:** Code generates the actual appearance and behavior that users see and interact with
- **Technical Completeness:** Code represents the full spectrum of possible user interactions
- **Performance Impact:** Code implementation directly affects user experience performance
- **Accessibility Implementation:** Code handles actual screen reader support, keyboard navigation, and ARIA attributes

**Implementation Hierarchy:**
```
1. User Experience (Code-generated)
2. Design Intent (Figma representation)  
3. Documentation (Supporting context)
```

**Exceptions to Code-First Priority:**

**Bug Fix Scenarios:**
- When an existing bug ticket has a corresponding Figma proposal for the fix, **Figma takes priority**
- Figma solution provides the corrective design intent that code should implement
- Bug tickets with design solutions follow design-to-code implementation flow

**Inconsistency Resolution:**
- All cases of design-code inconsistency require **Product Owner alignment** before resolution
- Product Owner determines whether design (Figma) or code should take priority based on:
  - User impact assessment
  - Business requirements alignment
  - Technical feasibility constraints
  - Timeline and resource considerations

---

### **Principle 3: Figma Limitation Acknowledgment**
**"Figma does not provide all HTML and CSS properties and options"**

**Current Figma Limitations:**
- **Missing CSS Properties:** `container-queries`, advanced `grid` behaviors, `scroll-snap`
- **Interaction Constraints:** Limited state management, no complex animations
- **Responsive Limitations:** Basic viewport simulation vs. real responsive behavior
- **Accessibility Gaps:** No screen reader simulation, limited keyboard navigation
- **Performance Aspects:** No loading states, no actual performance metrics

**Our Response:** We mimic code logic in Figma where possible to enable similar behavior and appearance for design system consumers.

---

### **Principle 4: Figma Code-Mimicking Strategy**
**"We mimic certain logic from code in Figma to enable similar behavior for designers"**

#### **Mimicking Strategies:**

**Responsive Behavior:**
```
Code: Container queries + CSS Grid
Figma: Component variants with viewport properties
```

**Component States:**
```
Code: CSS pseudo-classes + JavaScript states
Figma: Component variants with state properties
```

**Typography Scale:**
```
Code: CSS custom properties with responsive values
Figma: Text styles with viewport-specific variants
```

**Color Systems:**
```
Code: CSS custom properties with theme modes
Figma: Color variables with mode switching
```

**Spacing System:**
```
Code: CSS logical properties and container-relative units
Figma: Auto-layout with spacing tokens
```

---

### **Principle 5: Designer-Developer Collaboration**
**"Enable UX/UI/Product designers to work effectively within system constraints"**

**For Designers:**
- Figma components mirror code behavior as closely as possible
- Component variants represent actual implementation states
- Design tokens provide consistent values across platforms
- Documentation bridges gaps where Figma cannot fully represent code behavior

**For Developers:**
- Code implementation guides Figma component creation
- Token architecture supports both platforms equally
- Component API design considers both design and development workflows
- Performance and accessibility requirements inform design constraints

---

## **Implementation Guidelines**

### **When Code Leads Design:**

**Component Behavior:**
- Complex interactions (hover, focus, active states)
- Responsive layout algorithms (container queries, grid behaviors)
- Accessibility implementations (ARIA attributes, keyboard navigation)
- Performance optimizations (lazy loading, animation performance)

**Process:**
1. Implement component behavior in code
2. Document technical capabilities and constraints  
3. Create Figma variant system that represents available states
4. Bridge gaps with documentation and design guidelines

### **When Design Informs Code:**

**Visual Design:**
- Color palettes and brand expression
- Typography hierarchy and visual rhythm
- Iconography and illustration style
- Layout composition and visual balance

**Process:**
1. Establish design intent in Figma
2. Create design tokens that bridge design and code
3. Implement code with design fidelity as primary goal
4. Validate implementation against design intent

### **Synchronization Points:**

**Daily:**
- Token value updates propagated to both platforms
- Component state alignment validation

**Weekly:**
- Design-code component behavior review
- Gap identification and bridging strategy updates

**Monthly:**
- Complete design-code audit
- Platform capability assessment and roadmap updates

---

## **Quality Metrics**

### **Code-Figma Alignment Score:**
- **Visual Consistency:** 95% pixel-perfect match in static states
- **Behavioral Similarity:** 85% interaction pattern match
- **Token Usage:** 100% shared token utilization
- **Documentation Coverage:** 90% gap explanation coverage

### **Success Indicators:**
- Reduced design-development iteration cycles
- Faster component implementation from design
- Improved user experience consistency across products
- Higher designer confidence in implementation fidelity

---

## **Platform-Specific Roles**

### **Code Platform (Primary Reference):**
- **Owns:** User experience behavior, accessibility implementation, performance improvement
- **Provides:** Technical constraints, interaction capabilities, responsive behavior patterns
- **Validates:** User interaction flows, cross-browser compatibility, performance metrics

### **Figma Platform (Design Reference):**
- **Owns:** Visual design intent, brand expression, design system documentation
- **Provides:** Design specifications, visual consistency guidelines, user interface patterns
- **Validates:** Design coherence, brand alignment, visual accessibility

---

## **Evolution Strategy**

### **Short-term (3-6 months):**
- Establish token synchronization workflows
- Create component behavior documentation standards
- Implement design-code review processes

### **Medium-term (6-12 months):**
- Develop automated design-code consistency checking
- Expand Figma component variant coverage
- Create performance-design integration workflows

### **Long-term (12+ months):**
- Investigate design-to-code generation possibilities
- Explore emerging design tool capabilities
- Establish design system maturity measurement framework

---

## **Key Takeaways**

- **Code Priority:** Code implementation takes precedence for user-facing behavior  
- **Design Alignment:** Figma components mirror code behavior as closely as possible  
- **Gap Bridging:** Documentation explains areas where platforms diverge  
- **Continuous Sync:** Regular alignment validation and improvement processes  
- **Team Collaboration:** Clear roles and responsibilities for each platform  

This principle framework ensures that our design system serves both designers and developers effectively while maintaining the highest fidelity to actual user experience.

---

**Document Maintainers:** Design System Team  
**Review Schedule:** Quarterly  
**Next Review:** December 2025
