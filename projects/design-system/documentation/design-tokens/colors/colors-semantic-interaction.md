# Interaction Colors Documentation

Interaction colors provide visual feedback for user interactions and establish clear states for all interactive elements in the Oblique Design System. They communicate hover, focus, active, visited, and disabled states across buttons, links, and other actionable components.

## Token Structure

```
ob.s.color.interaction.{emphasis-level}.{element-type}.{contrast-level}.{inversity-variation}
```

### Emphasis Levels
- `emphasis-high` - High emphasis interactions (primary actions, main CTAs)
- `emphasis-low` - Low emphasis interactions (secondary actions, supporting elements)

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
- `inversity-normal` - Standard light theme
- `inversity-flipped` - Dark theme / inverted contexts

## High Emphasis Interactions

High emphasis interactions are used for primary actions, main call-to-action buttons, and the most important interactive elements that should draw user attention.

### Background Colors (`bg-base`)
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast-high` | `#ffffff` | `#0f172a` | Primary button backgrounds |
| `contrast-medium` | `#e2e8f0` | `#475569` | Secondary button backgrounds |
| `contrast-low` | `#cbd5e1` | `#64748b` | Subtle interactive backgrounds |

### Foreground Colors (`fg-base`)
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast-high` | `#1e40af` | `#60a5fa` | Primary link text, main CTAs |
| `contrast-medium` | `#3b82f6` | `#93c5fd` | Secondary link text |
| `contrast-low` | `#60a5fa` | `#dbeafe` | Subtle interactive text |

### Interaction States
| State | Light Theme | Dark Theme | Usage |
|-------|-------------|------------|-------|
| `fg-hover` | `#1d4ed8` | `#3b82f6` | Hover state for links/buttons |
| `fg-focus` | `#2563eb` | `#1d4ed8` | Focus state indicators |
| `fg-active` | `#1e3a8a` | `#1e40af` | Active/pressed state |
| `fg-visited` | `#581c87` | `#a855f7` | Visited link indicator |
| `fg-disabled` | `#9ca3af` | `#6b7280` | Disabled state |

## Low Emphasis Interactions

Low emphasis interactions are used for secondary actions, supporting links, and interactive elements that should be present but not compete with primary actions.

### Background Colors (`bg-base`)
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast-high` | `#f8fafc` | `#1e293b` | Secondary button backgrounds |
| `contrast-medium` | `#f1f5f9` | `#334155` | Tertiary button backgrounds |
| `contrast-low` | `#e2e8f0` | `#475569` | Subtle interactive surfaces |

### Foreground Colors (`fg-base`)
| Contrast Level | Light Theme | Dark Theme | Usage |
|----------------|-------------|------------|-------|
| `contrast-high` | `#475569` | `#cbd5e1` | Secondary text links |
| `contrast-medium` | `#64748b` | `#94a3b8` | Supporting interactive text |
| `contrast-low` | `#94a3b8` | `#64748b` | Subtle interactive elements |

### Interaction States
| State | Light Theme | Dark Theme | Usage |
|-------|-------------|------------|-------|
| `fg-hover` | `#334155` | `#e2e8f0` | Hover state for secondary links |
| `fg-focus` | `#1e293b` | `#f1f5f9` | Focus state for secondary elements |
| `fg-active` | `#0f172a` | `#f8fafc` | Active state for secondary elements |
| `fg-visited` | `#4c1d95` | `#c4b5fd` | Visited secondary links |
| `fg-disabled` | `#cbd5e1` | `#475569` | Disabled secondary elements |

## Component Applications

### Primary Button
```scss
.btn-primary {
  // Default state
  background-color: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-high-inversity-normal);
  color: var(--ob-s-color-interaction-emphasis-high-fg-base-contrast-high-inversity-normal);
  
  // Hover state
  &:hover {
    background-color: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-medium-inversity-normal);
    color: var(--ob-s-color-interaction-emphasis-high-fg-hover-contrast-high-inversity-normal);
  }
  
  // Focus state
  &:focus {
    outline: 2px solid var(--ob-s-color-interaction-emphasis-high-fg-focus-contrast-high-inversity-normal);
    outline-offset: 2px;
  }
  
  // Active state
  &:active {
    background-color: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-low-inversity-normal);
    color: var(--ob-s-color-interaction-emphasis-high-fg-active-contrast-high-inversity-normal);
  }
  
  // Disabled state
  &:disabled {
    background-color: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-low-inversity-normal);
    color: var(--ob-s-color-interaction-emphasis-high-fg-disabled-contrast-low-inversity-normal);
    cursor: not-allowed;
  }
}
```

