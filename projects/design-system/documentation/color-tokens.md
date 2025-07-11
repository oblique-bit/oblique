# Color Tokens Documentation

This document covers all color tokens in the Oblique Design System, with a focus on semantic colors including status colors.

---

## Color Token Architecture

### Structure
```
semantic.color.category.variation.property.contrast-level
```

### Main Categories
- **Neutral Colors** - Base colors for backgrounds, text, and borders
- **Status Colors** - Communicating state and feedback
- **Interaction Colors** - Interactive elements with emphasis levels (high/low) and states (hover, focus, active, disabled)

### Theme Levels
Inversity is a theme-level concept that applies across all semantic color categories. The compound inversity suffixes `inversity-normal` and `inversity-flipped` at the end of token names should not be confused with the semantic color themes stored under `src/lib/themes/semantic/color/l2-inversity/`, although they share the same concept and naming.

Components can have baked-in inversity set via global tokens. For example, the `fatal` variant of the `infobox` component is set to flipped inversity:
```
ob.g.component-configuration.infobox.button.fatal.theme.inversity: {ob.g.theme-configuration.inversity.flipped}
```


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
- `contrast-high` - Maximum contrast 
- `contrast-medium` - Standard contrast 
- `contrast-low` - Subtle contrast 

#### Theme Variations
- `contrast-{level}.inversity-normal` - Standard theme
- `contrast-{level}.inversity-flipped` - Inverse theme


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
- `emphasis-high` - Default emphasis for primary interactive elements
- `emphasis-low` - Reduced emphasis for secondary interactive elements

### Token Structure
```
ob.s.color.emphasis.{level}.{property}.{contrast-level}
```

### Primary Use Cases
- **Buttons**: Different emphasis levels for primary, secondary, and tertiary button types
- **Links**: Emphasis variations for different link importance and context
- **Navigation tabs**: Navigation items in Header

### Implementation Notes
Emphasis colors primarily reference `neutral` and `interaction` color tokens from l2

---

## Neutral Colors

Neutral colors provide the foundational color palette for backgrounds, text, borders, and surfaces throughout the design system. The live on different semantic levels l1 and l2 and always come in pair inversity-normal (default) and inversity-flipped (e.g. in Footer)

