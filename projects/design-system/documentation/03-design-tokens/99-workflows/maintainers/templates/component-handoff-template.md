# Component Handoff Specification

**Component:** [COMPONENT NAME]  
**Date:*### 3. Component Architecture & Constraints

#### Component System Overview
```
Document component's structural organization:
Example - Button Component System:
├── button.label_icon → Standard button (text + optional icons)
├── button.icon_only → Square constraint (width = height)  
└── button.remove → Always embedded, never standalone
```

#### Sizing Philosophy & Implementation Constraints
- **Content-driven sizing**: [ Describe how component adapts to content ]
- **Proportional constraints**: [ Document fixed ratios, e.g., width = height ]
- **Touch target requirements**: [ Minimum interactive areas ]
- **Parent integration rules**: [ Sizing within parent components ]

#### Component Variant Schema Pattern
```
Document exact structural template:
Each [component_name] variant contains:
├── [ Layer 1 description ]
├── [ Layer 2 description ]
├── [ Layer 3 description ]
└── [ Layer 4 description ]
```

#### Usage Context & Integration Guidelines
- **Primary Use Cases**: [ Main scenarios for component usage ]
- **Context Restrictions**: [ Where component should NOT be used ]
- **Standalone vs. Embedded**: [ Independent use or parent integration ]
- **Parent Component Integration**: [ How component nests within others ]

### 4. Complete Token Reference

#### Typography & Content Tokens
```
- [token.path.font_family] - [Description] ([Value])
- [token.path.font_size] - [Description] ([Value])  
- [token.path.font_weight] - [Description] ([Value])
- [token.path.line_height] - [Description] ([Value])
- [token.path.letter_spacing] - [Description] ([Value])
```

#### Layout & Spacing Tokens  
```
- [token.path.padding.horizontal] - [Description] ([Value])
- [token.path.padding.vertical] - [Description] ([Value])
- [token.path.gap] - [Description] ([Value])
- [token.path.min_height] - [Description] ([Value])
- [token.path.icon_size] - [Description] ([Value])
```

#### Visual Property Tokens
```
- [token.path.border_radius] - [Description] ([Value])
- [token.path.border_width] - [Description] ([Value])
- [token.path.shadow.first] - [Description] ([Value])
- [token.path.focus_ring] - [Description] ([Value])
```

#### Color System Hierarchy
```
Primary Colors:
- [token.path.color.fg.primary.normal.enabled] - [Description] ([Value])
- [token.path.color.bg.primary.normal.enabled] - [Description] ([Value])

Secondary Colors:  
- [token.path.color.fg.secondary.normal.enabled] - [Description] ([Value])
- [token.path.color.bg.secondary.normal.enabled] - [Description] ([Value])

Tertiary Colors:
- [token.path.color.fg.tertiary.normal.enabled] - [Description] ([Value])
- [token.path.color.bg.tertiary.normal.enabled] - [Description] ([Value])

Interactive States:
- *.hover - [Hover state colors]
- *.pressed - [Pressed state colors]
- *.disabled - [Disabled state colors]

Inversity Modes:
- *.inversity_normal - [Normal theme colors]
- *.inversity_flipped - [Flipped theme colors]
```

### 5. Hardcoded Properties [YYYY-MM-DD]  
**Designer:** [DESIGNER NAME]  
**Status:** [Ready for Development | In Review | Approved]  
**Figma File:** [FILE NAME]

---

## 1. 🔗 Deep URL to Component

### Primary Component Location
```
Figma URL: https://figma.com/design/[fileKey]/[fileName]?node-id=[nodeId]
Node ID: [nodeId]
Page: [Page Name]
Section: [Section/Frame Name]
```

### Component Details
- **Component Set:** [Component Set Name or "Standalone Component"]
- **Component Type:** [Atom | Molecule | Organism]
- **Category:** [Button | Input | Navigation | etc.]
- **Priority:** [High | Medium | Low]

---

## 2. 📊 Layer Structure & Token Mapping

### MCP Analysis Results

#### Commands Executed:
```bash
mcp_figma_dev_mod_get_metadata    # ✅ Completed [DATE]
mcp_figma_dev_mod_get_variable_defs  # ✅ Completed [DATE]  
mcp_figma_dev_mod_get_code --forceCode=true  # ✅ Completed [DATE]
```

