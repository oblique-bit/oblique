# Button Component Behavior

**Version:** 1.0  
**Date:** September 5, 2025  
**Status:** Draft  
**Purpose:** Button component responsive ### Technical Implementation

### Figma Implementation Strategy

**Hybrid Approach: Viewport Modes + Container Variants**

**Page-Level Variable Modes:**
- `viewport=mobile|desktop` - Global responsive context (existing system)
- Controls: Touch targets, global spacing, typography scaling
- Applied: Entire page/frame for consistent responsive behavior

**Component-Level Variants:**
- `container=wide|narrow` - Local container constraints  
- Controls: Button layout, stacking behavior, primary button order
- Applied: Per component instance based on actual container context

**Usage Example:**
```
1. Designer sets page: viewport=mobile
2. Designer chooses component: container=narrow
3. Result: Mobile touch targets + narrow container stacking behavior
```

**Benefits:**
- **Separation of concerns**: Global vs local responsive behavior
- **CSS mimicking**: Variable modes = media queries, variants = container queries
- **Designer control**: Contextual container choice independent of viewport

### Figma CSS Simulation Strategy

**Container Query Simulation**: We implement container query behavior in Figma through component variants, while maintaining media query simulation through variable modes. This hybrid approach gives designers control over both global responsive context (viewport) and local container constraints, closely mimicking modern CSS capabilities that Figma can't provide natively.

```
┌─ FIGMA RESPONSIVE ARCHITECTURE ──────────────────────────────────┐
│                                                                  │
│  PAGE LEVEL: Variable Modes (Media Query Simulation)            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  viewport=mobile │ viewport=desktop                      │   │
│  │  • Touch targets │ • Standard sizing                     │   │
│  │  • Global spacing│ • Desktop spacing                     │   │
│  │  • Typography   │ • Typography scale                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                             │                                    │
│                             ▼                                    │
│  COMPONENT LEVEL: Variants (Container Query Simulation)         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  container=wide          │ container=narrow               │   │
│  │  ┌─────────────────┐     │ ┌─────────────────┐           │   │
│  │  │ [btn] [btn]     │     │ │ [button_____]   │           │   │
│  │  │ horizontal      │     │ │ [button_____]   │           │   │
│  │  │ primary-last    │     │ │ vertical        │           │   │
│  │  └─────────────────┘     │ │ primary-first   │           │   │
│  │                          │ └─────────────────┘           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  CSS Equivalent:                                                 │
│  • Variable Modes = @media (max-width: 768px)                   │
│  • Component Variants = @container (max-width: 480px)           │
└──────────────────────────────────────────────────────────────────┘
```

- **Media Queries → Variable Modes**: Global viewport-based responsive behavior
- **Container Queries → Component Variants**: Local container-based layout behaviorand container layout patterns

---

## Direction vs Viewport vs Container

Buttons adapt their layout based on **container constraints** and **semantic direction**, not just viewport size. This solves mobile landscape UX challenges where traditional responsive design assumptions fail.

### Key Principles

**Direction ≠ Viewport Size ≠ Container Width**

- **Direction**: Semantic intent for content layout (`data-direction`)
- **Viewport**: Triggers global responsive scaling 
- **Container**: Local space constraints that can force layout changes

### Container-Responsive Behavior

When a container becomes too narrow (regardless of viewport size), buttons automatically switch to vertical stacking for optimal UX. This means:

- **Wide container** + horizontal direction = side-by-side buttons
- **Narrow container** + horizontal direction = auto-stack vertically  
- **Any container** + vertical direction = always stacked

---

## Container Behavior Patterns

### Horizontal Layout (data-direction="horizontal")
- **Use cases**: Desktop, mobile landscape (844x390), wide content areas
- **Container-aware**: Auto-stacks when container width insufficient
- **Button arrangement**: Side-by-side with horizontal gaps (when space allows)
- **Spacing**: `ob.s.spacing.xl` (20px) between buttons
- **Alignment**: `align-items: center`

```css
.direction-container[data-direction="horizontal"] {
  flex-direction: row;
  align-items: center;
  gap: var(--ob-spacing-xl);
  flex-wrap: wrap; /* Enables container-responsive behavior */
}
```

