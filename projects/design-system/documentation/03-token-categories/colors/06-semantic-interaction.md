# Interaction Colors Documentation

Interaction colors provide visual feedback for user interactions and establish clear states for all interactive elements in the Oblique Design System. They communicate hover, focus, active, visited, and disabled states across buttons, links, and other actionable components.

## Token Structure

```
ob.s1.color.interaction.{emphasis_level}.{element_type}.{contrast_level}.{inversity_variation}
```

### Emphasis Levels
- `emphasis_high` - High emphasis interactions (primary actions, main CTAs)
- `emphasis_low` - Low emphasis interactions (secondary actions, supporting elements)

### Element Types
- `bg_base` - Background colors for interactive elements
- `fg_base` - Foreground colors for interactive text/icons
- `border_base` - Border colors for interactive elements
- `fg_visited` - Colors for visited links
- `fg_disabled` - Colors for disabled interactive foregrounds
- `bg_disabled` - Colors for disabled interactive backgrounds

### Contrast Levels
- `contrast_high` - High contrast for primary interactions
- `contrast_medium` - Medium contrast for secondary interactions
- `contrast_low` - Low contrast for subtle interactions

### Inversity Variations
- `inversity_normal` - Standard light mode
- `inversity_flipped` - Dark mode / inverted contexts

### The S2 (Emphasis-Resolved) Tier
Component code more commonly consumes the emphasis-resolved tier: `ob.s2.color.interaction.contrast_levels.{fg|bg|border}.{high|medium|low}.{inversity_variation}`. Unlike S1, emphasis is not a path segment at S2 — the same token name resolves to a different value depending on which emphasis mode (high or low) is active for that part of the UI, the same way a lightness-mode token resolves differently under light vs. dark without "light" or "dark" appearing in its name. S2 does not define `fg_visited`, `fg_disabled`, or `bg_disabled` — component code references those S1 tokens directly for visited-link and disabled styling.

## High Emphasis Interactions

High emphasis interactions are used for primary actions, main call-to-action buttons, and the most important interactive elements that should draw user attention.

### Background Colors (`bg_base`)
| Contrast Level | Light Mode | Dark Mode | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#AACAE6` | `#255069` | Primary button backgrounds |
| `contrast_medium` | `#D3DEE9` | `#236487` | Secondary button backgrounds |
| `contrast_low` | `#F3F4F5` | `#2379A4` | Subtle interactive backgrounds |

### Foreground Colors (`fg_base`)
| Contrast Level | Light Mode | Dark Mode | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#255069` | `#FFFFFF` | Primary link text, main CTAs |
| `contrast_medium` | `#236487` | `#F3F4F5` | Secondary link text |
| `contrast_low` | `#2379A4` | `#D3DEE9` | Subtle interactive text |

### Border Colors (`border_base`)
| Contrast Level | Light Mode | Dark Mode | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#236487` | `#FFFFFF` | Primary interactive borders |
| `contrast_medium` | `#2379A4` | `#D3DEE9` | Secondary interactive borders |
| `contrast_low` | `#2E8FBF` | `#AACAE6` | Subtle interactive borders |

### Other States
| State | Token | Light Mode | Dark Mode | Usage |
|-------|-------|-------------|------------|-------|
| Visited | `fg_visited.contrast_high` | `#312E81` | `#EEF2FF` | Visited link indicator |
| Disabled foreground | `fg_disabled.contrast_low` | `#131B22` at 40% opacity | `#FFFFFF` at 40% opacity | Disabled state text |
| Disabled background | `bg_disabled.solid` | `#131B22` at 10% opacity | `#ACB4BD` | Disabled state fill |

## Low Emphasis Interactions

Low emphasis interactions are used for secondary actions, supporting links, and interactive elements that should be present but not compete with primary actions.

### Background Colors (`bg_base`)
| Contrast Level | Light Mode | Dark Mode | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#ACB4BD` | `#263645` | Secondary button backgrounds |
| `contrast_medium` | `#DFE4E9` | `#2F4356` | Tertiary button backgrounds |
| `contrast_low` | `#F0F4F7` | `#46596B` | Subtle interactive surfaces |

### Foreground Colors (`fg_base`)
| Contrast Level | Light Mode | Dark Mode | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#1C2834` | `#F0F4F7` | Secondary text links |
| `contrast_medium` | `#263645` | `#DFE4E9` | Supporting interactive text |
| `contrast_low` | `#2F4356` | `#ACB4BD` | Subtle interactive elements |