#### Layer Hierarchy
```
[COMPONENT NAME] (Main Component)
├── Background (Rectangle)
│   ├── fill: {token.path}
│   └── border-radius: {token.path}
├── Container (Auto Layout)
│   ├── padding: {token.path}
│   └── gap: {token.path}
├── Icon (Frame)
│   ├── width: {token.path}
│   └── height: {token.path}
└── Label (Text)
    ├── fontSize: {token.path}
    ├── fontWeight: {token.path}
    └── color: {token.path}
```

#### Complete Token Mapping
| Layer Name | Layer Type | Property | Token Applied | Token Value | Notes |
|------------|------------|----------|---------------|-------------|--------|
| Background | Rectangle | fill | `ob.s3.color.neutral.bg.surface` | `#ffffff` | Primary surface |
| Background | Rectangle | border | `ob.h.button.border.width` | `1px` | Border width |
| Background | Rectangle | border-radius | `ob.h.button.border.radius` | `4px` | Corner radius |
| Container | Auto Layout | padding-left | `ob.h.button.spacing.padding.horizontal` | `16px` | Left padding |
| Container | Auto Layout | padding-right | `ob.h.button.spacing.padding.horizontal` | `16px` | Right padding |
| Container | Auto Layout | padding-top | `ob.h.button.spacing.padding.vertical` | `8px` | Top padding |
| Container | Auto Layout | padding-bottom | `ob.h.button.spacing.padding.vertical` | `8px` | Bottom padding |
| Container | Auto Layout | gap | `ob.h.button.spacing.gap` | `8px` | Icon-label gap |
| Icon | Frame | width | `ob.h.button.icon.size.md` | `20px` | Icon width |
| Icon | Frame | height | `ob.h.button.icon.size.md` | `20px` | Icon height |
| Label | Text | fontSize | `ob.s.dynamic.font_size.md` | `16px` | Text size |
| Label | Text | fontWeight | `ob.s.dynamic.fontWeight.medium` | `500` | Text weight |
| Label | Text | color | `ob.s3.color.neutral.fg.primary` | `#1a1a1a` | Text color |
| Label | Text | lineHeight | `ob.s.dynamic.lineHeight.md` | `24px` | Line height |

---

## 3. 🚫 Figma-Hardcoded Properties

### Properties That Cannot Use Variables

> **📋 Reference:** See [Figma Hardcoded Properties Reference](../figma-hardcoded-properties-reference.md) for the complete list of properties that cannot be controlled by Figma variables.

#### Identified Hardcoded Properties for This Component

| Property | Current Value | Proposed Token Path | CSS Implementation | Priority |
|----------|---------------|--------------------|--------------------|----------|
| **Auto Layout Direction** | Row | `ob.h.[component].layout.direction` | `flex-direction: row` | High |
| **Sizing Behavior** | Hug Contents | `ob.h.[component].sizing.width` | `width: fit-content` | High |
| **Text Alignment** | Center | `ob.h.[component].typography.textAlign` | `text-align: center` | Medium |
| **Vertical Alignment** | Center | `ob.h.[component].layout.alignItems` | `align-items: center` | Medium |
| **Horizontal Alignment** | Center | `ob.h.[component].layout.justifyContent` | `justify-content: center` | Medium |
| **Constraints** | Left & Right | `ob.h.[component].layout.constraints` | Responsive CSS | Low |
| **Component Resizing** | Fixed | `ob.h.[component].behavior.resize` | CSS sizing rules | Low |

*Replace [component] with actual component name (e.g., button, input, card)*

### Implementation Notes

#### Implementation Notes

> **📚 Complete Reference:** For the full list of hardcoded properties and their categories, see [Figma Hardcoded Properties Reference](../figma-hardcoded-properties-reference.md)

#### Component-Specific Implementation
```css
/* Auto Layout Direction - From Layout & Auto Layout Properties category */
.[component] {
  display: flex;
  flex-direction: var(--[component]-direction, row); /* Token: ob.h.[component].layout.direction */
}

/* Sizing Behavior - From Layout & Auto Layout Properties category */
.[component] {
  width: var(--[component]-width, fit-content); /* Token: ob.h.[component].sizing.width */
  min-width: var(--[component]-min-width, auto); /* Token: ob.h.[component].sizing.minWidth */
}

/* Text and Content Alignment - From Typography Behavior category */
.[component] {
  text-align: var(--[component]-text-align, center); /* Token: ob.h.[component].typography.textAlign */
  align-items: var(--[component]-align-items, center); /* Token: ob.h.[component].layout.alignItems */
  justify-content: var(--[component]-justify-content, center); /* Token: ob.h.[component].layout.justifyContent */
}
```

