# Focus Ring Implementation Guide

## Quick Setup

### CSS Implementation
```css
/* Add to your component stylesheet */
.your-interactive-element:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}

/* For dark themes or inverted elements */
.your-element-inverted:focus {
  outline: var(--ob-s-border-focus-ring-inversity-flipped);
  outline-offset: 2px;
}
```

### Figma Implementation
1. Select your interactive component
2. Add focus state variant or boolean property
3. Apply Effect: `ob.s.shadow.focus_ring.inversity_normal`
4. Set Effect visibility to focus state only

## Token Integration

### Available Focus Ring Tokens

#### CSS Implementation Tokens
```scss
// Border-based focus indicators for web
--ob-s-border-focus-ring-inversity-normal
--ob-s-border-focus-ring-inversity-flipped

// Usage in CSS
.component:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}
```

#### Figma Implementation Tokens
```figma
# BoxShadow-based focus indicators for design
ob.s.shadow.focus_ring.inversity_normal
ob.s.shadow.focus_ring.inversity_flipped

# Applied as Drop Shadow effects in Figma components
Effect Type: Drop Shadow
Token Reference: ob.s.shadow.focus_ring.inversity_normal
```

#### Shared Color Tokens
```scss
// Color values used by both CSS and Figma implementations
--ob-s3-color-interaction-focus-ring-inversity-normal
--ob-s3-color-interaction-focus-ring-inversity-flipped
```

## Component-Specific Implementation

### Button Focus Ring
```html
<button class="ob-button ob-button--primary" type="button">
  Primary Action
</button>
```
```css
.ob-button:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 3px; /* Larger offset for better button visibility */
}

.ob-button--primary:focus {
  /* Primary buttons may need flipped inversity for contrast */
  outline: var(--ob-s-border-focus-ring-inversity-flipped);
}
```

### Input Focus Ring
```html
<input class="ob-input" type="text" placeholder="Enter text">
```
```css
.ob-input:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 1px; /* Smaller offset for input fields */
  border-color: var(--ob-s3-color-interaction-focus-ring-inversity-normal);
}
```

### Tag Focus Ring
```html
<button class="ob-tag ob-tag--filter" role="button">
  Filter Tag
</button>
```
```css
.ob-tag:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}

.ob-tag--active:focus {
  /* Active tags use flipped inversity */
  outline: var(--ob-s-border-focus-ring-inversity-flipped);
}
```

### Custom Interactive Element
```html
<div class="custom-interactive" tabindex="0" role="button">
  Custom Interactive Element
</div>
```
```css
.custom-interactive:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
  /* Add rounded corners if needed */
  border-radius: var(--ob-s-border-radius-md);
}
```

## Advanced Implementation Patterns

### Responsive Focus Indicators
```css
.responsive-element:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  
  /* Adjust offset for mobile */
  @media (max-width: 768px) {
    outline-offset: 3px; /* Larger for touch targets */
  }
  
  @media (min-width: 769px) {
    outline-offset: 2px; /* Standard for mouse/keyboard */
  }
}
```

### Focus Within Patterns
```css
/* Container gets focus styling when child is focused */
.card:focus-within {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}

/* Suppress focus on individual children */
.card:focus-within .card__button:focus {
  outline: none;
}
```

### Theme-Aware Focus
```css
.theme-aware-component:focus {
  /* Default light theme */
  outline: var(--ob-s-border-focus-ring-inversity-normal);
}

[data-theme="dark"] .theme-aware-component:focus {
  /* Dark theme variant */
  outline: var(--ob-s-border-focus-ring-inversity-flipped);
}
```

## Accessibility Implementation

### WCAG Compliance Checklist
```css
/* ✅ Proper focus implementation */
.accessible-element:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
  /* Never remove outline without alternative */
}

/* ❌ Avoid this pattern */
.bad-example:focus {
  outline: none; /* Removes accessibility */
}

/* ✅ If custom styling needed */
.custom-focus-style:focus {
  outline: none; /* Only if providing alternative */
  box-shadow: 0 0 0 3px var(--ob-s3-color-interaction-focus-ring-inversity-normal);
  /* Alternative focus indication */
}
```

### Keyboard Navigation Support
```javascript
// JavaScript enhancement for complex interactions
class FocusRingManager {
  constructor() {
    this.setupKeyboardDetection();
  }
  
  setupKeyboardDetection() {
    // Show focus rings only for keyboard users
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }
}

new FocusRingManager();
```

```css
/* Enhanced focus visibility for keyboard users */
body.keyboard-navigation .interactive-element:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 3px; /* More prominent for keyboard */
}

body:not(.keyboard-navigation) .interactive-element:focus {
  outline-offset: 1px; /* Subtle for mouse users */
}
```

## Testing & Validation

### Visual Testing
```css
/* Testing utility class */
.test-focus-ring {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}
```

### Automated Testing
```javascript
// Jest test example
describe('Focus Ring Implementation', () => {
  test('applies correct focus styling', () => {
    const element = screen.getByRole('button');
    element.focus();
    
    expect(element).toHaveStyleRule(
      'outline',
      'var(--ob-s-border-focus-ring-inversity-normal)'
    );
  });
});
```

### Accessibility Testing
```bash
# axe-core testing
npm install @axe-core/playwright
```

```javascript
// Playwright accessibility test
test('focus indicators meet WCAG requirements', async ({ page }) => {
  await page.goto('/component-test-page');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag21aa', 'keyboard'])
    .analyze();
    
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

## Troubleshooting

### Common Issues

**Focus ring not visible**
- **Problem:** Outline not appearing on focus
- **Solution:** Check if `outline: none` is being applied somewhere in CSS cascade

**Incorrect colors in dark theme**
- **Problem:** Focus ring color doesn't contrast with background  
- **Solution:** Use `inversity_flipped` variant for dark or high-contrast backgrounds

**Focus ring cut off by parent container**
- **Problem:** Parent element clips focus indicator
- **Solution:** Add appropriate padding or use `overflow: visible` on parent

### Debug Mode
```css
/* Debug utility to visualize all focus indicators */
.debug-focus *:focus {
  outline: 3px dashed red !important;
  outline-offset: 2px !important;
}
```

---

**Architecture Details**: See [Focus Ring Architecture](02-architecture.md)  
**Usage Guidelines**: See [Focus Ring Guidelines](04-guidelines.md)  
**Token Reference**: See [Semantic Border Tokens](../../../03-design-tokens/)