### Border Colors (`border_base`)
| Contrast Level | Light Mode | Dark Mode | Usage |
|----------------|-------------|------------|-------|
| `contrast_high` | `#131B22` | `#F0F4F7` | Secondary interactive borders |
| `contrast_medium` | `#1C2834` | `#DFE4E9` | Tertiary interactive borders |
| `contrast_low` | `#263645` | `#ACB4BD` | Subtle interactive borders |

### Other States
| State | Token | Light Mode | Dark Mode | Usage |
|-------|-------|-------------|------------|-------|
| Visited | `fg_visited.contrast_high` | `#312E81` | `#EEF2FF` | Visited secondary links |
| Disabled foreground | `fg_disabled.contrast_low` | `#131B22` at 40% opacity | `#F0F4F7` | Disabled state text |
| Disabled background | `bg_disabled.solid` | `#131B22` at 10% opacity | `#ACB4BD` | Disabled state fill |

## Component Applications

These examples reference the S2 contrast-level tokens for base, hover, and active styling, and the S1 tokens for visited and disabled styling. A hover or active state is expressed by moving to a different contrast step of the same token, not by a dedicated hover/active token.

### Primary Button
```scss
.btn-primary {
  // Default state
  background-color: var(--ob-s2-color-interaction-contrast_levels-bg-high-inversity_normal);
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);

  // Hover state
  &:hover {
    background-color: var(--ob-s2-color-interaction-contrast_levels-bg-medium-inversity_normal);
  }

  // Focus state
  &:focus {
    outline: var(--ob-s-border-focus_ring-inversity_normal-width) var(--ob-s-border-focus_ring-inversity_normal-style) var(--ob-s-border-focus_ring-inversity_normal-color);
    outline-offset: 2px;
  }

  // Active state
  &:active {
    background-color: var(--ob-s2-color-interaction-contrast_levels-bg-low-inversity_normal);
  }

  // Disabled state
  &:disabled {
    background-color: var(--ob-s1-color-interaction-emphasis_high-bg_disabled-solid-inversity_normal);
    color: var(--ob-s1-color-interaction-emphasis_high-fg_disabled-contrast_low-inversity_normal);
    cursor: not-allowed;
  }
}
```

### Secondary Button
```scss
.btn-secondary {
  // Default state
  background-color: var(--ob-s2-color-interaction-contrast_levels-bg-high-inversity_normal);
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
  border: 1px solid var(--ob-s2-color-interaction-contrast_levels-border-medium-inversity_normal);

  // Hover state
  &:hover {
    background-color: var(--ob-s2-color-interaction-contrast_levels-bg-medium-inversity_normal);
  }

  // Focus state
  &:focus {
    outline: var(--ob-s-border-focus_ring-inversity_normal-width) var(--ob-s-border-focus_ring-inversity_normal-style) var(--ob-s-border-focus_ring-inversity_normal-color);
    outline-offset: 2px;
  }

  // Active state
  &:active {
    background-color: var(--ob-s2-color-interaction-contrast_levels-bg-low-inversity_normal);
  }

  // Disabled state
  &:disabled {
    background-color: var(--ob-s1-color-interaction-emphasis_low-bg_disabled-solid-inversity_normal);
    color: var(--ob-s1-color-interaction-emphasis_low-fg_disabled-contrast_low-inversity_normal);
    border-color: var(--ob-s1-color-interaction-emphasis_low-fg_disabled-contrast_low-inversity_normal);
  }
}
```

### Primary Link
```scss
.link-primary {
  // Default state
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
  text-decoration: underline;
  text-decoration-color: var(--ob-s2-color-interaction-contrast_levels-fg-medium-inversity_normal);

  // Hover state
  &:hover {
    color: var(--ob-s2-color-interaction-contrast_levels-fg-medium-inversity_normal);
    text-decoration-color: var(--ob-s2-color-interaction-contrast_levels-fg-medium-inversity_normal);
  }

  // Focus state
  &:focus {
    outline: var(--ob-s-border-focus_ring-inversity_normal-width) var(--ob-s-border-focus_ring-inversity_normal-style) var(--ob-s-border-focus_ring-inversity_normal-color);
    outline-offset: 2px;
  }

  // Active state
  &:active {
    color: var(--ob-s2-color-interaction-contrast_levels-fg-low-inversity_normal);
  }

  // Visited state
  &:visited {
    color: var(--ob-s1-color-interaction-emphasis_high-fg_visited-contrast_high-inversity_normal);
    text-decoration-color: var(--ob-s1-color-interaction-emphasis_high-fg_visited-contrast_medium-inversity_normal);
  }
}
```