#### Categories from Reference Document
The hardcoded properties for this component fall into these categories:
- **🎯 Layout & Auto Layout Properties** - Direction, spacing, sizing behavior
- **🎨 Visual Properties (Variable Limitations)** - Typography behavior, alignment
- **⚡ Interactive & Behavioral Properties** - Component behavior, state management
- **🗂️ Organizational Properties** - Layer organization, component structure

### Reference Documentation
- See: [Figma Hardcoded Properties Reference](../figma-hardcoded-properties-reference.md)
- Related: [CSS Layout Token Implementation](../../03-design-tokens/css-layout-tokens.md)

---

## 4. 🎨 Theme/Mode Compatibility

### Supported Variable Modes

#### Light/Dark Theme Support
```
├── Light Mode (inversity_normal)
│   ├── Background: ob.s3.color.neutral.bg.surface
│   ├── Border: ob.s3.color.neutral.border.default  
│   ├── Text: ob.s3.color.neutral.fg.primary
│   └── Icon: ob.s3.color.neutral.fg.secondary
└── Dark Mode (inversity_flipped)
    ├── Background: ob.s3.color.neutral.bg.surface.inversity_flipped
    ├── Border: ob.s3.color.neutral.border.default.inversity_flipped
    ├── Text: ob.s3.color.neutral.fg.primary.inversity_flipped
    └── Icon: ob.s3.color.neutral.fg.secondary.inversity_flipped
```

#### Viewport Responsive Modes
```
├── Desktop (default)
│   ├── Base token values
│   └── Multiplier: 1.0
└── Mobile
    ├── Responsive token values  
    └── Multiplier: ob.g.multiplier.viewport.mobile
```

#### Component Size Modes
```
├── Small (sm)
│   ├── Padding: reduced by sm multiplier
│   ├── FontSize: reduced by sm multiplier
│   └── IconSize: reduced by sm multiplier
├── Medium (md) - Default
│   └── Base token values
└── Large (lg)
    ├── Padding: increased by lg multiplier
    ├── FontSize: increased by lg multiplier  
    └── IconSize: increased by lg multiplier
```

### Mode Testing Checklist
- [ ] **Light Theme**: All elements visible and properly styled
- [ ] **Dark Theme**: Colors invert appropriately, contrast maintained
- [ ] **Desktop View**: Component displays at expected size
- [ ] **Mobile View**: Component scales appropriately
- [ ] **Small Size**: Content remains readable
- [ ] **Large Size**: Proportions remain balanced
- [ ] **Interactive States**: Hover/focus/pressed work in all modes

---

## 5. 🔄 Component Variants & Purpose

### Variant Matrix

| Variant Property | Possible Values | Purpose | Usage Guidelines | Default |
|------------------|-----------------|---------|------------------|---------|
| **Type** | Primary, Secondary, Tertiary | Visual hierarchy | Primary: main actions, Secondary: supporting actions, Tertiary: subtle actions | Primary |
| **State** | Regular, Hover, Pressed, Disabled | Interactive feedback | Auto-managed in code, Figma variants for visual reference | Regular |
| **Size** | Small, Medium, Large | Context sizing | Small: dense UIs, Medium: standard, Large: prominent placement | Medium |
| **Icon** | None, Left, Right, Only | Content configuration | None: text-only, Left: common pattern, Right: rare, Only: icon buttons | None |
| **Inversity** | Normal, Flipped | Theme adaptation | Normal: light backgrounds, Flipped: dark backgrounds | Normal |

### Detailed Variant Specifications

#### Type Variants
```
Primary (type=primary):
  Purpose: Main call-to-action
  Usage: 1 per screen/section maximum
  Visual: High contrast, prominent
  Accessibility: Must meet AAA contrast standards
  
Secondary (type=secondary):  
  Purpose: Supporting actions
  Usage: Multiple allowed per screen
  Visual: Medium contrast, outlined or filled
  Accessibility: Must meet AA contrast standards
  
Tertiary (type=tertiary):
  Purpose: Subtle actions  
  Usage: Unlimited, for less important actions
  Visual: Low contrast, minimal styling
  Accessibility: Must meet AA contrast standards
```

