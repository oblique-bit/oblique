# Color Tokens Documentation

This document provides comprehensive information about all color tokens in the Oblique Design System, with a focus on semantic colors including status colors.

---

## Color Token Architecture

### Structure
```
semantic.color.category.variation.property.contrast-level
```

### Categories
- **Neutral Colors** - Base colors for backgrounds, text, and borders
- **Status Colors** - Communicating state and feedback
- **Interaction Colors** - Hover, focus, active, and disabled states
- **Emphasis Colors** - Highlighting and de-emphasizing interactive components such as buttons and links. 
- **Inversity Colors** - Light/dark theme adaptations


---

## Status Colors

Status colors communicate system state, user feedback, and contextual information. They have been redesigned for government web applications with clearer, more accessible naming.

### Status Color System

| Status | Description | Components | Legacy Name | Inspiration | Change Status |
|--------|-------------|------------|-------------|-------------|---------------|
| **info** | Informational | Infobox, Badge | — | GOV.UK, USWDS | Unchanged |
| **resolved** | Completed/closed | Badge, Pill | success | GitHub, Jira | Renamed (from success) |
| **critical** | Urgent/alert/system failure | Badge, Infobox | error | Material, Atlassian | Renamed (from error) |
| **attention** | Needs review/caution | Infobox, Badge | warning | USWDS, Atlassian | Renamed (from warning) |
| **pending** | Awaiting action | Pill, Badge | — | Jira, GitHub | Added |
| **confirmed** | Verified/approved | Pill, Badge | — | GitHub, Atlassian | Added |
| **progress** | In progress, loading | Pill, Badge | — | Jira, GitHub | Added |
| **scheduled** | Scheduled/future | Pill | — | Jira, GitHub | Added |
| **waiting** | Waiting/queued | Pill | — | Jira, GitHub | Added |
| **fatal** | Flooding, landslides, earthquakes | Infobox | — | swiss.github.io | Added |
| **closed** | Closed/archived | Pill | — | GitHub | Added |
| **disabled** | Disabled/inactive | Pill | — | Material | Added |

### Token Structure
```
ob.s.color.status.{status-name}.{property}.{contrast-level}
```

#### Properties
- `fg` - Foreground/text color
- `bg` - Background color

#### Contrast Levels
- `contrast-high` - Maximum contrast for critical information
- `contrast-medium` - Standard contrast for regular content
- `contrast-low` - Subtle contrast for secondary information

#### Theme Variations
- `contrast-{level}-default` - Standard theme
- `contrast-{level}-inverse` - Inverse theme
- `contrast-{level}-inverse-alpha` - Inverse with transparency

### Examples
```json
{
  "critical": {
    "fg": {
      "contrast-high": "#dc2626",
      "contrast-medium": "#ef4444",
      "contrast-low": "#f87171"
    },
    "bg": {
      "contrast-high": "#7f1d1d",
      "contrast-medium": "#dc2626",
      "contrast-low": "#fee2e2"
    }
  }
}
```

---

## Emphasis Colors

Emphasis colors control visual hierarchy and content importance for interactive components such as buttons and links. They provide different levels of visual emphasis to guide user attention and establish clear interaction patterns.

### Emphasis Levels
- `emphasis-medium` - Standard emphasis for primary interactive elements
- `emphasis-low` - Reduced emphasis for secondary interactive elements

### Token Structure
```
ob.s.color.emphasis.{level}.{property}.{contrast-level}
```

### Primary Use Cases
- **Buttons**: Different emphasis levels for primary, secondary, and tertiary button types
- **Links**: Emphasis variations for different link importance and context
- **Interactive Elements**: Call-to-action elements, navigation items, and actionable components

### Implementation Notes
Emphasis colors primarily reference `neutral` and `interaction` color tokens to ensure consistency with the overall color system while providing clear visual hierarchy for interactive elements.

---

## Neutral Colors

Neutral colors provide the foundational color palette for backgrounds, text, borders, and surfaces throughout the design system. They ensure consistent visual hierarchy and readability across all components.

### Token Structure
```
ob.s.color.neutral.{property}.{contrast-level}-{theme}
```

### Properties
- `bg` - Background colors for surfaces, containers, and layouts
- `fg` - Foreground colors for text, icons, and UI elements
- `border` - Border colors for component outlines and dividers
- `shadow` - Shadow colors for depth and elevation

### Contrast Levels (Background)
- `contrast-highest` - Primary background color (white/dark)
- `contrast-high` - Secondary surface color
- `contrast-medium` - Tertiary surface color
- `contrast-low` - Subtle surface color
- `contrast-lowest` - Very subtle background for disabled states

### Contrast Levels (Foreground)
- `contrast-highest` - Primary text color (maximum contrast)
- `contrast-high` - Secondary text color
- `contrast-medium` - Tertiary text color
- `contrast-low` - Subtle text color
- `contrast-lowest` - Very subtle text for disabled states

