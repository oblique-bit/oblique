# Design Token Compound Units Reference

This document lists all compound units used in the Oblique Design System. Compound units now use underscores instead of hyphens, creating consistency between token sources and CSS variables without requiring transformations.

## Overview

Design tokens use compound units (multi-word identifiers) with underscores for consistency across Token Studio, Figma Variables, and CSS output. This eliminates the need for camelCase transformations and provides predictable naming.

### Style Dictionary Integration

This document provides the reference for Style Dictionary processing. [Style Dictionary](https://amzn.github.io/style-dictionary/#/) now preserves the underscore format in CSS variables, eliminating transformation complexity. 

When implementing new compound units in the design system:
1. Add them to the list in this document using underscore format
2. Ensure Style Dictionary preserves the underscore naming
3. Verify the CSS output maintains the underscore convention

## Compound Unit Format

### Current Format (Underscore)

| Token Format | CSS Format |
|-------------|------------|
| `contrast_high` | `contrast_high` |
| `contrast_medium` | `contrast_medium` |
| `contrast_low` | `contrast_low` |
| `inversity_normal` | `inversity_normal` |
| `inversity_flipped` | `inversity_flipped` |

All compound units now use underscores and remain unchanged in CSS output.

## Usage Examples

### Token Structure
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.{status_name}.{property}.{contrast_level}.{inversity_variation}
```

### CSS Implementation
```scss
/* INVALID: Old format - using hyphens */
color: var(--ob-s2-color-status-critical-fg-contrast_high-inversity_normal);

/* - New format - using underscores */
color: var(--ob-s2-color-status-critical-fg-contrast_high-inversity_normal);
```

**Benefits:**
- - Consistent naming across Token Studio, Figma, and CSS
- - No transformation complexity
- - Predictable token names for developers

## Complete Compound Unit List

> This list represents the compound units currently used in the design system token structure. These units maintain their underscore format to preserve semantic meaning and avoid CSS transformation complexity.

### All Compound Units
- `alert_notification`
- `app_title`
- `badge_label`
- `bg_base`
- `bg_disabled`
- `border_radius`
- `border_width`
- `bottom_left`
- `bottom_right`
- `box_shadow`
- `buttons_container`
- `buttons_order_figma`
- `close_button_size`
- `cobalt_alpha`
- `col_gap`
- `component_configuration`
- `components_only`
- `container_top`
- `contrast_high`
- `contrast_high_alpha`
- `contrast_highest`
- `contrast_low`
- `contrast_lowest`
- `contrast_medium`
- `custom_buttons`
- `custom_buttons_container`
- `custom_buttons_label`
- `custom_icon`
- `docs_lg`
- `docs_md`
- `docs_sm`
- `ease_in`
- `ease_in_out`
- `ease_out`
- `emphasis_high`
- `emphasis_low`
- `event_horizon`
- `expansion_panel`
- `fatal_test`
- `fg_base`
- `fg_disabled`
- `fg_static`
- `fg_visited`
- `figma_canvas_bg`
- `figma_section_bg`
- `figma_section_border`
- `file_upload`
- `font_family`
- `font_size`
- `font_weight`
- `horizontal_nav_cell`
- `icon_only`
- `icon_size`
- `indigo_alpha`
- `infobox_icon_container`
- `internal_list`
- `inversity_flipped`
- `inversity_flipped_alpha`
- `inversity_normal`
- `language_label`
- `letter_spacing`
- `letter_spacing_px`
- `letter_spacing_rem`
- `letterSpacing_depr`
- `letterSpacing_px`
- `list_group`
- `main_nav`
- `margin_bottom`
- `margin_top`
- `marker_gap`
- `max_width`
- `min_height`
- `min_width`
- `mult_responsive`
- `mult_static`
- `nav_tree`
- `neg_100`
- `neg_150`
- `neg_200`
- `neg_250`
- `neg_300`
- `neg_50`
- `no_color`
- `off_canvas`
- `padded_container`
- `padding_bottom`
- `padding_left`
- `padding_right`
- `padding_top`
- `parentof_buttons_container`
- `radio_checkbox`
- `row_gap`
- `single_item`
- `slide_toggle`
- `step_label`
- `step_number`
- `submenu_row_label`
- `text_bar`
- `text_blocks`
- `text_decoration`
- `text_label`
- `text_variant_container`
- `theme_configuration`
- `title_bar`
- `top_after_p`
- `top_left`
- `top_right`
- `type_scale`
- `user_input`
- `white_alpha`
- `with_text`
- `z_index`

### Compound Units with CSS Transformations
These compound units need camelCase transformation when used in CSS:

- `contrast_high` -> `contrastHigh`
- `contrast_medium` -> `contrastMedium`
- `contrast_low` -> `contrastLow`
- `inversity_normal` -> `inversityNormal`
- `inversity_flipped` -> `inversityFlipped`
- `border_radius` -> `borderRadius`
- `font_family` -> `fontFamily`
- `font_size` -> `fontSize`
- `font_weight` -> `fontWeight`
- `letter_spacing` -> `letterSpacing`

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
- - Verify CSS examples use camelCase
- - Check documentation descriptions use hyphenated format
- - Ensure consistency across similar examples

---

*This document should be updated whenever new compound units are added to the design system.*

## Updating This Document

To update the compound units list when new tokens are added:

1. **Manual Review**: Examine the current token structure in `src/lib/themes/` to identify compound units

2. **Update Documentation**: Add any new compound units to the "All Compound Units" section of this document

3. **CSS Transformations**: Add any new compound units that require CSS transformation to the "Compound Units with CSS Transformations" section

4. Update Style Dictionary transformations:
   - Ensure all new compound units are properly handled by Style Dictionary's transformation configuration
   - Add custom transformers for special cases if needed
   - Test that the transformed output correctly uses camelCase format
