# Figma Component Decomposition Strategy: Breaking Down Large Components

## Overview

Strategic approach to decomposing complex, variant-heavy components into smaller, focused components to improve Figma performance, reduce maintenance overhead, and prevent invalid component states.

---

## The Problem: Variant Explosion and Invalid States

### Performance Impact of Large Components

Complex components with hundreds of variants create substantial performance issues:

- **Memory Overhead**: Figma loads all variants into memory simultaneously
- **Multi-Page Impact**: Performance degradation multiplies across pages containing the component
- **File Instability**: 300+ variants can cause file crashes and lag
- **Maintenance Complexity**: Updating shared properties requires touching every variant

### Invalid Component States

Large, boolean-heavy components enable invalid user configurations:

1. **Hidden Text + Hidden Icons**: User can hide both text labels and icons, creating non-functional buttons
2. **Multiple Icon Conflicts**: Users can enable both left and right icons simultaneously on text-less buttons
3. **Accessibility Violations**: Icon-only buttons without proper labeling
4. **Design System Inconsistency**: Configurations that violate design principles

---

## Strategic Decomposition Principles

---

### 1. Single Responsibility Principle

Each component should have one clear purpose and use case:

**Bad Example: Large Button Component**

```
Button (480 variants)
├── Text + Left Icon + Right Icon variants
├── Icon-only variants  
├── Text-only variants
└── Size × State × Theme combinations
```

**Good Example: Decomposed Components**

```
Button-Text (60 variants)
├── Text + optional single icon
└── Size × State × Theme combinations

Button-Icon (24 variants)  
├── Icon-only with tooltip
└── Size × State × Theme combinations
```

### 2. Context-Driven Separation

Split components based on distinct usage contexts and requirements:

#### Button-Text Component

- **Purpose**: Primary actions with descriptive text
- **Icon Support**: Single icon (left OR right) for visual enhancement
- **Tooltip**: Not required (text provides context)
- **Use Cases**: Form submissions, navigation, primary actions

#### Button-Icon Component

- **Purpose**: Secondary actions in space-constrained areas
- **Icon Support**: Single icon only
- **Tooltip**: **Required** - only way to provide context for accessibility
- **Use Cases**: Toolbars, compact interfaces, repeated actions

### 3. Preventing Invalid States

#### Tooltip Requirements

- **Tooltip is only for icon-only components**
- Text buttons don't need tooltips (redundant with label)
- Icon buttons **must** have tooltips for accessibility compliance
- Tooltip content should match the action description

#### Boolean Limitations and Edge Cases

Boolean properties offer flexibility but create invalid edge cases:

**Invalid Boolean Scenarios:**

```
// User hides text label AND icons are already hidden
hasText: false
hasIconLeft: false  
hasIconRight: false
Result: Non-functional, invisible button
```

**Conflicting Icon States:**

```
// User enables multiple icons without text
hasText: false
hasIconLeft: true
hasIconRight: true  
Result: Confusing dual-icon button with no context
```

**Accessibility Violations:**

```
// Icon-only button without tooltip
hasText: false
hasIcon: true
hasTooltip: false
Result: Screen reader cannot understand button purpose
```

---

## Recommended Component Architecture

### Primary Button Family

#### 1. Button-Primary-Text

**Variants**: Size (4) × State (4) × Icon Position (3: none, left, right) = **48 variants**

```
Properties:
- Size: sm | md | lg | xl
- State: default | hover | pressed | disabled  
- Icon: none | left | right
- Text: Always visible (prevents invalid states)
```

#### 2. Button-Primary-Icon

**Variants**: Size (4) × State (4) × Icon (1) = **16 variants**

```
Properties:
- Size: sm | md | lg | xl
- State: default | hover | pressed | disabled
- Icon: Single icon slot
- Tooltip: Always present (accessibility requirement)
- Text: Never visible (clear purpose)
```

### Secondary Button Family

#### 3. Button-Secondary-Text

**Variants**: Size (4) × State (4) × Icon Position (3) = **48 variants**

#### 4. Button-Secondary-Icon

**Variants**: Size (4) × State (4) = **16 variants**

**Total**: 128 variants across 4 focused components vs. 480 variants in single component

---

## Implementation Benefits

---

### 1. Performance Improvements

- **73% variant reduction** (480 → 128 total variants)
- **Smaller memory footprint** per component
- **Faster file loading** and interaction
- **Enhanced multi-page performance**

### 2. Design System Integrity

- **Prevents invalid configurations** at the component level
- **Enforces accessibility requirements** (tooltips for icon-only)
- **Clear usage guidelines** through component separation
- **Consistent visual hierarchy**

### 3. Developer Experience

- **Clear component mapping** to code implementation
- **Reduced complexity** in handoff documentation
- **Type-safe props** (no boolean conflicts)
- **Streamlined testing** of distinct component behaviors

### 4. Maintenance Efficiency

- **Focused updates** affect only relevant components
- **Parallel development** possible on different button types
- **Clear ownership** and governance
- **Simplified QA process**

---

## Migration Strategy

---

### Phase 1: Audit Current Usage

1. **Analyze existing button instances** across all files
2. **Categorize usage patterns** (text vs. icon-only)
3. **Identify invalid states** currently in use
4. **Document cleanup requirements**

### Phase 2: Create Focused Components

1. **Build Button-Text components** with size and state variants only
2. **Build Button-Icon components** with mandatory tooltips
3. **Establish clear naming conventions**
4. **Create usage documentation**

### Phase 3: Migration and Cleanup

1. **Replace large component instances** with appropriate focused components
2. **Fix invalid state instances** (hidden text + hidden icons)
3. **Add tooltips** to icon-only button instances
4. **Validate accessibility compliance**

### Phase 4: Governance and Guidelines

1. **Update design system documentation**
2. **Create component selection guidelines**
3. **Establish review processes** for new button usage
4. **Train team on new component architecture**

---

## Validation Criteria

---

### Component Health Metrics

- **Variant count per component**: Target < 50 variants
- **Invalid state prevention**: Zero impossible configurations
- **Accessibility compliance**: 100% tooltip coverage for icon-only
- **Performance benchmarks**: < 2s load time for pages with 20+ instances

### Design System Quality

- **Usage consistency**: Clear patterns across products
- **Maintenance velocity**: Faster updates and changes
- **Developer satisfaction**: Easier implementation and fewer bugs
- **Accessibility score**: WCAG 2.1 AA compliance

---

## Related Documentation
- [Variables vs Variants Strategic Analysis](./07-figma-variables-vs-variants-strategic-analysis.md)
- [Variable-Based Sizing System](./08-variable-based-sizing-system.md)
- [Component Performance Guidelines](./component-performance-guidelines.md)
- [Accessibility Requirements](../../06-guidelines/accessibility.md)

---

## Key Takeaways

1. **Large components with 300+ variants reduce performance** and should be decomposed
2. **Context-driven separation** creates clearer, more maintainable components  
3. **Boolean properties can create invalid states** that violate design system principles
4. **Tooltip requirements differ by component type** - mandatory for icon-only, unnecessary for text buttons
5. **Focused components prevent user error** while enhancing performance and maintainability

*Component decomposition is not just about performance - it's about creating a design system that guides users toward correct, accessible, and consistent implementations.*

---

*Last updated: September 5, 2025*
*Next review: Quarterly review cycle*