### Secondary Link
```scss
.link-secondary {
  // Default state
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
  text-decoration: underline;
  text-decoration-color: var(--ob-s2-color-interaction-contrast_levels-fg-medium-inversity_normal);

  // Hover state
  &:hover {
    color: var(--ob-s2-color-interaction-contrast_levels-fg-medium-inversity_normal);
  }

  // Focus state
  &:focus {
    outline: var(--ob-s-border-focus_ring-inversity_normal-width) var(--ob-s-border-focus_ring-inversity_normal-style) var(--ob-s-border-focus_ring-inversity_normal-color);
    outline-offset: 2px;
  }

  // Active state
  &:active {
    color: var(--ob-s2-color-interaction-contrast_levels-fg-low-inversity_normal);
  }

  // Visited state
  &:visited {
    color: var(--ob-s1-color-interaction-emphasis_low-fg_visited-contrast_high-inversity_normal);
  }
}
```

### Form Controls
```scss
.form-input {
  // Default state
  background-color: var(--ob-s2-color-interaction-contrast_levels-bg-high-inversity_normal);
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
  border: 1px solid var(--ob-s2-color-interaction-contrast_levels-border-medium-inversity_normal);

  // Focus state
  &:focus {
    border-color: var(--ob-s2-color-interaction-contrast_levels-border-high-inversity_normal);
    outline: var(--ob-s-border-focus_ring-inversity_normal-width) var(--ob-s-border-focus_ring-inversity_normal-style) var(--ob-s-border-focus_ring-inversity_normal-color);
    outline-offset: 1px;
  }

  // Disabled state
  &:disabled {
    background-color: var(--ob-s1-color-interaction-emphasis_low-bg_disabled-solid-inversity_normal);
    color: var(--ob-s1-color-interaction-emphasis_low-fg_disabled-contrast_low-inversity_normal);
    border-color: var(--ob-s1-color-interaction-emphasis_low-fg_disabled-contrast_low-inversity_normal);
  }
}
```

### Navigation Items
```scss
.nav-item {
  // Default state
  color: var(--ob-s2-color-interaction-contrast_levels-fg-medium-inversity_normal);

  // Hover state
  &:hover {
    color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
    background-color: var(--ob-s2-color-interaction-contrast_levels-bg-low-inversity_normal);
  }

  // Active/Current state
  &.active {
    color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
    background-color: var(--ob-s2-color-interaction-contrast_levels-bg-medium-inversity_normal);
  }

  // Focus state
  &:focus {
    outline: var(--ob-s-border-focus_ring-inversity_normal-width) var(--ob-s-border-focus_ring-inversity_normal-style) var(--ob-s-border-focus_ring-inversity_normal-color);
    outline-offset: 2px;
  }
}
```

## State Guidelines

### Default State
Use base colors with appropriate emphasis level and contrast for the element's importance in the interface hierarchy.

### Hover State
- Typically uses a lower contrast step than the default state
- Should provide clear visual feedback without being overwhelming
- Apply to all interactive elements except those that are disabled

### Focus State
- Must be clearly visible and meet accessibility requirements
- Often uses outline or ring around the element
- Should be distinct from hover state
- Critical for keyboard navigation

### Active/Pressed State
- Uses the lowest contrast step, giving a pressed-in appearance
- Brief state during click/tap interaction
- Should feel responsive and immediate

### Visited State
- Only applies to links
- Should be distinguishable from unvisited links
- Uses indigo tones following web conventions

### Disabled State
- Reduced contrast and saturation
- Often grayed out appearance
- Should clearly communicate non-interactive state
- Must not respond to any interaction events

## Accessibility

### Contrast Requirements
All interaction colors meet WCAG 2.1 accessibility standards:

- **High contrast combinations**: 7:1 minimum ratio (AAA compliance)
- **Medium contrast combinations**: 4.5:1 minimum ratio (AA compliance)
- **Low contrast combinations**: 3:1 minimum ratio (for decorative elements)

### Focus Indicators
Focus indicators must be clearly visible and meet enhanced contrast requirements:
- Focus outline must have 3:1 contrast ratio against adjacent colors
- Focus indicators should be at least 2px thick
- Use `outline-offset` to ensure focus rings don't obscure content

### Interactive States
All interactive elements must provide clear state feedback:
- Hover states should be visually distinct from default
- Focus states must be keyboard accessible
- Active states should provide immediate feedback
- Disabled states should clearly communicate non-interactivity

