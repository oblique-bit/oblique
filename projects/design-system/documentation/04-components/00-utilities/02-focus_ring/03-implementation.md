# Focus Ring Implementation Guide

## CSS Implementation
```css
.your-interactive-element:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: var(--ob-s-outline-offset-sm);
}
```

## Figma Implementation

### Figma Outline Offset Workaround
Since Figma doesn't support CSS `outline-offset` as variables, we simulate offset positioning manually:

1. Insert `focus_ring` component into parent component (e.g., `button/button_label_icon`)
2. On the **instance level** (not main component), manually set position:
   - **X: -2** (moves focus ring left to create horizontal offset)  
   - **Y: -2** (moves focus ring up to create vertical offset)
3. This creates visual offset equivalent to CSS `outline-offset: 2px`

**Important:** Position adjustments made on focus_ring instances within parent components, not on the main focus_ring component itself.