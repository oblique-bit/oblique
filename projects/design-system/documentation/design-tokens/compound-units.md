# Design Token Compound Units Reference

This document lists all compound units used in the Oblique Design System documentation and their camelCase transformations for CSS implementations.

## Overview

Design tokens use compound units (multi-word identifiers) that need to be transformed when used in CSS variables to maintain consistency and readability. The transformation follows camelCase conventions where subsequent words are capitalized.

### Style Dictionary Integration

This document provides the reference for Style Dictionary transformations. [Style Dictionary](https://amzn.github.io/style-dictionary/#/) is the tool used to transform our design tokens from their documentation format (hyphenated) to their implementation format (camelCase) for CSS variables. 

When implementing new compound units in the design system:
1. Add them to the list in this document
2. Ensure they have appropriate transformations defined in Style Dictionary
3. Verify the CSS output follows the camelCase convention

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

> This list was generated using the `scripts-custom/extract-compound-units.js` script, which analyzes all JSON files in the design system to identify and extract compound units from token keys.

### All Compound Units
- `alert-notification`
- `app-title`
- `badge-label`
- `bg-base`
- `bg-disabled`
- `border-radius`
- `border-width`
- `bottom-left`
- `bottom-right`
- `box-shadow`
- `buttons-container`
- `buttons-order-figma`
- `close-button-size`
- `cobalt-alpha`
- `col-gap`
- `component-configuration`
- `components-only`
- `container-top`
- `contrast-high`
- `contrast-high-alpha`
- `contrast-highest`
- `contrast-low`
- `contrast-lowest`
- `contrast-medium`
- `custom-buttons`
- `custom-buttons-container`
- `custom-buttons-label`
- `custom-icon`
- `docs-lg`
- `docs-md`
- `docs-sm`
- `ease-in`
- `ease-in-out`
- `ease-out`
- `emphasis-high`
- `emphasis-low`
- `event-horizon`
- `expansion-panel`
- `fatal-test`
- `fg-base`
- `fg-disabled`
- `fg-static`
- `fg-visited`
- `figma-canvas-bg`
- `figma-section-bg`
- `figma-section-border`
- `file-upload`
- `font-family`
- `font-size`
- `font-weight`
- `horizontal-nav-cell`
- `icon-only`
- `icon-size`
- `indigo-alpha`
- `infobox-icon-container`
- `internal-list`
- `inversity-flipped`
- `inversity-flipped-alpha`
- `inversity-normal`
- `language-label`
- `letter-spacing`
- `letter-spacing-px`
- `letter-spacing-rem`
- `letterSpacing-depr`
- `letterSpacing-px`
- `list-group`
- `main-nav`
- `margin-bottom`
- `margin-top`
- `marker-gap`
- `max-width`
- `min-height`
- `min-width`
- `mult-responsive`
- `mult-static`
- `nav-tree`
- `neg-100`
- `neg-150`
- `neg-200`
- `neg-250`
- `neg-300`
- `neg-50`
- `no-color`
- `off-canvas`
- `padded-container`
- `padding-bottom`
- `padding-left`
- `padding-right`
- `padding-top`
- `parentof-buttons-container`
- `radio-checkbox`
- `row-gap`
- `single-item`
- `slide-toggle`
- `step-label`
- `step-number`
- `submenu-row-label`
- `text-bar`
- `text-blocks`
- `text-decoration`
- `text-label`
- `text-variant-container`
- `theme-configuration`
- `title-bar`
- `top-after-p`
- `top-left`
- `top-right`
- `type-scale`
- `user-input`
- `white-alpha`
- `with-text`
- `z-index`

### Compound Units with CSS Transformations
These compound units need camelCase transformation when used in CSS:

- `contrast-high` -> `contrastHigh`
- `contrast-medium` -> `contrastMedium`
- `contrast-low` -> `contrastLow`
- `inversity-normal` -> `inversityNormal`
- `inversity-flipped` -> `inversityFlipped`
- `border-radius` -> `borderRadius`
- `font-family` -> `fontFamily`
- `font-size` -> `fontSize`
- `font-weight` -> `fontWeight`
- `letter-spacing` -> `letterSpacing`

## Implementation Guidelines

### Style Dictionary Configuration
Style Dictionary should be configured to transform all compound units from hyphenated format to camelCase. This typically involves:

1. **Name Transformers**: Custom name transformers that handle hyphenated names
   ```javascript
   const transformName = (name) => {
     // Transform hyphenated parts to camelCase
     return name.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
   };
   ```

2. **Format Configuration**: Ensuring the CSS variable formatter uses the transformed names
   ```javascript
   formats: {
     css: {
       transformGroup: 'css',
       buildPath: 'dist/',
       files: [{
         format: 'css/variables',
         destination: 'variables.css'
       }]
     }
   }
   ```

3. **Validation**: Adding validators to ensure all compound units are properly transformed

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

Style Dictionary can be configured with validation plugins to ensure:
- All compound units are consistently transformed
- The built output follows the camelCase conventions
- Deprecated compound units are flagged during build

### Manual Review
When reviewing code or documentation:
- ✅ Verify CSS examples use camelCase
- ✅ Check documentation descriptions use hyphenated format
- ✅ Ensure consistency across similar examples

---

*This document should be updated whenever new compound units are added to the design system.*

## Updating This Document

To update the compound units list when new tokens are added:

1. Run the extraction script:
   ```bash
   node scripts-custom/extract-compound-units.js
   ```

2. Copy the output to update the "All Compound Units" section of this document

3. Add any new compound units that require CSS transformation to the "Compound Units with CSS Transformations" section

4. Update Style Dictionary transformations:
   - Ensure all new compound units are properly handled by Style Dictionary's transformation configuration
   - Add custom transformers for special cases if needed
   - Test that the transformed output correctly uses camelCase format