### Secondary Button
```scss
.btn-secondary {
  // Default state
  background-color: var(--ob-s-color-interaction-emphasis-low-bg-base-contrast-high-inversity-normal);
  color: var(--ob-s-color-interaction-emphasis-low-fg-base-contrast-high-inversity-normal);
  border: 1px solid var(--ob-s-color-interaction-emphasis-low-fg-base-contrast-medium-inversity-normal);
  
  // Hover state
  &:hover {
    background-color: var(--ob-s-color-interaction-emphasis-low-bg-base-contrast-medium-inversity-normal);
    color: var(--ob-s-color-interaction-emphasis-low-fg-hover-contrast-high-inversity-normal);
  }
  
  // Focus state
  &:focus {
    outline: 2px solid var(--ob-s-color-interaction-emphasis-low-fg-focus-contrast-high-inversity-normal);
    outline-offset: 2px;
  }
  
  // Active state  
  &:active {
    background-color: var(--ob-s-color-interaction-emphasis-low-bg-base-contrast-low-inversity-normal);
    color: var(--ob-s-color-interaction-emphasis-low-fg-active-contrast-high-inversity-normal);
  }
  
  // Disabled state
  &:disabled {
    background-color: var(--ob-s-color-interaction-emphasis-low-bg-base-contrast-high-inversity-normal);
    color: var(--ob-s-color-interaction-emphasis-low-fg-disabled-contrast-low-inversity-normal);
    border-color: var(--ob-s-color-interaction-emphasis-low-fg-disabled-contrast-low-inversity-normal);
  }
}
```

### Primary Link
```scss
.link-primary {
  // Default state
  color: var(--ob-s-color-interaction-emphasis-high-fg-base-contrast-high-inversity-normal);
  text-decoration: underline;
  text-decoration-color: var(--ob-s-color-interaction-emphasis-high-fg-base-contrast-medium-inversity-normal);
  
  // Hover state
  &:hover {
    color: var(--ob-s-color-interaction-emphasis-high-fg-hover-contrast-high-inversity-normal);
    text-decoration-color: var(--ob-s-color-interaction-emphasis-high-fg-hover-contrast-high-inversity-normal);
  }
  
  // Focus state
  &:focus {
    color: var(--ob-s-color-interaction-emphasis-high-fg-focus-contrast-high-inversity-normal);
    outline: 2px solid var(--ob-s-color-interaction-emphasis-high-fg-focus-contrast-high-inversity-normal);
    outline-offset: 2px;
  }
  
  // Active state
  &:active {
    color: var(--ob-s-color-interaction-emphasis-high-fg-active-contrast-high-inversity-normal);
  }
  
  // Visited state
  &:visited {
    color: var(--ob-s-color-interaction-emphasis-high-fg-visited-contrast-high-inversity-normal);
    text-decoration-color: var(--ob-s-color-interaction-emphasis-high-fg-visited-contrast-medium-inversity-normal);
  }
}
```

### Secondary Link
```scss
.link-secondary {
  // Default state
  color: var(--ob-s-color-interaction-emphasis-low-fg-base-contrast-high-inversity-normal);
  text-decoration: underline;
  text-decoration-color: var(--ob-s-color-interaction-emphasis-low-fg-base-contrast-medium-inversity-normal);
  
  // Hover state
  &:hover {
    color: var(--ob-s-color-interaction-emphasis-low-fg-hover-contrast-high-inversity-normal);
    text-decoration-color: var(--ob-s-color-interaction-emphasis-low-fg-hover-contrast-high-inversity-normal);
  }
  
  // Focus state
  &:focus {
    color: var(--ob-s-color-interaction-emphasis-low-fg-focus-contrast-high-inversity-normal);
    outline: 2px solid var(--ob-s-color-interaction-emphasis-low-fg-focus-contrast-high-inversity-normal);
    outline-offset: 2px;
  }
  
  // Active state
  &:active {
    color: var(--ob-s-color-interaction-emphasis-low-fg-active-contrast-high-inversity-normal);
  }
  
  // Visited state
  &:visited {
    color: var(--ob-s-color-interaction-emphasis-low-fg-visited-contrast-high-inversity-normal);
  }
}
```

