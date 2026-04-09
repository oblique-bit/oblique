# Neutral Colors

**About:** Foundational colors for backgrounds, text, borders, and surfaces.  
**Token Path:** `ob.s3.color.neutral.*`  
**Architecture:** See [Semantic Color Architecture](03-colors-semantic.md) for system overview.

---

## Token Structure

```
ob.s3.color.neutral.{property}.{contrast_level}.{inversity_variation}
```

**Properties:**
- `bg` - Background colors for surfaces, containers, layouts
- `fg` - Foreground colors for text, icons, UI elements  
- `border` - Border colors for component outlines, dividers
- `shadow` - Shadow colors for depth, elevation

## Contrast Levels

**Background Levels:**
- `contrast_highest` - Primary background (white/dark)
- `contrast_high` - Secondary surface 
- `contrast_medium` - Tertiary surface
- `contrast_low` - Subtle surface
- `contrast_lowest` - Disabled states

**Foreground Levels:**
- `contrast_highest` - Primary text (maximum contrast)
- `contrast_high` - Secondary text
- `contrast_medium` - Tertiary text  
- `contrast_low` - Subtle text
- `contrast_lowest` - Disabled text

**Inversity:** `inversity_normal` (default) | `inversity_flipped` (inverted contrast)

## Component Applications

### Primary Purpose: Content Structure & Organization

**Content Grouping**: Neutral colors serve as the primary semantic tool for organizing and structuring information architecture. Background colors create visual boundaries that help users understand content relationships, hierarchies, and logical groupings without relying on decorative color choices.

**Key Applications:**
- **Information Architecture**: Cards, panels, and sections that group related content
- **Visual Hierarchy**: Different background levels that establish content importance and nesting
- **Content Boundaries**: Clear separation between different types of information
- **Structural Foundation**: The neutral canvas that allows other semantic colors (status, interaction) to communicate effectively

### Use Cases by Contrast Level

#### Page Structure
- **Page backgrounds**: `bg.contrast_highest.inversity_normal`
- **Card/panel backgrounds**: `bg.contrast_high.inversity_normal`
- **Form field backgrounds**: `bg.contrast_medium.inversity_normal`
- **Disabled backgrounds**: `bg.contrast_low.inversity_normal`

#### Typography Hierarchy
- **Primary text**: `fg.contrast_highest.inversity_normal`
- **Secondary text**: `fg.contrast_high.inversity_normal`
- **Supporting text**: `fg.contrast_medium.inversity_normal`
- **Placeholder text**: `fg.contrast_low.inversity_normal`
- **Disabled text**: `fg.contrast_lowest.inversity_normal`

#### Structural Elements
- **Visible borders**: `border.contrast_medium.inversity_normal`
- **Subtle dividers**: `border.contrast_low.inversity_normal`
- **Depth shadows**: `shadow.contrast_low.inversity_normal`

## Neutral Color Architecture

**Note**: Neutral colors skip the s2 emphasis level in the semantic hierarchy, going directly from s1 (lightness) to s3 (compiled semantic). For complete architectural details, see [Semantic Colors Architecture](03-colors-semantic.md).

### Static Utilities
```json
{
  "ob.s3.color.neutral.no_color": {
    "$value": "transparent",
    "$description": "Static value when no color respectively 0% opacity is needed."
  }
}
```
- **Transparent elements**: Hidden borders, transparent backgrounds
- **No-color state**: When complete transparency is required



## Technical Implementation

### File Structure
- `src/lib/themes/03_semantic/color/s1-lightness/light.json` - Light theme neutral colors
- `src/lib/themes/03_semantic/color/s1-lightness/dark.json` - Dark theme neutral colors
- `src/lib/themes/03_semantic/color/s2-emphasis/normal.json` - Normal emphasis neutral colors
- `src/lib/themes/03_semantic/color/s2-emphasis/high.json` - High emphasis neutral colors
- `src/lib/themes/03_semantic/color/s3-semantic/semantic.json` - Complete neutral compilation.



## Accessibility Guidelines

### Contrast Requirements
- Always meet WCAG 2.1 AA contrast requirements for accessibility when pairing fg and bg neutral colors.
- High contrast for paragraph text and primary content
- Medium contrast for secondary information and supporting elements
- Low contrast for disabled states and subtle indicators

### Usage Recommendations
1. **Text on backgrounds**: Use `fg.contrast_highest` for primary text readability
2. **Subtle elements**: Use lower contrast levels for supporting information
3. **Disabled states**: Use `contrast_lowest` to indicate non-interactive elements
4. **Borders and dividers**: Use appropriate contrast levels for visual separation

## Related Documentation

- [Color Tokens Overview](colors-overview.md) - Complete color system introduction
- [Semantic Colors Architecture](colors-03_semantic.md) - Layer system and organization
- [Brand Colors](colors-03_semantic-brand.md) - Brand colors that complement neutral foundations
- [Interaction Colors](colors-03_semantic-interaction.md) - How neutrals support interactive elements
- [Status Colors](colors-03_semantic-status.md) - Status colors that build on neutral foundations
- [Token Consumption Guidelines](../guidelines-token-consumption.md) - Implementation rules

---

*Last updated: August 21, 2025 - Created dedicated neutral colors documentation with theme integration and accessibility guidelines*
