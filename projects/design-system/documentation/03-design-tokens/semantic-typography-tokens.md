# Semantic Typography Tokens

## Overview

The semantic typography tokens are organized into two main folders that serve different purposes in the design system architecture:

- **`single/`** - Individual property tokens for granular component usage
- **`grouped/`** - Composite tokens ready for styling applications

## Folder Structure

### Single Tokens (`/single/`)

Contains individual property tokens (fontSize, lineHeight, fontWeight, etc.) that serve as building blocks for more complex typography compositions. These tokens are used for granular control when constructing components.

**Files:**
- `sm.json`, `md.json`, `lg.json` - Dynamic tokens that reference global multipliers
- `static.json` - Static tokens without multiplier calculations

### Grouped Tokens (`/grouped/`)

Contains pre-composed typography tokens that combine multiple properties (fontFamily, fontWeight, fontSize, lineHeight, letterSpacing, paragraphSpacing) into ready-to-use typography styles. These are primarily used in Figma styles and component applications.

**Files:**
- `sm.json`, `md.json`, `lg.json` - Dynamic composite tokens
- `static.json` - Static composite tokens

## Dynamic vs Static Segments

### Dynamic Tokens
- Include global multiplier calculations (e.g., `{ob.g.multiplier.typography.lg}`)
- Respond to viewport and density changes
- Structure: `{ob.s.dynamic.fontSize.md}`

### Static Tokens  
- Fixed values without multiplier calculations
- Consistent across all contexts
- Structure: `{ob.s.static.fontSize.md}`

## Token References

The grouped tokens reference the single tokens using the appropriate dynamic/static segments:

**Dynamic grouped tokens reference:**
```json
"fontSize": "{ob.s.dynamic.fontSize.xs} * {ob.g.multiplier.typography.lg}"
```

**Static grouped tokens reference:**
```json  
"fontSize": "{ob.s.static.fontSize.xs}"
```

## Typography Token Architecture

The design system uses two distinct approaches for typography tokens based on their use case:

### A) Semantic Typography Tokens (Headings)
- **Use consolidated "composition-tokens"** that combine all typography properties (fontFamily, fontWeight, fontSize, lineHeight, letterSpacing, paragraphSpacing) into a single object
- **Purpose**: Directly map to Figma Typography Styles for seamless design-to-code workflow
- **Example**: `{ob.s3.typography.style.display.xl}` contains complete typography definition
- **Location**: Semantic layer provides reusable typography styles

### B) Component Typography Tokens (Buttons, etc.)
- **Use individual property tokens** where each typography property is defined separately
- **Purpose**: Avoid creating component-specific typography styles in Figma while maintaining CSS flexibility
- **Example**: Individual tokens for `{ob.h.button.typography.font_size}`, `{ob.h.button.typography.line_height}`, etc.
- **Additional**: Include consolidated reference token for completeness but primary usage is individual properties

### Architectural Rationale
This dual approach balances Figma workflow efficiency with CSS implementation flexibility:
- **Semantic headings**: Need Figma Typography Styles for consistent design application
- **Component elements**: Require granular control without polluting Figma with component-specific typography styles

## Implementation Notes

- Single tokens provide granular control for component construction
- Grouped tokens offer ready-to-use typography compositions  
- Dynamic tokens scale with global multipliers for responsive design
- Static tokens maintain consistent values across all contexts
- All token references properly resolve through the dynamic/static segment structure
- Typography architecture intentionally uses different patterns based on use case and Figma integration needs

---
*Resolved: OUI-4035*