### Form Controls
```scss
.form-input {
  // Default state
  background-color: var(--ob-s-color-interaction-emphasis-low-bg-base-contrast-high-inversity-normal);
  color: var(--ob-s-color-interaction-emphasis-low-fg-base-contrast-high-inversity-normal);
  border: 1px solid var(--ob-s-color-interaction-emphasis-low-fg-base-contrast-medium-inversity-normal);
  
  // Focus state
  &:focus {
    border-color: var(--ob-s-color-interaction-emphasis-high-fg-focus-contrast-high-inversity-normal);
    outline: 2px solid var(--ob-s-color-interaction-emphasis-high-fg-focus-contrast-high-inversity-normal);
    outline-offset: 1px;
  }
  
  // Disabled state
  &:disabled {
    background-color: var(--ob-s-color-interaction-emphasis-low-bg-base-contrast-low-inversity-normal);
    color: var(--ob-s-color-interaction-emphasis-low-fg-disabled-contrast-low-inversity-normal);
    border-color: var(--ob-s-color-interaction-emphasis-low-fg-disabled-contrast-low-inversity-normal);
  }
}
```

### Navigation Items
```scss
.nav-item {
  // Default state
  color: var(--ob-s-color-interaction-emphasis-low-fg-base-contrast-high-inversity-normal);
  
  // Hover state
  &:hover {
    color: var(--ob-s-color-interaction-emphasis-high-fg-hover-contrast-high-inversity-normal);
    background-color: var(--ob-s-color-interaction-emphasis-low-bg-base-contrast-low-inversity-normal);
  }
  
  // Active/Current state
  &.active {
    color: var(--ob-s-color-interaction-emphasis-high-fg-base-contrast-high-inversity-normal);
    background-color: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-low-inversity-normal);
  }
  
  // Focus state
  &:focus {
    outline: 2px solid var(--ob-s-color-interaction-emphasis-high-fg-focus-contrast-high-inversity-normal);
    outline-offset: 2px;
  }
}
```

## State Guidelines

### Default State
Use base colors with appropriate emphasis level and contrast for the element's importance in the interface hierarchy.

### Hover State
- Typically uses slightly higher contrast or different hue
- Should provide clear visual feedback without being overwhelming
- Apply to all interactive elements except those that are disabled

### Focus State
- Must be clearly visible and meet accessibility requirements
- Often uses outline or ring around the element
- Should be distinct from hover state
- Critical for keyboard navigation

### Active/Pressed State
- Usually darker or more saturated than default
- Brief state during click/tap interaction
- Should feel responsive and immediate

### Visited State
- Only applies to links
- Should be distinguishable from unvisited links
- Often uses purple/violet tones following web conventions

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

## Theme Integration

### Automatic Adaptation
Interaction colors automatically adapt to theme changes through inversity variations:

```scss
/* Light theme context */
.theme-light .btn-primary {
  background-color: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-high-inversity-normal);
  color: var(--ob-s-color-interaction-emphasis-high-fg-base-contrast-high-inversity-normal);
}

/* Dark theme context */
.theme-dark .btn-primary {
  background-color: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-high-inversity-flipped);
  color: var(--ob-s-color-interaction-emphasis-high-fg-base-contrast-high-inversity-flipped);
}
```

### Context-Aware Implementation
```scss
.interactive-element {
  /* Base styles that work in any context */
  --interaction-fg: var(--ob-s-color-interaction-emphasis-high-fg-base-contrast-high-inversity-normal);
  --interaction-bg: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-high-inversity-normal);
  
  color: var(--interaction-fg);
  background-color: var(--interaction-bg);
  
  /* Automatically adapts when inversity context changes */
  .inversity-flipped & {
    --interaction-fg: var(--ob-s-color-interaction-emphasis-high-fg-base-contrast-high-inversity-flipped);
    --interaction-bg: var(--ob-s-color-interaction-emphasis-high-bg-base-contrast-high-inversity-flipped);
  }
}
```

## Best Practices

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
- Use CSS custom properties for efficient theme switching
- Implement interaction states with CSS pseudo-classes
- Avoid JavaScript for basic interaction state management
- Leverage browser's built-in accessibility features

### Testing
- Test all interaction states across different themes
- Verify keyboard navigation with focus indicators
- Check contrast ratios with accessibility tools
- Validate with screen readers and assistive technologies

---

*For related documentation, see [Neutral Colors](./colors-semantic-neutral.md) and [Status Colors](./colors-semantic-status.md)*
