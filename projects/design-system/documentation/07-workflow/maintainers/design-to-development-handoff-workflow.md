# Developer Guide: Design Handoff Implementation

**Version:** 2.0  
**Date:** September 26, 2025  
**Audience:** Developers implementing components from design handoffs  
**Purpose:** Complete guide for developers to understand and implement Figma component handoffs

## Overview

This guide helps developers understand, validate, and implement components from design handoffs. It covers handoff deliverables, technical implementation requirements, and validation processes.

## 🎯 What You'll Receive in a Handoff

Every design handoff provides these deliverables:
- ✅ **Component specification** with deep Figma URL
- ✅ **Layer structure** with exact token mappings  
- ✅ **Implementation constraints** (sizing, behavior, integration rules)
- ✅ **Hardcoded properties** that require manual implementation
- ✅ **Theme/mode compatibility** documentation
- ✅ **Component variants** with usage guidelines

### Handoff File Structure
```
handoff-[component-name]-[date]/
├── handoff-specification.md      # Main implementation guide
├── figma-metadata-export.xml     # MCP component structure
├── figma-variables-export.json   # Token mappings
├── figma-generated-code.tsx      # Implementation reference
├── component-screenshots.png     # Visual reference
└── implementation-notes.md       # Developer-specific guidance
```

## 📖 Understanding Handoff Documentation

### Component Information Format
Each handoff includes structured component information:
```
Component Name: [Component Name]
Figma URL: https://figma.com/design/[fileKey]/[fileName]?node-id=[nodeId]
Node ID: [nodeId] (for MCP tools verification)
Component Location: [Page Name] > [Section Name]
Last Updated: [YYYY-MM-DD]
Status: Ready for Development
```

### Layer Structure Documentation Format
Components are documented using this standardized format:
```markdown
## Component Analysis: [exact_component_name]

### Layer Structure (extracted from Figma)
[exact_frame_name]
└── [exact_component_name]
    └── [layer_name_from_figma]
        ├── [sub_layer_name_from_figma]
        ├── [sub_layer_name_from_figma]  
        └── [sub_layer_name_from_figma]

### Figma Source Information
- **File**: [figma_file_name]
- **Last Modified**: [last_modified_date]
- **Component Path**: [component_location_in_file]
```

### Token Mapping Documentation
Layer-to-token relationships are documented in tables:
| Layer Name | Layer Type | Property | Token Path | Token Value | Implementation Notes |
|------------|------------|----------|------------|-------------|---------------------|
| Background | Rectangle | fill | `ob.s3.color.neutral.bg.surface` | `#ffffff` | Surface background |
| Label | Text | fontSize | `ob.s.dynamic.fontSize.md` | `17px` | Button text size |
| Icon | Frame | width/height | `ob.h.button.icon.size.md` | `20px` | Icon dimensions |
| Container | Auto Layout | padding | `ob.h.button.spacing.padding.horizontal` | `12px` | Internal spacing |

**⚠️ Important**: Token values shown in handoff documentation are **approximations** for reference only. For accurate implementation, always use **Style Dictionary compiled CSS** which provides the actual resolved values.
## 🔧 Technical Implementation Requirements

### Component Architecture & Implementation Constraints

Every component handoff documents its architectural requirements:

#### Component System Architecture
Components may be part of larger systems. Example documentation:
```
Button Component System:
├── button.label_icon → Standard button (text + optional icons)
├── button.icon_only → Square constraint (width = height)
└── button.remove → Always embedded, never standalone
```

#### Critical Implementation Constraints
**Sizing Philosophy & Rules:**
- **Content-driven sizing**: Components that adapt to content length
- **Proportional constraints**: Fixed ratios that must be maintained (e.g., square buttons)
- **Compact integration**: Size limitations for embedded use cases
- **Touch target requirements**: Minimum 44px interactive areas for accessibility

#### Component Variant Schema Patterns
Each component documents its internal structure template:
```
Example: button.label_icon variants contain:
├── Background Frame (with fill/border styling)
├── Icon Slot (optional, left or right positioning)  
├── Text Label (typography styling)
└── Focus Ring (interaction state indicator)
```

#### Integration & Usage Rules
- **Standalone vs. Embedded**: Which components can be used independently
- **Parent Component Integration**: How components nest within others
- **Context-Specific Guidelines**: When to use each variant
- **Accessibility Requirements**: ARIA labels, keyboard navigation support

### Hardcoded Properties Implementation

Some properties cannot be controlled through design tokens and require manual implementation:

#### Reference Documentation
See comprehensive list: [Figma Hardcoded Properties Reference](./figma-hardcoded-properties-reference.md)