#### Size Variants
```
Small (size=sm):
  Use Cases: Dense interfaces, mobile, secondary actions
  Dimensions: Reduced by sm multiplier
  Touch Target: Minimum 44px (mobile)
  
Medium (size=md):
  Use Cases: Standard desktop interfaces
  Dimensions: Base token values
  Touch Target: Comfortable for desktop/mobile
  
Large (size=lg):
  Use Cases: Hero sections, primary CTAs, accessibility
  Dimensions: Increased by lg multiplier  
  Touch Target: Large, easily accessible
```

#### Icon Variants  
```
None (icon=none):
  Content: Text label only
  Layout: Single child, centered text
  
Left (icon=left):
  Content: Icon + text label
  Layout: Icon before text, common pattern
  
Right (icon=right):  
  Content: Text label + icon
  Layout: Text before icon, less common
  
Only (icon=only):
  Content: Icon without text label
  Layout: Single icon, requires aria-label
  Accessibility: Must have accessible name
```

### Variant Combination Rules

#### Valid Combinations
```
✅ Primary + Medium + Left Icon
✅ Secondary + Small + No Icon  
✅ Tertiary + Large + Right Icon
✅ All types + All sizes + All icon positions
```

#### Invalid Combinations
```
❌ Primary + Disabled (use CSS :disabled instead)
❌ Large + Icon Only (touch target too large)
❌ Small + Very long text (truncation issues)
```

### Accessibility Requirements

#### All Variants Must Support
- **Keyboard navigation**: Tab, Enter, Space
- **Screen readers**: Proper semantic markup
- **Focus indicators**: Visible focus ring
- **Color contrast**: WCAG AA minimum
- **Touch targets**: 44px minimum mobile
- **Reduced motion**: Respect user preferences

---

## 6. 📸 Visual References

### Component Screenshots
```
[Attach screenshots of:]
- All variant combinations
- Light/dark theme versions  
- Different size modes
- Interactive states
- Error/validation states
```

### Generated Code Preview
```
[Include output from:]
mcp_figma_dev_mod_get_code --forceCode=true
```

---

## 7. ⚡ Implementation Guidance

### Priority Implementation Order
1. **Core functionality** (basic button with primary type)
2. **Theme support** (light/dark mode switching)
3. **Size variants** (small, medium, large)
4. **Type variants** (secondary, tertiary styles)
5. **Icon support** (left, right, only configurations)
6. **Advanced features** (animations, advanced states)

### Technical Notes
```
Framework: [React | Angular | Vue]
Styling: [CSS Modules | Styled Components | Tailwind]
Testing: [Jest | Cypress | Testing Library]
Documentation: [Storybook | Custom docs]
```

### Development Checklist
- [ ] Component structure matches Figma layer hierarchy
- [ ] All design tokens properly referenced  
- [ ] Hardcoded properties implemented via CSS variables
- [ ] All variants render correctly
- [ ] Theme switching works
- [ ] Responsive behavior implemented
- [ ] Accessibility requirements met
- [ ] Unit tests written
- [ ] Visual regression tests added
- [ ] Documentation updated

---

## 8. 🔗 Related Resources

### Documentation Links
- [Component Guidelines](../../04-components/01-overview.md)
- [Design Token Architecture](../../03-design-tokens/references/technical/architecture-patterns.md) 
- [Accessibility Standards](../../06-guidelines/accessibility.md)

### Figma Resources
- [Component Library File](https://figma.com/file/[fileKey])
- [Design System Documentation](https://figma.com/file/[docsFileKey])
- [Usage Examples](https://figma.com/file/[examplesFileKey])

### Code Resources
- [Component Library Repository](https://github.com/[org]/[repo])
- [Design Token Package](https://github.com/[org]/[tokens-repo])
- [Implementation Examples](https://github.com/[org]/[examples-repo])

---

**Handoff Status:** [Ready for Development | In Review | Approved]  
**Next Steps:** [List immediate next actions]  
**Contact:** [Designer contact information]