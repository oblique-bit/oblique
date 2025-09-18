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

## Implementation Notes

- Single tokens provide granular control for component construction
- Grouped tokens offer ready-to-use typography compositions
- Dynamic tokens scale with global multipliers for responsive design
- Static tokens maintain consistent values across all contexts
- All token references properly resolve through the dynamic/static segment structure

---
*Resolved: OUI-4035*