### Token Structure
```
ob.s.color.neutral.{property}.{contrast-level}-{invesity-variation}
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

### Inversity Variations
- `inversity-normal` - Standard theme inheriting the host's theme
- `inversity-flipped` - Flipped/inverted theme

**Note**: These compound suffixes appear at the end of token names and represent theme-level variations. They are distinct from but related to the semantic color themes stored under `src/lib/themes/semantic/color/l2-inversity/`.

### Usage Examples
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

### Use Cases
- **Page backgrounds**: `contrast-highest.inversity-normal`
- **Card/panel backgrounds**: `contrast-high.inversity-normal`
- **Form field backgrounds**: `contrast-medium.inversity-normal`
- **Disabled backgrounds**: `contrast-low.inversity-normal`
- **Primary text**: `contrast-highest.inversity-normal`
- **Secondary text**: `contrast-high.inversity-normal`
- **Placeholder text**: `contrast-low.inversity-normal`
- **Disabled text**: `contrast-low.inversity-normal`

---

## Interaction Colors

Interaction colors communicate interactive states and user actions. They provide visual feedback for hover, focus, active, visited, and disabled states across all interactive components.

### Token Structure
```
ob.s.color.interaction.{emphasis-level}.{element-type}.{contrast-level}-{theme}
```

### Emphasis Levels
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

### Inversity Variations
- `inversity-normal` - Standard theme
- `inversity-flipped` - Inverted theme contexts

### Usage Examples
```json
{
  "interaction": {
    "emphasis-high": {
      "bg-base": {
        "contrast-high": {
          "inversity-normal": "#ffffff",
          "inversity-flipped": "#0f172a"
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
      "fg-base": {
        "contrast-high": {
          "inversity-normal": "#1e40af",
          "inversity-flipped": "#60a5fa"
        },
        "contrast-medium": {
          "inversity-normal": "#3b82f6",
          "inversity-flipped": "#93c5fd"
        },
        "contrast-low": {
          "inversity-normal": "#60a5fa",
          "inversity-flipped": "#dbeafe"
        }
      },
      "fg-visited": {
        "contrast-high": {
          "inversity-normal": "#581c87",
          "inversity-flipped": "#a855f7"
        },
        "contrast-medium": {
          "inversity-normal": "#7c3aed",
          "inversity-flipped": "#c084fc"
        },
        "contrast-low": {
          "inversity-normal": "#a855f7",
          "inversity-flipped": "#e9d5ff"
        }
      },
      "fg-disabled": {
        "contrast-low": {
          "inversity-normal": "#9ca3af",
          "inversity-flipped": "#6b7280"
        }
      }
    }
  }
}
```

### Component Applications
- **Buttons**: `bg-base`, `fg-base` for different button  and their interaction states.
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
- **Emphasis tokens** reference `interaction` colors
- **Status tokens** use dedicated color values but may reference neutrals for backgrounds
- **Component tokens** combine status, emphasis, neutral, and interaction colors

### Color Dependencies
```
ob.s.color.emphasis.low → ob.s.color.neutral.fg.contrast-*
ob.s.color.emphasis.high → ob.s.color.interaction.emphasis-high.*
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
## 1.1 Reserved
- **Critical**: Use for urgent alerts and system failures
- **Resolved**: Use for completed and closed states
- **Attention**: Use for items needing review or caution
- **Info**: Use for informational content

## 1.2 Optional
- **Pending**: Use for items awaiting action
- **Confirmed**: Use for verified/approved states
- **Progress**: Use for in-progress and loading states
- **Scheduled**: Use for scheduled/future items
- **Waiting**: Use for waiting/queued states
- **Closed**: Use for closed/archived items
- **Disabled**: Use for disabled/inactive states

## 1.3 Special
- **Fatal**: Reserved for very important notifications, for example when the population is facing a danger. More https://swiss.github.io/designsystem/?path=/docs/components-alertbanner--docs

### 2. Emphasis Color Usage
- **Primary Interactions**: Use `emphasis-high` for main calls-to-action (primary buttons, important links)
- **Secondary Interactions**: Use `emphasis-low` for secondary actions (secondary buttons, supporting links)
- **Interactive Components**: Apply emphasis colors to buttons, links, and other actionable elements
- **Visual Hierarchy**: Use different emphasis levels to establish clear interaction priorities

### 3. Neutral Color Usage
- **Backgrounds**: Use highest contrast for primary surfaces, progressively lower contrast for nested elements
- **Text**: Use highest contrast for primary text, lower contrast for secondary/helper text
- **Borders**: Use medium contrast for visible borders, low contrast for subtle dividers
- **Shadows**: Use neutral shadow colors for consistent depth

### 4. Interaction Color Usage
- **Mandatory level l3**: Always use token from ob.s.color.l3.interaction.state with predefined interaction states for buttons and links.
- **Foreground**: Tokens from ob.s.color.l3.interaction.state.fg will cover most of use-cases, buttons and link.
- **Background**: Tokens from ob.s.color.l3.interaction.state.bg mostly use for buttons background.

### 5. Contrast Requirements
- Always meet WCAG 2.1 AA contrast requirements for accessibility
- High contrast for parargraph text.
- Low contrast for disabled
- Avoid maximum contrast that may compromise usability or destroys color saturation in status colors

### 6. Theme Consistency
- Use `-normal` for standard themes
- Use `-flipped` for dark themes or inverted contexts


### 7. Component Mapping
- **Infobox**: reserved status colors: critical, attention, info, resolved + fatal (special requirement), level l2
- **Badge**: reserved status colors: critical, resolved, attention, info, level l2
- **Pill**: reserved status colors (critical, resolved, attention, info) + optional status colors (pending, confirmed, progress, scjeduled, waiting)
- **Spinner**: progress from status colors level l2.
- **Buttons**: interaction colors from the emphasis level l3. 
- **Links**: emphasis colors combined with interaction colors for base and visited states
- **Form Controls**: neutral backgrounds with interaction states and emphasis for labels/actions

---

## Component Token Consumption Guidelines

> **📋 For token consumption rules across ALL token types (color, typography, spacing), see: [Token Consumption Guidelines](./token-consumption-guidelines.md)**

These guidelines define which semantic color token types specific component categories should consume. Following these rules ensures semantic consistency and maintains proper token architecture.

> **Documentation Rule**: Only document components that actually exist in our design system. Do not add hypothetical or planned components to these guidelines.

### Component Classification by Token Consumption

#### Status-Based Components
**Components that display status, state, or semantic meaning**

| Component | Token Type | Rationale | Example Tokens |
|-----------|------------|-----------|----------------|
| **Badge** | `status.*` | Represents semantic status states | `ob.s.color.status.info.fg.contrast-highest.inversity-flipped` |
| **Infobox** | `status.*` | Communicates status information | `ob.s.color.status.critical.fg.contrast-high.inversity-normal` |
| **Pill** | `status.*` | Status indicators and tags | `ob.s.color.status.resolved.fg.contrast-medium.inversity-normal` |
| **Tooltip** | `status.*` | Contextual status information | `ob.s.color.status.info.bg.contrast-high.inversity-normal` |

#### Interactive Components
**Components that respond to user interaction**

| Component | Token Type | Rationale | Example Tokens |
|-----------|------------|-----------|----------------|
| **Button** | `interaction.*` | Interactive elements with states | `ob.s.color.interaction.emphasis-high.fg-base.contrast-high.inversity-normal` |
| **Link** | `interaction.*` | Interactive navigation elements | `ob.s.color.interaction.emphasis-high.fg-hover.contrast-high.inversity-normal` |
| **Tag** | `interaction.*` | Interactive filter/selection elements | `ob.s.color.interaction.emphasis-low.bg-base.contrast-medium.inversity-normal` |
| **Stepper** | `interaction.*` | Interactive navigation progress | `ob.s.color.interaction.emphasis-high.fg-focus.contrast-high.inversity-normal` |
| **Slider** | `interaction.*` | Interactive form controls | `ob.s.color.interaction.emphasis-high.bg-base.contrast-medium.inversity-normal` |

#### Neutral Components  
**Components that provide structure, content, and typography**

| Component | Token Type | Rationale | Example Tokens |
|-----------|------------|-----------|----------------|
| **Typography** | `neutral.*` | Text content and headings | `ob.s.color.neutral.fg.contrast-highest.inversity-normal` |
| **List** | `neutral.*` | Content structure | `ob.s.color.neutral.fg.contrast-medium.inversity-normal` |
| **HR (Divider)** | `neutral.*` | Structural separators | `ob.s.color.neutral.border.contrast-medium.inversity-normal` |
| **Popover** | `neutral.*` | Neutral floating containers | `ob.s.color.neutral.bg.contrast-highest.inversity-normal` |
| **Dialog** | `neutral.*` | Modal content containers | `ob.s.color.neutral.bg.contrast-high.inversity-normal` |
| **Progress Bar** | `neutral.*` | Neutral progress indicators | `ob.s.color.neutral.bg.contrast-low.inversity-normal` |

**Note**: Card and Layout components exist but have not been analyzed for token consumption patterns yet.

### Implementation Rules

#### ✅ Correct Token Usage

```json
// Badge (Status-based)
"ob.c.badge.color.bg.info.enabled": {
  "$value": "{ob.s.color.l2.status.info.bg.contrast-low.inversity-flipped}"
}
"ob.c.badge.color.fg.info.enabled": {
  "$value": "{ob.s.color.l2.status.info.fg.contrast-highest.inversity-flipped}"
}

// Button (Interactive)  
"ob.h.button.color.fg.primary.hover": {
  "$value": "{ob.s.color.l3.interaction.state.fg.hover.inversity-normal}"
}

// Typography (Neutral)
"ob.s.typography.color.text.default": {
  "$value": "{ob.s.color.l2.neutral.fg.contrast-high.inversity-normal}"
}
```

#### ❌ Incorrect Token Usage

```json
// Badge consuming interaction tokens (WRONG)
"ob.c.badge.color.fg.info.enabled": {
  "$value": "{ob.s.color.l3.interaction.state.fg.enabled.inversity-normal}"
}

// Button consuming status tokens (WRONG)
"ob.h.button.color.bg.primary.enabled": {
  "$value": "{ob.s.color.status.info.bg.contrast-low}"
}


```

### Special Cases

#### Disabled States
- **Status components**: Use `status.disabled.*` tokens exclusively
- **Interactive components**: Use `interaction.*-disabled.*` tokens  
- **Neutral components**: Use `neutral.*` tokens with appropriate contrast levels

#### Inverse/Theme Variations
- All component types can consume their respective token types with theme suffixes
- Example: `status.info.bg.contrast-low.inversity-flipped`

### Token Reference Hierarchy

```
Component Tokens → Semantic Tokens → Theme Layer → Primitives
     ↓                   ↓              ↓            ↓
ob.c.badge.*  →  ob.s.color.status.*    →  inversity/*  →  ob.p.color.*
ob.h.button.* →  ob.s.color.interaction.* → emphasis/*   →  ob.p.color.*
ob.s.typography.* →  ob.s.color.neutral.*  →  lightness/*  →  ob.p.color.*
```

### Documentation Guidelines

1. **Only Document Existing Components**: Do not add hypothetical or planned components
2. **Verify Token Existence**: Ensure all referenced tokens actually exist in the semantic layer
3. **Test Token References**: Validate that token chains resolve correctly
4. **Update When Components Change**: Keep guidelines current with actual implementation

### Validation Checklist

When creating or reviewing component tokens:

- [ ] **Semantic Alignment**: Does the component's purpose match the token type?
- [ ] **Consistency**: Do similar components use the same token type?
- [ ] **States**: Are all states (enabled, disabled, hover, etc.) handled correctly?
- [ ] **Themes**: Do theme variations work across all token references?
- [ ] **Hierarchy**: Does the reference chain follow the proper token hierarchy?

### Migration Notes

When refactoring existing components:
1. **Identify component purpose** (status-based, interactive, or neutral)
2. **Map current tokens** to appropriate semantic types
3. **Test theme switching** to ensure proper inversity support
4. **Validate contrast ratios** meet WCAG 2.1 AA accessibility requirements
5. **Update documentation** to reflect new token usage

---

## Color Token Files

### Neutral Colors
- `src/lib/themes/semantics/colors/lightness/light.json` - Light theme neutral colors
- `src/lib/themes/semantics/colors/lightness/dark.json` - Dark theme neutral colors
- `src/lib/themes/semantics/colors/inversity/` - Inverse theme neutrals

### Status Colors
- `src/lib/themes/semantics/colors/static.json` - Base status color definitions
- `src/lib/themes/semantics/colors/lightness/` - Theme-specific variations
- `src/lib/themes/semantics/colors/inversity/` - Inverse theme colors


### Interaction Colors
- `src/lib/themes/semantics/colors/lightness/light.json` - Light theme interaction colors
- `src/lib/themes/semantics/colors/lightness/dark.json` - Dark theme interaction colors
- `src/lib/themes/semantics/colors/static.json` - Static interaction indicators

### Interaction / Emphasis Colors
- `src/lib/themes/semantics/colors/emphasis/` - Emphasis level definitions

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

---

*Last updated: July 11, 2025 - Corrected accessibility standards from AAA to WCAG 2.1 AA with proper context about usability considerations*

### contrast-highest Usage

The `contrast-highest` contrast level provides maximum accessibility and readability for text and UI elements. This contrast level should be used for:

**Backgrounds (`bg`):**
- Critical UI elements that need maximum visibility
- Text containers requiring highest contrast
- Accessible overlays and modals
- Emergency or alert backgrounds

**Foregrounds (`fg`):**
- Text that must meet WCAG 2.1 AA accessibility standards
- Text on complex or image backgrounds
- Small text that needs maximum legibility
- Error, warning, or critical status text

**Note on Accessibility Standards:**
This design system targets WCAG 2.1 AA contrast requirements. While AAA contrast is numerically higher, it may compromise usability in certain contexts:
- Excessive contrast can appear too sharp and strain users' eyes
- Status colors at extreme contrast levels (900 or 50) may lose saturation and fail to be properly identified
- Loss of color identity can increase cognitive load for users

AAA contrast should only be used when it enhances rather than compromises usability.

**Reference Pattern:**
- In light theme: `inversity-normal` references `{ob.p.color.basic.white}` (white primitive) for backgrounds and `{ob.p.color.cobalt.900}` (darkest cobalt) for text
- In light theme: `inversity-flipped` references `{ob.p.color.cobalt.900}` (darkest cobalt) for backgrounds and `{ob.p.color.basic.white}` (white primitive) for text
- In dark theme: `inversity-normal` references `{ob.p.color.cobalt.900}` (darkest cobalt) for backgrounds and `{ob.p.color.basic.white}` (white primitive) for text  
- In dark theme: `inversity-flipped` references `{ob.p.color.basic.white}` (white primitive) for backgrounds and `{ob.p.color.cobalt.900}` (darkest cobalt) for text

This ensures maximum contrast between foreground and background elements for optimal accessibility.

---

## Interaction Color Rationale

### Emphasis High (`ob.s.color.interaction.emphasis-high`)

These are the standard colors for buttons and text links. It is primarily a saturated color. Since the beginning of the internet and also as standard of HTML, there are high saturated colors for hyperlinks, established to be easily identified in paragraph text that is mostly monochromatic.

The design system of federal chancellery ([swiss.github.io/designsystem](https://swiss.github.io/designsystem/)) is used for federal websites, marketing and documentation material. In Oblique, the design system for federal applications, we have - as business and corporate design requirement - to align visually with the federal design system, as long as this is not conflicting with accessibility (AX) and user experience (UX) standards, that are crucial for the success of web applications. Meeting UX and especially AX requirements has higher priority in the requirements than corporate design consistency. 

For this reason we do not follow the red color of the swiss.github.io/designsystem for interaction but use rather an expected blue color. We don't use blue primitive for this but we created a special steelblue and extended the set of primitives for this reason. One of the reasons is `primitives.steelblue` is consumed by `semantic.interaction` token layer, whereas the `primitives.blue` is used for `semantics.status.info` color. Another reason is that in the tests we made, the `primitive.blue` has not provided an expected aesthetics to be anticipated as a color that plays such a significant role in this major design system. The color, when used for buttons and links - looked simply too saturated, less serious and evoked connotations more on the lifestyle, music etc. than corporate design for federal applications.

### Emphasis Low (`ob.s.color.interaction.emphasis-low`)

There are two main reasons to set emphasis-low instead of emphasis-high:

**1. Well-Established Interaction Patterns**
When the interaction elements are expected as such in well-established patterns such as header and footer, the color would only drive too much attention to something that is already understood so we would unnecessarily waste cognitive energy of the user by providing strong saturated colors. So we keep there the menu buttons, links and tabs not saturated respectively monochromatic that are stored in the `interaction.emphasis-low` path/group.

**2. Preventing Color Competition**
The other reason or use case is preventing collision of saturated colors that can damage the visual appearance and make two color groups - status and interactive - competing for users attention, especially in the Infobox component that always have a status color. In some cases infobox can contain also buttons. So, we do not want these buttons to overplay the status colors with their color, so we put them on emphasis-low, where they go a step back in terms of signalization and priority. That way we can have on the screen a minimal amount of saturated colors that drive users attention and consume cognitive energy.

---