### Theme Variations
- `-default` - Standard light theme
- `-inverse` - Dark theme or inverted contexts

### Usage Examples
```json
{
  "neutral": {
    "bg": {
      "contrast-highest-default": "#ffffff",
      "contrast-high-default": "#f1f5f9",
      "contrast-medium-default": "#e2e8f0",
      "contrast-low-default": "#cbd5e1"
    },
    "fg": {
      "contrast-highest-default": "#0f172a",
      "contrast-high-default": "#1e293b",
      "contrast-medium-default": "#475569",
      "contrast-low-default": "#64748b"
    }
  }
}
```

### Use Cases
- **Page backgrounds**: `contrast-highest-default`
- **Card/panel backgrounds**: `contrast-high-default`
- **Form field backgrounds**: `contrast-medium-default`
- **Disabled backgrounds**: `contrast-lowest-default`
- **Primary text**: `contrast-highest-default`
- **Secondary text**: `contrast-high-default`
- **Placeholder text**: `contrast-low-default`
- **Disabled text**: `contrast-lowest-default`

---

## Interaction Colors

Interaction colors communicate interactive states and user actions. They provide visual feedback for hover, focus, active, visited, and disabled states across all interactive components.

### Token Structure
```
ob.s.color.interaction.{emphasis-level}.{element-type}.{contrast-level}-{theme}
```

### Emphasis Levels
- `emphasis-default` - Standard interaction emphasis
- `emphasis-high` - High emphasis interactions (primary actions)
- `emphasis-low` - Low emphasis interactions (secondary actions)

### Element Types
- `bg-base` - Background colors for interactive elements
- `fg-base` - Foreground colors for interactive text/icons
- `fg-visited` - Colors for visited links
- `fg-disabled` - Colors for disabled interactive elements
- `fg-hover` - Colors for hover states
- `fg-focus` - Colors for focus states
- `fg-active` - Colors for active/pressed states

### Contrast Levels
- `contrast-high` - High contrast for primary interactions
- `contrast-medium` - Medium contrast for secondary interactions
- `contrast-low` - Low contrast for subtle interactions

### Theme Variations
- `-default` - Standard light theme
- `-inverse` - Dark theme or inverted contexts

### Usage Examples
```json
{
  "interaction": {
    "emphasis-default": {
      "bg-base": {
        "contrast-high-default": "#ffffff",
        "contrast-medium-default": "#e2e8f0",
        "contrast-low-default": "#cbd5e1"
      },
      "fg-base": {
        "contrast-high-default": "#1e40af",
        "contrast-medium-default": "#3b82f6",
        "contrast-low-default": "#60a5fa"
      },
      "fg-visited": {
        "contrast-high-default": "#581c87",
        "contrast-medium-default": "#7c3aed",
        "contrast-low-default": "#a855f7"
      },
      "fg-disabled": {
        "contrast-low-default": "#9ca3af"
      }
    }
  }
}
```

### Component Applications
- **Buttons**: `bg-base`, `fg-base` for different button types
- **Links**: `fg-base` for default, `fg-visited` for visited, `fg-hover` for hover
- **Form controls**: `bg-base` for input backgrounds, `fg-base` for text
- **Navigation**: `fg-base` for nav items, `bg-base` for active states
- **Cards**: `bg-base` for interactive card backgrounds

### State Guidelines
- **Default**: Use `fg-base` or `bg-base` with appropriate contrast
- **Hover**: Typically uses higher contrast or different hue
- **Focus**: Should have clear visual distinction (often with outline)
- **Active/Pressed**: Usually darker or more saturated
- **Visited**: Use `fg-visited` for visited links
- **Disabled**: Use `fg-disabled` or `bg-disabled` with reduced contrast

---

## Color Token Hierarchy

### Token Relationships
The color token system follows a hierarchical structure where semantic tokens reference neutral and interaction colors for consistency:

```
Primitive Colors (ob.p.colors.*)
    ↓
Semantic Colors (ob.s.color.*)
    ↓
Component Colors (ob.c.color.*)
    ↓
Implementation
```

### Cross-References
- **Emphasis tokens** reference `neutral` and `interaction` colors
- **Status tokens** use dedicated color values but may reference neutrals for backgrounds
- **Component tokens** combine status, emphasis, neutral, and interaction colors

### Color Dependencies
```
ob.s.color.emphasis.muted → ob.s.color.neutral.fg.contrast-*
ob.s.color.emphasis.default → ob.s.color.interaction.emphasis-default.*
ob.s.color.status.* → Direct primitive color references
ob.s.color.neutral.* → Direct primitive color references
ob.s.color.interaction.* → Direct primitive color references
```

### Consistency Rules
1. Always use semantic tokens in components, never primitive colors directly
2. Status colors should be used for semantic meaning, not decoration
3. Neutral colors provide the foundation for all non-semantic coloring
4. Interaction colors handle all user interaction feedback
5. Emphasis colors control visual hierarchy and importance

