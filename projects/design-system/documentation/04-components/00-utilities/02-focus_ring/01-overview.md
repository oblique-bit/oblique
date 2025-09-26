# Focus Ring Component Overview

## Component Introduction

The focus_ring component provides standardized focus indication across all interactive elements in the Oblique design system. It serves as a foundational utility pattern that ensures accessibility compliance and visual consistency for keyboard navigation and assistive technologies.

## When to Use

Use the focus_ring pattern when you need to:
- Indicate keyboard focus on interactive elements (buttons, inputs, links)
- Ensure WCAG 2.1 AA accessibility compliance
- Provide consistent focus styling across component variants
- Implement focus states in custom interactive components

## When Not to Use

Avoid using the focus_ring pattern when:
- The element is purely decorative and non-interactive
- Custom focus indicators provide better user experience (ensure accessibility compliance)
- The element already inherits focus from a parent interactive container

## Component Implementation

### CSS Implementation (Web)
The focus ring uses CSS `outline` property with semantic border tokens:

```css
.interactive-element:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}
```

### Figma Implementation (Design)
The focus ring uses boxShadow effects with semantic elevation tokens:

```figma
Component Property: Focus State = True
Applied Effect: ob.s.shadow.focus_ring.inversity_normal
```

## Variants

### Normal Inversity
**Purpose:** Standard focus indication on light backgrounds  
**Use Cases:** Default interactive elements, primary UI components

**Token References:**
- `ob.s.border.focus_ring.inversity_normal` (CSS)
- `ob.s.shadow.focus_ring.inversity_normal` (Figma)

### Flipped Inversity
**Purpose:** Focus indication on dark or high-contrast backgrounds  
**Use Cases:** Dark theme elements, active/selected states, inverted components

**Token References:**
- `ob.s.border.focus_ring.inversity_flipped` (CSS)
- `ob.s.shadow.focus_ring.inversity_flipped` (Figma)

## Basic Usage

### Button Implementation
```html
<button class="ob-button" type="button">
  Primary Action
</button>
```
```css
.ob-button:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}
```

### Input Implementation
```html
<input class="ob-input" type="text" placeholder="Enter text">
```
```css
.ob-input:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 1px;
}
```

### Tag Implementation
```html
<button class="ob-tag" role="button" tabindex="0">
  Filter Tag
</button>
```
```css
.ob-tag:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
  border-radius: var(--ob-s-border-radius-rounded);
}
```

## Accessibility Requirements

### WCAG Compliance
- **Contrast Ratio:** Minimum 3:1 against adjacent colors
- **Visual Persistence:** Focus indicator must remain visible during interaction
- **Keyboard Navigation:** All interactive elements must show focus indication
- **Screen Reader Support:** Focus changes must be announced to assistive technologies

### Implementation Standards
- Never use `outline: none` without providing alternative focus indication
- Ensure focus indicators work across all component states (hover, active, disabled)
- Test focus visibility in both light and dark themes
- Validate focus order follows logical interaction patterns

---

**Next Steps:** See [Focus Ring Architecture](02-architecture.md) for technical implementation details  
**Implementation Guide:** See [Focus Ring Implementation](03-implementation.md) for developer resources  
**Usage Guidelines:** See [Focus Ring Guidelines](04-guidelines.md) for design standards