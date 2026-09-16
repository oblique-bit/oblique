# Oblique Design System Principles
Principles governing the relationship between the Oblique Design System's code and Figma design assets.

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

### **Seamless Token Consistency**
**Design Tokens (Variables in Figma):** We maintain **seamless consistency** between code and design environments.

**Implementation:**
- **Same Token Names:** `ob.p.color.steelblue.600` exists identically in both code and Figma
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

### **Exceptions**
Besides consistency, each environment and target audience has its own needs. We allow minimal deviations: in exceptional cases, for a specific environment (CSS or Figma), the context of use (compatibility, user expectations) takes a slight priority over consistency.

- **Compiled Color Variables (Figma):** `ob.s.*` variable names trim the `ob/s/` prefix (e.g. `color/neutral/fg/contrast_medium/inversity_normal`) for usability in the Figma variables panel. Figma only — the JSON token keeps the full `ob.s.color` path.
- **Code Transforms:** Developers retain the right to adapt token values to code's needs through the Style Dictionary build, transforming what is defined in the JSON for the final CSS output.

---

## **Core Philosophy**

The Oblique Design System is built on the principle of **Code-Figma Alignment** with **Code Priority** for implementation accuracy and user experience fidelity.

---

## **Design System Principles**

### **Principle 1: Code-Figma Convergence**
**"Design and code should be as close as possible to each other"**

**Implementation:**
- Design tokens shared between Figma and code
- Visual consistency maintained through synchronized updates
- Single source of truth for design decisions

**Goal:** Eliminate the traditional design-to-development handoff friction through shared design tokens.

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

## **Implementation Guidelines**

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

**Weekly:**
- Gap identification and bridging strategy updates

**Monthly:**
- Complete design-code audit
- Platform capability assessment and roadmap updates

---

## **Quality Metrics**

### **Code-Figma Alignment Intent:**
- Static-state visuals should match pixel-for-pixel between code and Figma
- All shared values should route through the same design tokens
- Any gap between platforms should be documented rather than left implicit

### **Success Indicators:**
- Reduced design-development iteration cycles
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

## **Key Takeaways**

- **Code Priority:** Code implementation takes precedence for user-facing behavior  
- **Design Alignment:** Figma and code stay visually aligned through shared design tokens  
- **Gap Bridging:** Documentation explains areas where platforms diverge  
- **Continuous Sync:** Regular alignment validation and improvement processes  
- **Team Collaboration:** Clear roles and responsibilities for each platform  

This principle framework ensures that our design system serves both designers and developers effectively while maintaining the highest fidelity to actual user experience.
