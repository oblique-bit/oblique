# Tag Component Overview

## Component Introduction

The Tag component provides **interactive categorization el## Size Variants

### Size Inheritance & Control

**tag.input_mode**: Size is **locked** and inherited from parent input field
- **Small**: When input field is small
- **Medium**: When input field is medium  
- **Large**: When input field is large
- **Designer note**: Size cannot be overridden independently

**tag.filter_mode**: Size is **independent** with designer control
- **Small (sm)**: Dense filtering interfaces, mobile contexts
- **Medium (md)**: Default size when no size specified
- **Large (lg)**: Prominent filtering, accessibility-focused interfaces
- **Designer note**: Can be explicitly set via size property

### Size Implementation Details

| Size | Height | Typography | Icon | Use Context |
|------|--------|------------|------|-------------|
| **sm** | 24px (stretchy) | xs/normal | 12px | Dense interfaces, compact forms |
| **md** | 32px (spacious) | sm/normal | 12px | Default filter_mode, standard forms |  
| **lg** | 40px (hefty) | md/normal | 16px | Prominent interfaces, touch targets |nputs and filtering interfaces. It enables users to add, remove, and manage collections of categorized data within input fields with built-in accessibility and consistent styling.

## When to Use

Use the tag component when you need to:
- **Form input categorization**: Users entering multiple keywords, interests, or metadata
- **Filtering interfaces**: Users selecting/deselecting filter criteria  
- **Multi-select inputs**: Managing collections of selected items with individual removal
- **Form data management**: Organizing related data points that users can modify

## Component Variants & Use Cases

### tag.input_mode (Form Input Mode)
**Context**: Inside input fields for data entry  
**Interaction**: Individual removal with button.remove  
**States**: enabled, hover, focus, disabled  
**Behavior**: Users add/remove tags from their input collection  
**Size**: Locked inheritance from parent input field

```typescript
// tag.input_mode - removable tags with locked sizing
<ob-input-text placeholder="Add skills...">
  <ob-tag mode="input_mode">JavaScript</ob-tag>
  <ob-tag mode="input_mode">React</ob-tag>
</ob-input-text>
```

### tag.filter_mode (Filtering Mode)  
**Context**: Outside forms for filtering/selection interfaces  
**Interaction**: Toggle selection state with click  
**States**: enabled, hover, focus, active, disabled  
**Behavior**: Users select/deselect filter criteria  
**Size**: Default md, designer can set sm or lg

```typescript
// tag.filter_mode - selectable tags with designer-controlled sizing
<div class="filter-section">
  <ob-tag mode="filter_mode" size="md" active="true">Development</ob-tag>
  <ob-tag mode="filter_mode" size="md" active="false">Design</ob-tag>
  <ob-tag mode="filter_mode" size="lg" active="false">Marketing</ob-tag>
</div>
```

## When Not to Use

Avoid using the tag component when:
- **Static labeling**: Use alternative components for non-interactive categorization
- **Status indicators**: Use badge components for system states or navigation counts
- **Single-select options**: Use standard select inputs or radio buttons (not multiple filter selection)
- **Non-removable form data**: Consider read-only lists for unchangeable collections
- **Binary toggles**: Use switches or checkboxes for simple on/off states

## Babushka Principle Position

Tags demonstrate **intermediate complexity** in the babushka sizing hierarchy:

1. **icon_holder** → foundational icon management *(inherits from)*
2. **button** → interactive behaviors *(inherits from)*  
3. **tag** → specialized form input behavior *(this component)*
4. **input_text** → complex field management *(builds upon)*

Tags inherit sizing and interactive patterns from button while providing specialized form-focused behaviors.

## Component Architecture

### Core Features
- **Removable functionality**: Each tag can be individually deleted
- **Size variants**: Small (sm), Medium (md), Large (lg) following token hierarchy
- **Icon integration**: Optional icons using icon_holder patterns
- **Keyboard navigation**: Full accessibility support for form inputs
- **State management**: Enabled, hover, focus, active, disabled states

### Token Integration  
- **ob.c.tag.*** - Complete token architecture for styling consistency
- **Size inheritance**: Automatic icon and typography scaling
- **Neutral color palette**: Restricted colors for form usability
- **Accessibility compliance**: WCAG-compliant contrast and interaction states

## Basic Usage

### Default Implementation
```typescript
<ob-tag size="md" removable="true">
  Keyword 1
</ob-tag>
<ob-tag size="md" removable="true">
  Frontend
</ob-tag>
```

### Common Patterns
```typescript
// tag.input_mode with automatic size inheritance
<ob-input-text size="sm" placeholder="Add keywords...">
  <ob-tag mode="input_mode">JavaScript</ob-tag>
  <ob-tag mode="input_mode">React</ob-tag>
  <ob-tag mode="input_mode">TypeScript</ob-tag>
</ob-input-text>

// tag.filter_mode with designer-controlled sizing
<div class="filter-tags" role="group" aria-label="Content filters">
  <ob-tag mode="filter_mode" size="md" active="true">Development</ob-tag>
  <ob-tag mode="filter_mode" size="md" active="false">Design</ob-tag>
  <ob-tag mode="filter_mode" size="lg" active="true">Frontend</ob-tag>
</div>
```

## Size Variants

### Small (sm) - Input Fields
- **Height**: 24px (stretchy token)
- **Typography**: xs/normal  
- **Icon**: xs (12px)
- **Use case**: Dense input fields, compact forms

### Medium (md) - Default
- **Height**: 32px (spacious token)
- **Typography**: sm/normal
- **Icon**: xs (12px)  
- **Use case**: Standard forms, general filtering

### Large (lg) - Prominent Interfaces
- **Height**: 40px (hefty token)
- **Typography**: md/normal
- **Icon**: sm (16px)
- **Use case**: Large forms, prominent filtering interfaces

## Accessibility

The tag component includes built-in accessibility features:
- **Keyboard navigation**: Tab, Enter, Escape, Backspace support
- **Screen reader support**: Proper ARIA labels and announcements
- **Focus management**: Clear focus indicators and keyboard interaction
- **Contrast compliance**: WCAG AA compliant color combinations
- **Remove button accessibility**: Clear indication of deletion actions

## Token Integration

This component uses design tokens for:
- **Sizing consistency**: ob.c.tag.surface.min_height.* for component dimensions
- **Typography scaling**: ob.c.tag.typography.size.* following type scale
- **Spacing harmony**: ob.c.tag.spacing.* for internal padding and gaps
- **Color semantics**: ob.c.tag.color.* for neutral, accessible palettes
- **Icon integration**: ob.c.tag.icon.size.* coordinated with icon_holder tokens

## Related Components

- **input_text** - Primary container for tag collections in forms
- **button** - Interactive behavior patterns and remove button functionality
- **Related form components** - For alternative input and selection patterns

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - Design decisions and structure
- [Implementation Guide](03-implementation.md) - Developer implementation details
- [Usage Guidelines](04-guidelines.md) - Best practices and patterns