#### Common Categories Requiring Manual Implementation
**Layout & Auto Layout Properties:**
- `layoutMode`, `layoutWrap`, `layoutSizingHorizontal`, `layoutSizingVertical`
- Auto-layout direction and wrapping behavior

**Visual Properties:**
- `opacity`, `blendMode`, `effects` (shadows, blurs)
- Layer blend modes and visual effects

**Interactive & Behavioral:**
- `reactions`, `overlayBackgroundInteraction`
- Component interaction behaviors and animations

**Developer Implementation Notes:**
- These properties must be implemented manually in code
- Cannot be automatically extracted from design tokens
- Require specific framework implementation (CSS, React, Angular, etc.)

### Complete Token Implementation Guide

#### Critical Dependency: Style Dictionary Compilation
**⚠️ IMPORTANT**: Accurate implementation requires **Style Dictionary compiled output**. Raw token paths from Figma must be resolved through the build process to get actual CSS values.

#### Token Implementation Workflow
```bash
# Step 1: Get Style Dictionary compiled CSS
npm run build:tokens
# → Generates resolved CSS custom properties with actual values

# Step 2: Use compiled token output for implementation
# Only the compiled CSS shows the true resolved values
```

#### Token Categories from Handoff Documentation

**Typography & Content Tokens** (require Style Dictionary resolution):
```
Handoff provides token paths:
- ob/s/static/font_family/body → Font family token path
- ob/s/dynamic/fontSize/md → Font size token path (listed as "17px" but needs verification)
- ob/s/dynamic/font_weight/medium → Font weight token path (listed as "500" but needs verification)

Implementation requires compiled CSS:
font-family: var(--ob-s-static-font-family-body); /* Actual font stack from Style Dictionary */
font-size: var(--ob-s-dynamic-fontSize-md); /* Actual resolved value */  
font-weight: var(--ob-s-dynamic-font-weight-medium); /* Actual weight value */
```

**Layout & Spacing Tokens** (require Style Dictionary resolution):
```
Handoff provides token paths with approximate values:
- ob/h/button/label_icon/spacing/gap → "6px" (approximate)
- ob/h/button/label_icon/spacing/padding/horizontal → "12px" (approximate)  
- ob/h/button/label_icon/spacing/padding/vertical → "6px" (approximate)

Implementation must use Style Dictionary compiled values:
padding: var(--ob-h-button-label-icon-spacing-padding-vertical) 
         var(--ob-h-button-label-icon-spacing-padding-horizontal);
gap: var(--ob-h-button-label-icon-spacing-gap);
```

**Color System Implementation** (require Style Dictionary resolution):
```
Handoff provides token paths with approximate hex values:
- ob/h/button/color/fg/primary/inversity_normal/enabled → "#ffffff" (approximate)
- ob/h/button/color/bg/primary/inversity_normal/enabled → "#2379a4" (approximate)

Implementation must use Style Dictionary compiled CSS:
color: var(--ob-h-button-color-fg-primary-inversity-normal-enabled);
background: var(--ob-h-button-color-bg-primary-inversity-normal-enabled);

/* Theme inversity - only Style Dictionary shows actual resolved values */
.theme-dark & {
  color: var(--ob-h-button-color-fg-primary-inversity-flipped-enabled);
  background: var(--ob-h-button-color-bg-primary-inversity-flipped-enabled);  
}
```

#### Why Style Dictionary is Required
- **Token References**: Handoff shows `{ob.s3.color.primary}` but not final resolved values
- **Complex Calculations**: Tokens may reference other tokens with mathematical operations  
- **Theme Resolution**: Light/dark theme variations require compilation to actual values
- **Platform Output**: Style Dictionary generates platform-specific formats (CSS, iOS, Android)

#### Implementation Reality Check
**❌ Cannot implement accurately without Style Dictionary**
```css
/* Wrong - guessing values from handoff approximations */
.button { 
  font-size: 17px; /* Handoff says "17px" but is this the compiled value? */
  color: #ffffff; /* Handoff says "#ffffff" but is this theme-aware? */
}
```

**✅ Correct implementation process**
```bash  
# 1. Ensure Style Dictionary build is current
npm run build:tokens

# 2. Use compiled CSS custom properties  
.button {
  font-size: var(--ob-s-dynamic-fontSize-md); /* Actual resolved value from build */
  color: var(--ob-h-button-color-fg-primary-inversity-normal-enabled); /* Actual resolved, theme-aware value */
}
```

### Theme/Mode Implementation Requirements

#### Supported Theme Modes
Components must support multiple theme and mode variations:

