# Design Token Compound Units Reference

This document lists all compound units used in the Oblique Design System documentation and their camelCase transformations for CSS implementations.

## Overview

Design tokens use compound units (multi-word identifiers) that need to be transformed when used in CSS variables to maintain consistency and readability. The transformation follows camelCase conventions where subsequent words are capitalized.

## Compound Unit Transformations

### Contrast Levels

| Documentation Format | CSS Format |
|---------------------|------------|
| `contrast-high` | `contrastHigh` |
| `contrast-medium` | `contrastMedium` |
| `contrast-low` | `contrastLow` |

### Inversity Variations

| Documentation Format | CSS Format |
|---------------------|------------|
| `inversity-normal` | `inversityNormal` |
| `inversity-flipped` | `inversityFlipped` |

## Usage Examples

### Documentation Token Structure
```
ob.s.color.status.{status-name}.{property}.{contrast-level}.{inversity-variation}
```

### CSS Implementation
```scss
/* ❌ Incorrect - using documentation format */
color: var(--ob-s-color-status-critical-fg-contrast-high-inversity-normal);

/* ✅ Correct - using camelCase format */
color: var(--ob-s-color-status-critical-fg-contrastHigh-inversityNormal);
```

## Complete Compound Unit List

### Status Colors
- `contrastHigh-inversityNormal`
- `contrastHigh-inversityFlipped`
- `contrastMedium-inversityNormal`
- `contrastMedium-inversityFlipped`
- `contrastLow-inversityNormal`
- `contrastLow-inversityFlipped`

### Future Compound Units
This document will be updated as new compound units are introduced to the design system.

## Implementation Guidelines

### For CSS/SCSS Files
1. **Always use camelCase** for compound units in CSS variable references
2. **Transform documentation examples** before implementing in code
3. **Maintain consistency** across all CSS implementations

### For Documentation
1. **Use hyphenated format** in conceptual explanations and token structure definitions
2. **Show camelCase format** in all CSS code examples
3. **Include transformation reference** when introducing new compound units

## Validation

### Automated Checking
Consider implementing linting rules to validate that:
- CSS variables use camelCase compound units
- Documentation examples are consistent
- No mixed formats exist in the same file

### Manual Review
When reviewing code or documentation:
- ✅ Verify CSS examples use camelCase
- ✅ Check documentation descriptions use hyphenated format
- ✅ Ensure consistency across similar examples

---

*This document should be updated whenever new compound units are added to the design system.*