### Screen Reader Support
```html
<!-- Good: Button with proper ARIA attributes -->
<button 
  class="btn-primary"
  aria-describedby="submit-help"
  disabled
  aria-disabled="true"
>
  Submit Form
</button>

<!-- Good: Link with visited state indication -->
<a 
  href="/visited-page" 
  class="link-primary"
  aria-describedby="visited-indicator"
>
  Previously visited link
  <span id="visited-indicator" class="sr-only">(visited)</span>
</a>
```

## Focus Ring Implementation

### CSS vs Figma Brother Tokens

Focus rings are implemented using dedicated sibling tokens that provide the same visual result but use appropriate technology for each platform:

**CSS Implementation:**
```scss
.interactive-element:focus {
  outline: var(--ob-s-border-focus_ring-inversity_normal-width) var(--ob-s-border-focus_ring-inversity_normal-style) var(--ob-s-border-focus_ring-inversity_normal-color);
  outline-offset: 2px;
}
```

**Token Reference:**
- `ob.s.border.focus_ring` - CSS implementation using border token type
- `ob.s.shadow.focus` - Figma implementation using boxShadow token type (planned)  
- `ob.s1.color.interaction.focus_ring` - Shared color for both implementations

### Implementation Guidelines

**For Developers:**
- Use `ob.s.border.focus_ring` with CSS `outline` property
- Apply to all focusable interactive elements
- Include `outline-offset` for better visual separation
- Never use `outline: none` without alternative focus indication

**For Designers:**
- Use `ob.s.shadow.focus` as drop shadow effect in Figma (planned)
- Apply to focus state variants of interactive components
- Maintains visual consistency with CSS implementation
- Both tokens reference the same underlying color values

### Accessibility Compliance

Focus rings ensure keyboard navigation accessibility:
- Meet WCAG 2.1 contrast requirements (3:1 minimum against adjacent colors)
- Provide clear visual indication of keyboard focus
- Consistent across all interactive elements
- Never suppress without providing alternative focus indication

```scss
/* Proper focus implementation */
.button:focus {
  outline: var(--ob-s-border-focus_ring-inversity_normal-width) var(--ob-s-border-focus_ring-inversity_normal-style) var(--ob-s-border-focus_ring-inversity_normal-color);
  outline-offset: 2px;
}

/* Focus with custom styling */
.custom-focus:focus {
  outline: 2px solid var(--ob-s1-color-interaction-focus_ring-inversity_normal);
  outline-offset: 3px;
  border-radius: 4px;
}
```

## Mode Integration

### Automatic Adaptation
Interaction colors automatically adapt to lightness mode changes through inversity variations:

```scss
/* Light mode context */
.mode-light .btn-primary {
  background-color: var(--ob-s2-color-interaction-contrast_levels-bg-high-inversity_normal);
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
}

/* Dark mode context */
.mode-dark .btn-primary {
  background-color: var(--ob-s2-color-interaction-contrast_levels-bg-high-inversity_flipped);
  color: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_flipped);
}
```

### Context-Aware Implementation
```scss
.interactive-element {
  /* Base styles that work in any context */
  --interaction-fg: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_normal);
  --interaction-bg: var(--ob-s2-color-interaction-contrast_levels-bg-high-inversity_normal);
  
  color: var(--interaction-fg);
  background-color: var(--interaction-bg);
  
  /* Automatically adapts when inversity context changes */
  .inversity_flipped & {
    --interaction-fg: var(--ob-s2-color-interaction-contrast_levels-fg-high-inversity_flipped);
    --interaction-bg: var(--ob-s2-color-interaction-contrast_levels-bg-high-inversity_flipped);
  }
}
```

## standard practices

### Emphasis Hierarchy
- Use high emphasis for primary actions (main CTAs, submit buttons)
- Use low emphasis for secondary actions (cancel buttons, supporting links)
- Don't mix emphasis levels arbitrarily - maintain consistent hierarchy

### Interaction Feedback
- Always provide hover feedback for interactive elements
- Ensure focus states are clearly visible for keyboard users
- Use active states for immediate click/tap feedback
- Implement visited states for navigation links

### Performance Considerations
- Use CSS custom properties for efficient mode switching
- Implement interaction states with CSS pseudo-classes
- Avoid JavaScript for basic interaction state management
- Use the browser's built-in accessibility features

### Testing
- Test all interaction states across different modes
- Verify keyboard navigation with focus indicators
- Check contrast ratios with accessibility tools
- Validate with screen readers and assistive technologies

---

*For related documentation, see Brand Colors, Neutral Colors, and Status Colors*
