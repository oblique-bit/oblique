# Component Tokenization Guidelines

## About This Document

**Status:** Draft  
**Target Audience:** Designers working with Figma components and Tokens Studio  
**Prerequisites:** Basic understanding of design tokens and semantic token structure  
**Context:** Part of Oblique Design System tokenization workflow  
**Last Updated:** December 2025

---

**Why Tokenize:** Tokens guarantee consistency between design and production, eliminate discrepancies, and ensure maintainable architecture.

**Purpose:** Enable designers to fully tokenize components with zero hardcoded values

## 1. Token Selection Guidelines

**Definition:** Assignment of existing semantic tokens to:
1. Figma layers and properties (can be skipped to go directly to step 2)
2. Component tokens (if they already exist, otherwise do step 1 first)

### Colors (mode-aware if using s3 level)
Use `ob.s3.color.*` tokens from semantic color groups:
- `interactive.*` - buttons, links, form controls
- `neutral.*` - text, backgrounds, borders
- `status.*` - success, warning, error states
- `brand.*` - brand identity elements (only logo uses this - do not use this color)
- Components can consume multiple color groups (e.g., button uses interactive + neutral)

### Spacing
Use `ob.s.dimension.*` tokens:
- **Component-size:** `ob.s.dimension.dynamic.component_size.*` (if you need spacing to change on mode switch) or `ob.s.dimension.static.component_size.*` (for stable spacing that does not react on mode switch)
- **Density:** `ob.s.dimension.dynamic.density.*` (if you need spacing to change on mode switch) or `ob.s.dimension.static.density.*` (for stable spacing that does not react on mode switch)

### Borders (only colors are mode-aware)
- **Border width:** Use `ob.s.border_width.*` tokens
- **Border radius:** Use `ob.s.border_radius.*` tokens
- **Border color:** Use `ob.s3.color.neutral.border.*` tokens

### Shadows
Use `ob.s.shadow.*` tokens for component shadows and effects

### Typography
Use `ob.s.typography.*` tokens (e.g., button uses `ob.s.dynamic.font_size.md`, `ob.s.dynamic.lineHeight.xs`)

## 2. Component Token Creation

### Naming Convention
```
ob.c.{component}.{property}.{variant}.{state}  // Custom components
ob.h.{element}.{property}.{variant}.{state}    // W3C HTML elements
```

### Token Categories
- **Custom Components:** Use `ob.c.*` prefix for Oblique custom components
- **HTML Elements:** Use `ob.h.*` prefix for existing W3C HTML elements
- **HTML Typography:** Use `ob.h.typography.*` for W3C typography elements like H1

### Token Structure
- Reference semantic tokens, not primitives
- Support theming (lightness, emphasis, inversity)
- Document purpose and context

## 3. Validation Process (WiP)

### MCP Figma Validation 
1. Select component in Figma
2. Run `mcp_figma_dev_mod_get_variable_defs`
3. Verify all properties use tokens
4. Test across mode combinations

### Validation Checklist
- [ ] Zero hardcoded values
- [ ] All properties tokenized
- [ ] Mode switching works
- [ ] Component maintains visual integrity