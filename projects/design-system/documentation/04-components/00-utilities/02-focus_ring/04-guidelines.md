# Focus Ring Usage Guidelines

## When to Use

### **Success:** Recommended Use Cases

**Interactive Elements**
- All keyboard-focusable elements (buttons, links, inputs, selects)
- Custom interactive components with `tabindex="0"`
- ARIA controls (tabs, accordions, custom dropdowns)

**Accessibility Requirements**
- Elements that trigger actions or state changes
- Form controls and input validation indicators  
- Navigation elements and menu items
- Interactive cards or tiles

**Theme Variants**
- Normal inversity for standard light backgrounds
- Flipped inversity for dark themes or high-contrast elements
- Component-specific implementations (buttons, inputs, tags)

### **Error:** Avoid These Patterns

**Non-Interactive Elements**
- Purely decorative elements - Use semantic markup instead
- Static text or images - No focus indication needed
- Disabled elements - System should handle appropriately

**Custom Focus Suppression**  
- `outline: none` without alternatives - Breaks accessibility
- Invisible focus indicators - Users cannot navigate
- Inconsistent focus styling - Confuses interaction patterns

## Design Guidelines

### Visual Consistency Standards

**Focus Ring Appearance**
- **Width**: 3px consistent across all components
- **Style**: Solid outline (CSS) or drop shadow (Figma)
- **Color**: Purple-based semantic tokens for brand consistency
- **Offset**: 1-3px depending on component type and size

**Component Coordination**
```css
/* Standard focus ring implementation */
.interactive-element:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}

/* Larger elements need more offset */
.large-interactive:focus {
  outline-offset: 3px;
}

/* Smaller elements need less offset */  
.small-interactive:focus {
  outline-offset: 1px;
}
```

### Theme Integration

**Light Theme (Normal Inversity)**
- Use `ob.s.border.focus_ring.inversity_normal` tokens
- Ensures contrast against light backgrounds
- Standard implementation for most components

**Dark Theme (Flipped Inversity)**  
- Use `ob.s.border.focus_ring.inversity_flipped` tokens
- Provides visibility against dark backgrounds
- Applied automatically in dark theme contexts

**Component-Specific Themes**
```css
/* Primary buttons may need flipped inversity even in light theme */
.ob-button--primary:focus {
  outline: var(--ob-s-border-focus-ring-inversity-flipped);
}

/* Active/selected states often need flipped inversity */
.ob-tag--active:focus {
  outline: var(--ob-s-border-focus-ring-inversity-flipped);
}
```

## Implementation Guidelines

### Figma Design Standards

**Component Setup**
1. Create focus state as boolean property or variant
2. Apply `ob.s.shadow.focus_ring.*` effects to focus state
3. Ensure effect is only visible in focus state
4. Test visibility against component background colors

**Token Usage in Figma**
- **Normal elements**: Use `ob.s.shadow.focus_ring.inversity_normal`
- **Dark/inverted elements**: Use `ob.s.shadow.focus_ring.inversity_flipped`  
- **Custom implementations**: Reference semantic color tokens directly

### CSS Development Standards

**Token Implementation**
```css
/* Correct semantic token usage */
.component:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}

/* Component-specific radius if needed */
.rounded-component:focus {
  border-radius: var(--ob-s-border-radius-md);
}
```

**Performance Considerations**
- Use CSS custom properties (tokens) instead of hardcoded values
- Avoid complex box-shadow implementations unless necessary
- Prefer `outline` over `border` for performance and accessibility

## Component-Specific Guidelines

### Button Focus Guidelines
- **Offset**: 3px for better visibility around button backgrounds
- **Theme**: Primary buttons may need flipped inversity for contrast
- **Shape**: Rounded focus ring should be slightly larger than button radius

### Input Focus Guidelines  
- **Offset**: 1-2px to stay close to input boundary
- **Coordination**: May combine with border color changes
- **Validation**: Error states should maintain focus visibility

### Tag Focus Guidelines
- **Shape**: Follow tag border radius (rounded for filter tags)
- **States**: Active tags use flipped inversity for proper contrast
- **Context**: Consider tag background when selecting inversity

### Link Focus Guidelines
- **Inline Links**: Standard focus ring with minimal offset
- **Button-Style Links**: Follow button focus guidelines
- **Navigation Links**: May need custom offset based on layout

## Accessibility Guidelines

### WCAG Compliance Requirements

**Contrast Standards**
- Minimum 3:1 contrast ratio against adjacent colors
- Test focus visibility in all supported themes
- Ensure visibility during hover and active states

**Keyboard Navigation**
```css
/* Proper focus management */
.interactive-element {
  /* Ensure element is keyboard accessible */
  cursor: pointer;
}

.interactive-element:focus {
  /* Provide clear focus indication */
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}

/* Never suppress without alternative */
.interactive-element:focus {
  /* ❌ Don't do this */
  outline: none;
}
```

**Focus Order Standards**
- Focus follows logical reading order (left-to-right, top-to-bottom)
- Modal and overlay focus is trapped within the component
- Focus returns to triggering element when modal closes

### Screen Reader Compatibility
- Focus changes are announced to screen readers
- Interactive elements have appropriate ARIA labels
- Focus indicators work with screen reader focus modes

## Testing Guidelines

### Manual Testing Standards
- Tab through all interactive elements
- Verify focus visibility in both light and dark themes  
- Test with high contrast system settings
- Validate focus order follows logical interaction patterns

### Automated Testing
```javascript
// Example accessibility test
describe('Focus Ring Accessibility', () => {
  test('interactive elements have visible focus indicators', () => {
    const interactiveElements = screen.getAllByRole('button');
    
    interactiveElements.forEach(element => {
      element.focus();
      // Test focus visibility using computed styles or visual regression
      expect(element).toHaveStyle('outline-width: 3px');
    });
  });
});
```

### Browser Testing
- Test across supported browsers (Chrome, Firefox, Safari, Edge)
- Verify focus ring appearance consistency
- Check for focus ring clipping or positioning issues
- Validate keyboard navigation behavior

## Performance Guidelines

### Standard Practices
- Use CSS custom properties (design tokens) for consistent theming
- Prefer `outline` property over `box-shadow` for performance
- Avoid animating focus indicators (accessibility preference)

### What to Avoid
- Complex focus ring animations that may trigger vestibular disorders
- Heavy box-shadow effects that impact rendering performance
- Inline styles instead of token-based CSS implementations

## Common Patterns

### Standard Interactive Element
```html
<button class="ob-button" type="button">
  Standard Action
</button>
```
```css
.ob-button:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 3px;
}
```

### Custom Interactive Component
```html
<div class="custom-control" tabindex="0" role="button" aria-label="Custom action">
  Custom Interactive Element  
</div>
```
```css
.custom-control:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}
```

### Theme-Aware Implementation
```css
.theme-sensitive:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
}

[data-theme="dark"] .theme-sensitive:focus {
  outline: var(--ob-s-border-focus-ring-inversity-flipped);
}
```

---

**Implementation Details**: See [Focus Ring Implementation](03-implementation.md)  
**Architecture Overview**: See [Focus Ring Architecture](02-architecture.md)  
**Component Overview**: See [Focus Ring Overview](01-overview.md)