```
Theme System Implementation:
├── Light Theme (default)
│   ├── Primary colors: var(--ob-s3-color-brand-primary)
│   ├── Surface colors: var(--ob-s3-color-neutral-bg-surface)
│   └── Text colors: var(--ob-s3-color-neutral-fg-primary)
└── Dark Theme (inversity_flipped)
    ├── Primary colors: var(--ob-s3-color-brand-primary-inversity-flipped)  
    ├── Surface colors: var(--ob-s3-color-neutral-bg-surface-inversity-flipped)
    └── Text colors: var(--ob-s3-color-neutral-fg-primary-inversity-flipped)

Responsive Modes:
├── Desktop (default)
└── Mobile (responsive token multipliers applied)

Component Size Modes:
├── Small (sm)
├── Medium (md) - default
└── Large (lg)
```

#### Implementation Testing Requirements
1. **Light/Dark Theme Toggle**: Test both theme modes work correctly
2. **Responsive Behavior**: Verify mobile vs desktop sizing
3. **Size Variations**: Test all available size modes
4. **Interaction States**: Validate hover, pressed, disabled states in all modes

### Component Variants Implementation

#### Variant Matrix Understanding
Each component documents its variant system:

| Variant Property | Values | Implementation Purpose | Usage Guidelines |
|------------------|--------|----------------------|-----------------|
| **Type** | Primary, Secondary, Tertiary | Visual hierarchy levels | Primary = main action, Secondary = supporting |
| **State** | Regular, Hover, Pressed, Disabled | CSS interaction states | Auto-managed by CSS pseudo-classes |
| **Inversity** | Normal, Flipped | Light/dark theme support | Normal = light backgrounds, Flipped = dark |
| **Size** | Small, Medium, Large | Context-appropriate sizing | Small = dense UIs, Large = prominent actions |
| **Icon** | With/Without Icon | Content flexibility | With icon when visual reinforcement needed |

#### Implementation Hierarchy Rules
```css
/* Primary Type Implementation */
.button-primary {
  /* Use for main call-to-action */
  /* Maximum 1 per screen/section */
  /* High visual prominence required */
}

/* Secondary Type Implementation */
.button-secondary {
  /* Use for supporting actions */
  /* Multiple allowed per screen */
  /* Medium visual prominence */
}

/* Tertiary Type Implementation */
.button-tertiary {
  /* Use for subtle actions */
  /* Minimal visual impact */
  /* Text-like appearance */
}
```

## 🛠️ MCP Tools for Implementation Verification

### When to Use MCP Tools
As a developer, you may need to verify or extract additional information from Figma components. Use MCP tools for:
- **Verification**: Confirm handoff documentation accuracy
- **Missing Information**: Extract details not provided in handoff
- **Troubleshooting**: Resolve discrepancies between design and handoff docs

### MCP Command Reference
```bash
# Get component metadata and structure
mcp_figma_dev_mod_get_metadata
# → Provides exact component/frame names and dimensions

# Extract all variable/token assignments
mcp_figma_dev_mod_get_variable_defs  
# → Shows which tokens are applied to which properties

# Generate component implementation code (for complex components)
mcp_figma_dev_mod_get_code --forceCode=true
# → Generates HTML/CSS implementation reference
# → Extract layer names from data-name attributes

# Capture visual reference
mcp_figma_dev_mod_get_image
# → Screenshot for visual comparison during implementation
```

### How to Use MCP Results for Implementation

#### Using Metadata Results
- Extract exact component and layer names (never modify these names)
- Get component dimensions for container sizing
- Understand component hierarchy and structure

#### Using Variable Definitions
- Map design tokens to CSS custom properties
- Identify which properties use tokens vs hardcoded values
- Understand token inheritance and relationships

#### Using Generated Code
- **Critical**: Only source for internal layer structure
- Extract exact layer names from `data-name` attributes  
- Follow HTML hierarchy for component structure
- Use as implementation architecture reference

#### Critical MCP Usage Rules
**Never:**
- Assume component structure without extracting from `get_code`
- Modify or invent layer/component names from Figma
- Skip `get_code` when you need internal structure details
- Use only metadata for complete component understanding

**Always:**
- Use `get_code` to understand internal component layers
- Extract exact names from generated `data-name` attributes
- Follow HTML structure hierarchy for implementation
- Preserve exact Figma naming in your implementation

## ✅ Developer Implementation Checklist

### Pre-Implementation Validation
Before starting implementation, verify you have:

**Handoff Documentation:**
- [ ] Component specification with Figma deep URL
- [ ] Layer structure with token path mappings (not final values)
- [ ] Component architecture and implementation constraints documented
- [ ] Hardcoded properties list with implementation notes
- [ ] Theme/mode compatibility requirements
- [ ] Component variant matrix with usage guidelines

