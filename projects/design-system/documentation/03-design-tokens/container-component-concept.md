# Container Component Concept

## Overview

The Container component provides a foundational layout wrapper that constrains content width, centers layouts, and provides responsive spacing. It follows the established Oblique token patterns and integrates with the existing responsive system.

## Token Structure

```
ob.c.tag.container.spacing.gap.{property}.{variant}.{state}
```

## Component Categories

### 1. **Layout Containers**
Primary page and section containers with max-width constraints.

### 2. **Content Containers**
Flexible containers for content blocks without strict width limits.

### 3. **Grid Containers**
Specialized containers for grid-based layouts.

## Token Implementation

### Width Constraints
```json
{
  "ob.c.tag.container.spacing.gap.page.default": {
    "$value": "1200px",
    "$type": "sizing",
    "$description": "Maximum width for main page content container"
  },
  "ob.c.tag.container.spacing.gap.content.default": {
    "$value": "800px",
    "$type": "sizing",
    "$description": "Maximum width for content blocks like articles"
  },
  "ob.c.tag.container.spacing.gap.wide.default": {
    "$value": "1400px",
    "$type": "sizing", 
    "$description": "Maximum width for wide layouts like dashboards"
  },
  "ob.c.tag.container.spacing.gap.narrow.default": {
    "$value": "600px",
    "$type": "sizing",
    "$description": "Maximum width for narrow content like forms"
  }
}
```

### Responsive Spacing
```json
{
  "ob.c.tag.container.spacing.gap.page.default": {
    "$value": "{ob.s.spacing.heading.top.4xl}",
    "$type": "spacing",
    "$description": "Horizontal padding for page containers on desktop"
  },
  "ob.c.tag.container.spacing.gap.section.default": {
    "$value": "{ob.s.spacing.heading.top.6xl}",
    "$type": "spacing", 
    "$description": "Vertical padding for section containers"
  },
  "ob.c.tag.container.spacing.gap.grid.default": {
    "$value": "{ob.s.spacing.heading.top.3xl}",
    "$type": "spacing",
    "$description": "Gap between grid items in container"
  }
}
```

### Responsive Overrides
```json
// Mobile specific spacing
{
  "ob.c.tag.container.spacing.gap.page.mobile": {
    "$value": "{ob.s.spacing.heading.top.2xl}",
    "$type": "spacing",
    "$description": "Reduced horizontal padding for page containers on mobile"
  },
  "ob.c.tag.container.spacing.gap.section.mobile": {
    "$value": "{ob.s.spacing.heading.top.4xl}",
    "$type": "spacing",
    "$description": "Reduced vertical padding for section containers on mobile"
  }
}
```

## Component Variants

### Page Container
- **Purpose**: Main page wrapper with centered content
- **Max-width**: 1200px
- **Behavior**: Centers content, provides horizontal padding
- **Use case**: Primary page layout wrapper

### Content Container  
- **Purpose**: Content-focused wrapper for articles, cards
- **Max-width**: 800px
- **Behavior**: Optimized for reading width
- **Use case**: Article content, long-form text

### Wide Container
- **Purpose**: Wide layouts for data-rich interfaces  
- **Max-width**: 1400px
- **Behavior**: Allows more horizontal space
- **Use case**: Dashboards, tables, complex layouts

### Narrow Container
- **Purpose**: Focused interactions and forms
- **Max-width**: 600px  
- **Behavior**: Constrains width for better UX
- **Use case**: Forms, login pages, focused tasks

### Fluid Container
- **Purpose**: Full-width container without constraints
- **Max-width**: none
- **Behavior**: Expands to full viewport width
- **Use case**: Hero sections, full-width components

## Design Principles

### 1. **Responsive-First**
- Mobile: Reduced padding, full-width approach
- Desktop: Centered with horizontal constraints

### 2. **Content Optimization**
- Optimal reading lengths for text content
- Appropriate spacing for different content types

### 3. **Flexible Grid Support**
- Built-in gap management
- Grid-aware spacing patterns

### 4. **Nested Container Support**
- Containers can be nested without spacing conflicts
- Clear hierarchy through variant selection

## Usage Guidelines

### When to Use Each Variant

| Variant | Use Case | Typical Content |
|---------|----------|-----------------|
| `page` | Main page wrapper | Primary layout container |
| `content` | Reading-focused content | Articles, documentation |
| `wide` | Data-heavy interfaces | Tables, dashboards |
| `narrow` | Focused interactions | Forms, wizards |
| `fluid` | Full-width sections | Heroes, banners |

### Responsive Behavior

```scss
// Desktop (768px+)
.ob-container-page {
  max-width: var(--ob-c-container-sizing-max-width-page-default);
  padding-inline: var(--ob-c-container-spacing-padding-horizontal-page-default);
  margin-inline: auto;
}

// Mobile (0-767px) 
@media (max-width: 767px) {
  .ob-container-page {
    padding-inline: var(--ob-c-container-spacing-padding-horizontal-page-mobile);
  }
}
```

## Integration with Existing System

### Semantic Token References
All container tokens reference existing semantic spacing tokens:
- `{ob.s.spacing.heading.top.*}` for all spacing values
- `{ob.g.theme_configuration.viewport.mobile}` for responsive behavior
- Follows established naming patterns

### Component Token Hierarchy
Container tokens sit at component level (ob.c.tag.container.spacing.gap and reference semantic tokens (ob.s.z_index.stepper_mobile.*), maintaining the token hierarchy.

### Inversity Support
Container backgrounds can support inversity patterns when needed:
```json
{
  "ob.c.tag.container.spacing.gap.default.normal": {
    "$value": "{ob.s3.color.brand.tag.container.spacing.gap.color.bg.default.flipped": {
    "$value": "{ob.s3.color.brand.color.neutral.bg_base.contrast_lowest.inversity_flipped}"
  }
}
```

## Next Steps

1. **Implement base container tokens** in appropriate JSON files
2. **Create responsive variants** for mobile/desktop
3. **Develop CSS utility classes** for container variants
4. **Create documentation examples** showing usage patterns
5. **Test with existing components** to ensure integration

## Benefits

- **Consistent Layout**: Standardized width constraints across applications
- **Responsive Design**: Built-in mobile/desktop behavior
- **Developer Experience**: Clear semantic naming and usage patterns  
- **Content Optimization**: Variants optimized for different content types
- **System Integration**: Consistent integration with existing token architecture
