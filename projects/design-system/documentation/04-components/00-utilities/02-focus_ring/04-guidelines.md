# Focus Ring Usage Guidelines

## When to Use

Use focus rings on all interactive elements that can receive keyboard focus:
- Buttons, links, inputs, selects
- Custom interactive components with `tabindex="0"`
- ARIA controls (tabs, accordions, dropdowns)

## Figma Implementation

### Focus Ring Positioning Workaround
Since Figma doesn't support `outline-offset` as variables:

1. Insert focus_ring component into parent component (button, input, tag)
2. On the focus_ring **instance** (not main component), set position:
   - **X: -2, Y: -2** for standard offset
3. This simulates CSS `outline-offset: 2px`

### Token Usage
- **Normal elements**: `ob.s.shadow.focus_ring.inversity_normal`
- **Dark/inverted elements**: `ob.s.shadow.focus_ring.inversity_flipped`

## CSS Implementation

Use semantic tokens for consistent focus styling:

```css
.interactive-element:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: var(--ob-s-outline-offset-sm);
}
```