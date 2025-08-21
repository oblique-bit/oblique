# Neutral Colors Documentation

**About this document:** This document defines neutral colors within the Oblique Design System semantic color architecture.

**Scope:** Foundational colors for backgrounds, text, borders, and surfaces that adapt to themes and provide the structural foundation of the interface.

---

## Neutral Color Architecture

Neutral colors provide the foundational color palette for backgrounds, text, borders, and surfaces throughout the design system. They live on different semantic levels s1 and s2 and always come in pair inversity-normal (default) and inversity-flipped (e.g. in Footer).

### Token Structure
```
ob.s.color.neutral.{property}.{contrast-level}.{inversity-variation}
```

### Properties
- `bg` - Background colors for surfaces, containers, and layouts
- `fg` - Foreground colors for text, icons, and UI elements
- `border` - Border colors for component outlines and dividers
- `shadow` - Shadow colors for depth and elevation

## Contrast Level System

### Background Contrast Levels
- `contrast-highest` - Primary background color (white/dark)
- `contrast-high` - Secondary surface color
- `contrast-medium` - Tertiary surface color
- `contrast-low` - Subtle surface color
- `contrast-lowest` - Very subtle background for disabled states

### Foreground Contrast Levels
- `contrast-highest` - Primary text color (maximum contrast)
- `contrast-high` - Secondary text color
- `contrast-medium` - Tertiary text color
- `contrast-low` - Subtle text color
- `contrast-lowest` - Very subtle text for disabled states

## Inversity Variations

### Inversity Behavior
- `inversity-normal` - Standard component appearance inheriting the host's theme
- `inversity-flipped` - Component-level inversion for specific variants or entire components

**Implementation Note**: For complete technical details on inversity behavior, theme switching, and semantic layer architecture, see [Semantic Color Architecture](colors-semantic.md).

## Usage Examples

### Color Implementation
```json
{
  "neutral": {
    "bg": {
      "contrast-highest": {
        "inversity-normal": "#ffffff",
        "inversity-flipped": "#0f172a"
      },
      "contrast-high": {
        "inversity-normal": "#f1f5f9",
        "inversity-flipped": "#1e293b"
      },
      "contrast-medium": {
        "inversity-normal": "#e2e8f0",
        "inversity-flipped": "#475569"
      },
      "contrast-low": {
        "inversity-normal": "#cbd5e1",
        "inversity-flipped": "#64748b"
      }
    },
    "fg": {
      "contrast-highest": {
        "inversity-normal": "#0f172a",
        "inversity-flipped": "#ffffff"
      },
      "contrast-high": {
        "inversity-normal": "#1e293b",
        "inversity-flipped": "#f1f5f9"
      },
      "contrast-medium": {
        "inversity-normal": "#475569",
        "inversity-flipped": "#e2e8f0"
      },
      "contrast-low": {
        "inversity-normal": "#64748b",
        "inversity-flipped": "#cbd5e1"
      }
    }
  }
}
```

## Component Applications

### Use Cases by Contrast Level

#### Page Structure
- **Page backgrounds**: `bg.contrast-highest.inversity-normal`
- **Card/panel backgrounds**: `bg.contrast-high.inversity-normal`
- **Form field backgrounds**: `bg.contrast-medium.inversity-normal`
- **Disabled backgrounds**: `bg.contrast-low.inversity-normal`

#### Typography Hierarchy
- **Primary text**: `fg.contrast-highest.inversity-normal`
- **Secondary text**: `fg.contrast-high.inversity-normal`
- **Supporting text**: `fg.contrast-medium.inversity-normal`
- **Placeholder text**: `fg.contrast-low.inversity-normal`
- **Disabled text**: `fg.contrast-lowest.inversity-normal`

#### Structural Elements
- **Visible borders**: `border.contrast-medium.inversity-normal`
- **Subtle dividers**: `border.contrast-low.inversity-normal`
- **Depth shadows**: `shadow.contrast-low.inversity-normal`

### Component Token Consumption

Neutral components that provide structure, content, and typography:

| Component | Token Type | Rationale | Example Tokens |
|-----------|------------|-----------|----------------|
| **Typography** | `neutral.*` | Text content and headings | `ob.s.color.neutral.fg.contrast-highest.inversity-normal` |
| **List** | `neutral.*` | Content structure | `ob.s.color.neutral.fg.contrast-medium.inversity-normal` |
| **HR (Divider)** | `neutral.*` | Structural separators | `ob.s.color.neutral.border.contrast-medium.inversity-normal` |
| **Popover** | `neutral.*` | Neutral floating containers | `ob.s.color.neutral.bg.contrast-highest.inversity-normal` |
| **Dialog** | `neutral.*` | Modal content containers | `ob.s.color.neutral.bg.contrast-high.inversity-normal` |
| **Progress Bar** | `neutral.*` | Neutral progress indicators | `ob.s.color.neutral.bg.contrast-low.inversity-normal` |

## Theme Integration

### Lightness Layer (s1)
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
  "ob.s.color.neutral.no-color": {
    "$value": "{ob.p.color.basic.transparent}",
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
- `src/lib/themes/semantic/color/s1-lightness/light.json` - Light theme neutral colors
- `src/lib/themes/semantic/color/s1-lightness/dark.json` - Dark theme neutral colors
- `src/lib/themes/semantic/color/s2-inversity/` - Inverse theme neutrals
- `src/lib/themes/semantic/color/s0-static.json` - Static neutral utilities (no-color)

### Token Resolution Flow
```
ob.s2.color.neutral.fg.contrast-high.inversity-normal
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
1. **Text on backgrounds**: Use `fg.contrast-highest` for primary text readability
2. **Subtle elements**: Use lower contrast levels for supporting information
3. **Disabled states**: Use `contrast-lowest` to indicate non-interactive elements
4. **Borders and dividers**: Use appropriate contrast levels for visual separation

## Related Documentation

- [Color Tokens Overview](colors.md) - Complete color system introduction
- [Semantic Colors Architecture](colors-semantic.md) - Layer system and organization
- [Interaction Colors](colors-semantic-interaction.md) - How neutrals support interactive elements
- [Status Colors](colors-semantic-status.md) - Status colors that build on neutral foundations
- [Token Consumption Guidelines](../guidelines-token-consumption.md) - Implementation rules

---

*Last updated: August 21, 2025 - Created dedicated neutral colors documentation with theme integration and accessibility guidelines*