### Vertical Layout (data-direction="vertical")  
- **Use cases**: Mobile portrait (390x844), narrow content areas, forms
- **Container-independent**: Always stacks regardless of container width
- **Button arrangement**: Stacked vertically with full-width
- **Spacing**: `ob.s.spacing.lg` (16px) between buttons
- **Alignment**: `align-items: stretch` for full-width buttons

```css
.direction-container[data-direction="vertical"] {
  flex-direction: column;
  align-items: stretch;
  gap: var(--ob-spacing-lg);
}
```

### Container-Responsive Stacking
When horizontal direction buttons don't fit in available container width:
- **Automatic wrapping**: Buttons wrap to new line or stack
- **Graceful degradation**: Maintains usability in constrained spaces
- **Touch-friendly**: Ensures adequate button sizes for interaction

### Container Width Thresholds
- **Narrow containers**: ≤ 480px width → Auto-stack vertically (narrow behavior)
- **Wide containers**: > 480px width → Allow horizontal layout (wide behavior)
- **Rationale**: Based on mobile landscape (844px) vs portrait (390px) UX patterns

---

## Responsive Viewport Behavior

### Mobile Portrait (390x844)
- **Auto-stacking**: Buttons automatically stack vertically (narrow container behavior)
- **Full-width**: Buttons expand to `width: 100%` for better touch targets
- **Center alignment**: Button content centered with `justify-content: center`

```css
.viewport-mobile-portrait .ob-cluster {
  flex-direction: column;
  align-items: stretch;
}

.viewport-mobile-portrait .ob-button {
  width: 100%;
  justify-content: center;
}
```

### Mobile Landscape (844x390)
- **Horizontal layout**: Uses horizontal direction with wide container behavior
- **Rationale**: 844px width provides ample horizontal space
- **Challenge solved**: Traditional responsive design incorrectly assumes vertical layout

### Desktop & Tablet
- **Horizontal layout**: Default wide container behavior with proper spacing
- **Button order**: Primary button positioned last (right-aligned) for intuitive navigation

---

## Button Order Patterns

### Wide Containers
- **Primary last**: `buttons-order=primary-last`
- **Rationale**: Right-aligned primary button facilitates intuitive decision-making flow

### Narrow Containers  
- **Primary first**: `buttons-order=primary-first`  
- **Rationale**: Thumb-friendly positioning and stacked layout optimization

---

## Implementation Tokens

### Spacing Tokens
- **Horizontal gap**: `ob.h.button.container.spacing.gap.md` → `{ob.s.spacing.3xl}`
- **Vertical gap**: `ob.s.spacing.lg` for stacked layouts
- **Padding**: Responsive button padding via `ob.h.button.spacing.with_text.padding.*`

### Container Classes
- **Direction control**: `data-direction="horizontal|vertical"`
- **Container simulation**: `.container-wide`, `.container-narrow`
- **Layout utilities**: `.ob-cluster`, `.ob-stack`

---

## UX Benefits

1. **Touch accessibility**: Full-width buttons in narrow containers improve tap targets
2. **Container optimization**: Layout adapts to available space efficiently  
3. **Container adaptivity**: Buttons respond to local space constraints, not just global viewport
4. **Semantic clarity**: Direction attributes separate layout intent from responsive behavior
5. **Consistent spacing**: Token-based gaps ensure visual rhythm across container sizes
6. **Graceful degradation**: Automatic stacking prevents cramped button layouts

---

## Technical Implementation

### Figma Variants
The button container component includes these viewport-specific variants:
- `viewport=desktop, buttons-order=primary-last`
- `viewport=mobile, buttons-order=primary-first`  
- Size variations: `size=md|sm`
- Button count: `buttons=2|3`
- Primary presence: `has-primary=true|false`

### CSS Logical Properties
Uses modern CSS logical properties for international layouts and future-proof direction handling.

---

**Document Maintainers:** Design System Team  
**Review Schedule:** Quarterly  
**Next Review:** December 2025  
**Related Documentation:** Container Component Concept, Responsive Tokens
