# Focus Ring Component Architecture
## Component Structure and Design Decisions

### Component Overview

The Focus Ring component provides standardized focus indication across the oblique design system through a dual-platform token architecture. It consists of semantic-level tokens that enable consistent focus styling while accommodating the technical constraints of both CSS and Figma implementations.

### Component Structure

```
focus_ring (Utility Pattern)
├── CSS Implementation (ob.s.border.focus_ring.*)
│   ├── Border-based outline styling
│   └── Semantic color token references
├── Figma Implementation (ob.s.shadow.focus_ring.*)  
│   ├── BoxShadow-based visual effects
│   └── Semantic color token references
└── Shared Color Foundation (ob.s3.color.interaction.focus_ring.*)
    ├── Normal inversity color values
    └── Flipped inversity color values
```

### Design Decisions

#### Why Dual-Platform Implementation?
The focus ring pattern requires different technical approaches for CSS and Figma due to platform limitations:

- **CSS**: Uses `outline` property for accessibility compliance and performance
- **Figma**: Uses `boxShadow` effects since Figma doesn't support outline styling as variables
- **Shared Colors**: Both implementations reference the same semantic color tokens for visual consistency

#### Why Semantic Token Level?
Focus rings operate at the semantic level (`ob.s.*`) rather than component level (`ob.c.*`) because:

- **Cross-Component Usage**: Required by buttons, inputs, tags, links, and custom interactive elements
- **Platform Abstraction**: Semantic tokens handle CSS/Figma implementation differences
- **Theme Coordination**: Inversity variants (normal/flipped) managed at semantic level
- **Accessibility Foundation**: Focus indication is a semantic interaction concept, not component-specific

### Token Architecture Integration

The focus ring component leverages oblique's semantic token architecture:

**Color Foundation**:
```json
"ob.s3.color.interaction.focus_ring": {
  "inversity_normal": "{ob.p.color.purple.500}",
  "inversity_flipped": "{ob.p.color.purple.300}"
}
```

**CSS Implementation Tokens**:
```json
"ob.s.border.focus_ring": {
  "inversity_normal": {
    "$type": "border",
    "$value": {
      "color": "{ob.s3.color.interaction.focus_ring.inversity_normal}",
      "width": "{ob.s.border_width.md}",
      "style": "solid"
    }
  }
}
```

**Figma Implementation Tokens**:
```json
"ob.s.shadow.focus_ring": {
  "inversity_normal": {
    "$type": "boxShadow",
    "$value": [
      {
        "x": "0", "y": "0", "blur": "0",
        "spread": "{ob.p.dimension.px.3}",
        "color": "{ob.s3.color.interaction.focus_ring.inversity_normal}",
        "type": "dropShadow"
      }
    ]
  }
}
```

### Component Integration Patterns

#### Button Integration
```json
"ob.h.button.label_icon.focus_ring": {
  "border_radius": {
    "$value": "{ob.s.border_radius.md}",
    "$description": "Focus ring radius larger than button element"
  }
}
```

#### Tag Integration  
```json
"ob.c.tag.filter_mode.focus_ring": {
  "color": {
    "enabled": "{ob.s3.color.interaction.focus_ring.inversity_normal}",
    "active": "{ob.s3.color.interaction.focus_ring.inversity_flipped}"
  }
}
```

### Technical Implementation Strategy

#### CSS Architecture
```css
/* Base focus ring utility */
.ob-focus-ring:focus {
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
}

/* Component-specific adjustments */
.ob-button:focus {
  outline-offset: 3px; /* Larger offset for buttons */
  border-radius: var(--ob-s-border-radius-md);
}

.ob-tag:focus {
  outline-offset: 2px;
  border-radius: var(--ob-s-border-radius-rounded); /* Follows tag shape */
}
```

#### Figma Implementation
- **Component States**: Focus state variants apply `ob.s.shadow.focus_ring.*` effects
- **Manual Application**: Since Figma can't automate focus styling, designers apply effects manually
- **Token Consistency**: Effects reference semantic shadow tokens to maintain visual parity with CSS

### Accessibility Architecture

#### WCAG Compliance Strategy
- **Contrast Requirements**: All focus ring colors meet 3:1 minimum contrast against adjacent surfaces
- **Visibility Requirements**: Focus indicators persist during all interaction states
- **Keyboard Navigation**: Focus ring appears for all keyboard-accessible interactive elements

#### Implementation Validation
```css
/* Validation approach for focus visibility */
.interactive-element:focus {
  /* Primary focus indication */
  outline: var(--ob-s-border-focus-ring-inversity-normal);
  outline-offset: 2px;
  
  /* Backup for browsers that suppress outline */
  box-shadow: 0 0 0 3px var(--ob-s3-color-interaction-focus-ring-inversity-normal);
}
```

### Component Boundary Management

#### Cross-Component Consistency
- **Size Coordination**: Focus ring width consistent across all components (3px)
- **Color Coordination**: All components use semantic focus ring color tokens
- **Offset Standards**: Standardized outline-offset values (1-3px based on component type)

#### Platform Coordination
- **Visual Parity**: CSS outline and Figma boxShadow produce equivalent visual results
- **Token Alignment**: Both implementations reference identical color values
- **Documentation Sync**: Implementation differences documented in both CSS and Figma guidelines

---

**Implementation Details**: See [Focus Ring Implementation Guide](03-implementation.md)  
**Usage Guidelines**: See [Focus Ring Usage Guidelines](04-guidelines.md)  
**Research Evidence**: See [Accessibility Research](_research/accessibility-research/wcag-compliance-study.md)