**Critical Build Requirements:**
- [ ] **Style Dictionary build is current** (`npm run build:tokens`)
- [ ] **Compiled CSS custom properties** are available for your project
- [ ] **Token resolution verified** - actual values match design intent
- [ ] Framework/library supports the compiled CSS custom properties

**Technical Requirements:**
- [ ] All referenced design tokens exist in compiled CSS output
- [ ] Framework/library supports required interaction states  
- [ ] Accessibility requirements are clear (ARIA, keyboard navigation)
- [ ] Integration constraints understood (standalone vs embedded)

### Implementation Process Validation
During implementation, confirm:

**Structure & Naming:**
- [ ] Component structure matches documented layer hierarchy
- [ ] All layer names preserved exactly as documented
- [ ] Token references implemented correctly (CSS custom properties)
- [ ] Hardcoded properties implemented manually as specified

**Behavior & Constraints:**
- [ ] Sizing constraints respected (proportional, content-driven, etc.)
- [ ] All component variants implemented (type, state, inversity, size)
- [ ] Theme modes working (light/dark inversity support)
- [ ] Interactive states function correctly (hover, pressed, disabled)

### Post-Implementation Verification
After implementation, validate:

**Visual & Functional:**
- [ ] Component matches Figma visual reference in all states
- [ ] All variants render correctly with proper token values
- [ ] Responsive behavior works across breakpoints
- [ ] Accessibility requirements met (contrast, focus indicators)

**Integration & Quality:**
- [ ] Component integrates properly with parent components (if embedded)
- [ ] No hardcoded values where tokens should be used
- [ ] Code follows project conventions and standards
- [ ] Documentation updated with implementation notes

**Cross-Theme Testing:**
- [ ] Light theme displays correctly
- [ ] Dark theme (inversity_flipped) displays correctly  
- [ ] Smooth transitions between themes
- [ ] All interaction states work in both themes

## � Common Implementation Pitfalls & Solutions

### Critical Mistake: Using Handoff Approximations Instead of Compiled Values

**❌ Wrong: Using handoff "approximate" values**
```css
.button { 
  font-size: 17px; /* Handoff approximation - may not be accurate */
  padding: 6px 12px; /* Handoff approximation - may not be accurate */
  color: #ffffff; /* Handoff approximation - not theme-aware */
}
```

**✅ Correct: Using Style Dictionary compiled values**  
```css
.button {
  font-size: var(--ob-s-dynamic-fontSize-md); /* Actual resolved value */
  padding: var(--ob-h-button-label-icon-spacing-padding-vertical) 
           var(--ob-h-button-label-icon-spacing-padding-horizontal); /* Actual resolved values */
  color: var(--ob-h-button-color-fg-primary-inversity-normal-enabled); /* Theme-aware resolved value */
}
```

### Other Implementation Mistakes

**❌ Missing Style Dictionary Build Step**
```bash
# Wrong - implementing without current build
# Using old compiled CSS that may not match current Figma

# Correct - ensuring current token compilation  
npm run build:tokens  # Generate current compiled CSS
# Then implement using fresh compiled custom properties
```

**❌ Ignoring Component Architecture Constraints**
```css
/* Wrong - breaking square constraint for icon_only buttons */
.button-icon-only {
  width: 40px;
  height: 36px; /* Should equal width */
}

/* Correct */
.button-icon-only {
  width: var(--ob-h-button-icon-only-size); /* If available from Style Dictionary */
  height: var(--ob-h-button-icon-only-size); /* Width = Height constraint maintained */
}
```

### Implementation Best Practices
- **Always run Style Dictionary build** before implementation (`npm run build:tokens`)
- **Never use handoff approximate values** as final implementation
- **Verify compiled CSS** matches design intent visually  
- **Test all variants and themes** using compiled token values
- **Cross-reference token paths** between handoff docs and compiled CSS
- **Follow exact layer naming** from handoff documentation
- **Implement accessibility requirements** (focus, ARIA, keyboard navigation)

## 🔗 Related Documentation & Resources

### Essential References
- [Figma Hardcoded Properties Reference](./figma-hardcoded-properties-reference.md)
- [Design Token Architecture](../../03-design-tokens/architecture.md)
- [Component Implementation Guidelines](../../04-components/01-overview.md)

### Developer Tools & Templates  
- [Component Handoff Template](./templates/component-handoff-template.md)
- [MCP Command Reference](./templates/mcp-handoff-commands.md)
- [Token Validation Scripts](./validation-tools/)

### Design System Resources
- [Accessibility Guidelines](../../06-guidelines/accessibility.md)
- [Theme Implementation Guide](../../03-design-tokens/themes/)
- [Component Testing Standards](../../05-patterns/testing.md)

---

*This guide provides complete implementation guidance for developers receiving design handoffs. For questions or clarification, consult the handoff deliverables or contact the design system team.*