---

## Implementation Guidelines

### 1. Status Color Usage
- **Critical**: Use for urgent alerts and system failures
- **Resolved**: Use for completed and closed states
- **Attention**: Use for items needing review or caution
- **Info**: Use for informational content
- **Pending**: Use for items awaiting action
- **Confirmed**: Use for verified/approved states
- **Progress**: Use for in-progress and loading states
- **Scheduled**: Use for scheduled/future items
- **Waiting**: Use for waiting/queued states
- **Fatal**: Reserved for natural disasters and emergencies
- **Closed**: Use for closed/archived items
- **Disabled**: Use for disabled/inactive states

### 2. Emphasis Color Usage
- **Primary Interactions**: Use `emphasis-medium` for main calls-to-action (primary buttons, important links)
- **Secondary Interactions**: Use `emphasis-low` for secondary actions (secondary buttons, supporting links)
- **Interactive Components**: Apply emphasis colors to buttons, links, and other actionable elements
- **Visual Hierarchy**: Use different emphasis levels to establish clear interaction priorities

### 3. Neutral Color Usage
- **Backgrounds**: Use highest contrast for primary surfaces, progressively lower contrast for nested elements
- **Text**: Use highest contrast for primary text, lower contrast for secondary/helper text
- **Borders**: Use medium contrast for visible borders, low contrast for subtle dividers
- **Shadows**: Use neutral shadow colors for consistent depth

### 4. Interaction Color Usage
- **Primary Actions**: Use `emphasis-default` with high contrast
- **Secondary Actions**: Use `emphasis-default` with medium contrast
- **Subtle Actions**: Use `emphasis-default` with low contrast
- **Links**: Always use `fg-base` for default, `fg-visited` for visited states
- **Disabled**: Always use `fg-disabled` for inactive interactive elements

### 5. Contrast Requirements
- Always use appropriate contrast levels for accessibility
- High contrast for critical information and primary actions
- Medium contrast for standard content and secondary actions
- Low contrast for subtle/secondary information

### 6. Theme Consistency
- Use `-default` for standard themes
- Use `-inverse` for dark themes or inverted contexts
- Use `-inverse-alpha` for semi-transparent overlays

### 7. Component Mapping
- **Infobox**: critical, attention, info, fatal (status colors)
- **Badge**: critical, resolved, attention, info, pending (status colors)
- **Pill**: critical, resolved, attention, info, pending (status colors)
- **Spinner**: progress (status colors)
- **Buttons**: emphasis colors (medium, low) with interaction states
- **Links**: emphasis colors combined with interaction colors for base and visited states
- **Form Controls**: neutral backgrounds with interaction states and emphasis for labels/actions

---

## Color Token Files

### Status Colors
- `src/lib/themes/semantics/colors/static.json` - Base status color definitions
- `src/lib/themes/semantics/colors/lightness/` - Theme-specific variations
- `src/lib/themes/semantics/colors/inversity/` - Inverse theme colors

### Emphasis Colors
- `src/lib/themes/semantics/colors/emphasis/` - Emphasis level definitions

### Neutral Colors
- `src/lib/themes/semantics/colors/lightness/light.json` - Light theme neutral colors
- `src/lib/themes/semantics/colors/lightness/dark.json` - Dark theme neutral colors
- `src/lib/themes/semantics/colors/inversity/` - Inverse theme neutrals

### Interaction Colors
- `src/lib/themes/semantics/colors/lightness/light.json` - Light theme interaction colors
- `src/lib/themes/semantics/colors/lightness/dark.json` - Dark theme interaction colors
- `src/lib/themes/semantics/colors/static.json` - Static interaction indicators

### Theme Colors
- `src/lib/themes/global/themes-scoped/` - Theme-scoped color applications

---

## Migration Notes

### Legacy Status Names
The following status names have been updated for clarity:
- `error` → `critical`
- `success` → `resolved`  
- `warning` → `attention`

### New Status Types
- `pending` - Added for workflow systems
- `fatal` - Added for emergency communications
- `progress` - Added for loading states

### Component Updates
All components have been updated to use the new status color tokens with appropriate contrast levels and theme variations.

---

## Related Documentation

- [Design Token Naming](./design-token-naming.md) - Complete naming strategy
- [Theming](./theming.md) - Theme implementation
- [Responsiveness](./responsiveness.md) - Responsive design guidelines

---

## Icons Reference

While this document focuses on color tokens, status colors are often paired with icons:

- **Critical**: Error/alert icons
- **Resolved**: Checkmark/success icons
- **Attention**: Warning/caution icons
- **Info**: Information icons
- **Pending**: Clock/loading icons
- **Fatal**: Emergency/alert icons

Icon definitions are maintained separately in the icon system but should align with status color usage.
