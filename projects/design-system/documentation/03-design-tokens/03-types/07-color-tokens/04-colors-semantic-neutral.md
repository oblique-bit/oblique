# Neutral Colors Documentation

**About this document:** This document defines neutral colors within the Oblique Design System 03_semantic color architecture.

**Scope:** Foundational colors for backgrounds, text, borders, and surfaces that adapt to themes and provide the structural foundation of the interface.

---

## Neutral Color Architecture

Neutral colors provide the foundational color palette for backgrounds, text, borders, and surfaces throughout the design system. They live on different 03_semantic levels s1 and s2 and always come in pair inversity_normal (default) and inversity_flipped (e.g. in Footer).

### Token Structure
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.{property}.{contrast_level}.{inversity_variation}
```

### Properties
- `bg` - Background colors for surfaces, containers, and layouts
- `fg` - Foreground colors for text, icons, and UI elements
- `border` - Border colors for component outlines and dividers
- `shadow` - Shadow colors for depth and elevation

## Contrast Level System

### Background Contrast Levels
- `contrast_highest` - Primary background color (white/dark)
- `contrast_high` - Secondary surface color
- `contrast_medium` - Tertiary surface color
- `contrast_low` - Subtle surface color
- `contrast_lowest` -  subtle background for disabled states

### Foreground Contrast Levels
- `contrast_highest` - Primary text color (maximum contrast)
- `contrast_high` - Secondary text color
- `contrast_medium` - Tertiary text color
- `contrast_low` - Subtle text color
- `contrast_lowest` -  subtle text for disabled states

## Inversity Variations

### Inversity Behavior
- `inversity_normal` - Standard component appearance inheriting the host's theme
- `inversity_flipped` - Component-level inversion for specific variants or entire components

**Implementation Note**: For complete technical details on inversity behavior, theme switching, and 03_semantic layer architecture, see [Semantic Color Architecture](colors-03_semantic.md).

## Usage Examples

### Color Implementation
```json
{
  "neutral": {
    "bg": {
      "contrast_highest": {
        "inversity_normal": "#ffffff",
        "inversity_flipped": "#0f172a"
      },
      "contrast_high": {
        "inversity_normal": "#f1f5f9",
        "inversity_flipped": "#1e293b"
      },
      "contrast_medium": {
        "inversity_normal": "#e2e8f0",
        "inversity_flipped": "#475569"
      },
      "contrast_low": {
        "inversity_normal": "#cbd5e1",
        "inversity_flipped": "#64748b"
      }
    },
    "fg": {
      "contrast_highest": {
        "inversity_normal": "#0f172a",
        "inversity_flipped": "#ffffff"
      },
      "contrast_high": {
        "inversity_normal": "#1e293b",
        "inversity_flipped": "#f1f5f9"
      },
      "contrast_medium": {
        "inversity_normal": "#475569",
        "inversity_flipped": "#e2e8f0"
      },
      "contrast_low": {
        "inversity_normal": "#64748b",
        "inversity_flipped": "#cbd5e1"
      }
    }
  }
}
```

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

### Component Token Consumption

Neutral components that provide structure, content, and typography:

| Component | Token Type | Rationale | Example Tokens |
|-----------|------------|-----------|----------------|
| **Typography** | `neutral.*` | Text content and headings | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **List** | `neutral.*` | Content structure | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **HR (Divider)** | `neutral.*` | Structural separators | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **Popover** | `neutral.*` | Neutral floating containers | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **Dialog** | `neutral.*` | Modal content containers | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |
| **Progress Bar** | `neutral.*` | Neutral progress indicators | `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index` |

## Theme Integration

### Lightness Semantic Level (s1)
- **Light theme**: Higher contrast values are darker, lower contrast values are lighter
- **Dark theme**: Higher contrast values are lighter, lower contrast values are darker
- **Semantic consistency**: Contrast relationships maintain across themes

### Inversity Layer (s2)
- **Normal context**: Standard theme inheritance
- **Flipped context**: Intentional contrast inversion for design emphasis
- **Component-level control**: Individual components can specify inversity behavior

### Static Utilities
```json
{
  "ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index": {
    "$value": "{ob.p.color.red.50.red.50.red.50}",
    "$description": "Static value when no color respectively 0% opacity is needed."
  }
}
```
- **Transparent elements**: Hidden borders, transparent backgrounds
- **No-color state**: When complete transparency is required

## Design Principles

### Foundation Role
- **Structural foundation**: Provides the base for all other color categories
- **Content readability**: Ensures text and content remain accessible
- **Visual hierarchy**: Creates clear information structure through contrast

### Theme Adaptability
- **User preference support**: Adapts to light/dark theme preferences
- **Accessibility compliance**: Maintains WCAG 2.1 AA contrast ratios
- **Consistent experience**: Predictable behavior across theme modes

### Systematic Approach
- **Contrast progression**: Logical contrast level progression for clear hierarchy
- **Semantic naming**: Descriptive contrast levels rather than arbitrary values
- **Flexible implementation**: Works across different component types and contexts

## Technical Implementation

### File Structure
- `src/lib/themes/03_03_semantic/color/s1-lightness/light.json` - Light theme neutral colors
- `src/lib/themes/03_03_semantic/color/s1-lightness/dark.json` - Dark theme neutral colors
- `src/lib/themes/03_03_semantic/color/s2-emphasis/high.json` - High emphasis neutral colors
- `src/lib/themes/03_03_semantic/color/s2-emphasis/low.json` - Low emphasis neutral colors
- `src/lib/themes/03_03_semantic/color/s3-03_semantic/03_semantic.json` - Complete neutral compilation

### Token Resolution Flow
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
│
├─ L1 (Lightness): Resolves based on light/dark theme
├─ L2 (Inversity): Applies normal/flipped contrast
└─ Primitive: References base color values
```

## Accessibility Guidelines

### Contrast Requirements
- Always meet WCAG 2.1 AA contrast requirements for accessibility
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
