# Tag Component Architecture
## Component Structure and Design Decisions

### Component Overview

The Tag component provides **interactive form categorization** across the Oblique design system. It consists of 3 specialized size variants designed for different form contexts and user interaction patterns, with built-in removability and icon support.

### Component Structure

```
Tag Component
├── Surface Container (min_height tokens)
├── Content Area
│   ├── Icon (optional, icon_holder pattern)
│   ├── Text Label (typography tokens)
│   └── Remove Button (tag.input_mode only)
├── Component Modes
│   ├── tag.input_mode (form input variant)
│   └── tag.filter_mode (filtering variant)
├── Size Variants
│   ├── Small (sm) - Dense interfaces
│   ├── Medium (md) - Default for filter_mode  
│   └── Large (lg) - Prominent interfaces
└── Context-Specific States
    ├── tag.input_mode: enabled, hover, focus, disabled
    └── tag.filter_mode: enabled, hover, focus, active, disabled
```

### Component Modes

#### tag.input_mode (Form Input Variant)
**Purpose**: Data entry within input fields  
**Key Features**:
- Remove button (button.remove inheritance)
- No active state (data is present or removed)
- Focus management for form workflows
- Individual tag deletion

**Clickability & Focus**:
- **Tag body**: Non-interactive (visual display only)
- **Remove button**: Clickable and focusable element
- **Focus ring**: Applied to remove button with inversity consideration for scannability

**Size Inheritance**:
- **Locked size**: Inherits size from parent input field
- **No override**: Size cannot be changed independently
- **Automatic scaling**: Icons, typography, and spacing follow input field size

#### tag.filter_mode (Filtering Variant)  
**Purpose**: Selection/filtering outside form contexts  
**Key Features**:
- Active state for selection indication  
- No remove button (toggle selection instead)
- Multi-select capability
- Visual selection feedback

**Clickability & Focus**:
- **Tag body**: Clickable and focusable element (entire tag is interactive)
- **No sub-elements**: Whole component acts as single interaction target
- **Focus ring**: Applied to entire tag surface

**Size Management**:
- **Default size**: Medium (md) when no overarching size mode is set
- **Designer control**: Product designers can change to sm or lg as needed
- **Independent sizing**: Not bound to parent component size constraints

### Babushka Inheritance Pattern

Tag demonstrates **component composition** following the babushka principle:

```
icon_holder (foundational) → button (interactive) → tag (specialized)
```

**Inheritance Chain**:
1. **icon_holder**: Base icon sizing and display patterns
2. **button**: Interactive states, focus management, accessibility
3. **tag**: Form-specific behaviors, removal actions, input integration

### Token Architecture Integration

The tag component leverages Oblique's three-dimensional token architecture:
- **Viewport Dimension**: Touch-friendly size forcing for accessibility
- **Size Dimension**: sm/md/lg variants for different contexts  
- **Component Dimension**: Specialized tokens for each subcomponent

**Size Inheritance Example**:
```
// Parent component determines context
{TOKEN_INHERITANCE_EXAMPLE}

// Three-dimensional token resolution
{TOKEN_RESOLUTION_EXAMPLE}
**Dimensional Structure**:
```
ob.c.tag.{category}.{property}.{size}.{state}
│   │  │    │         │         │      │
│   │  │    │         │         │      └─ interaction state
│   │  │    │         │         └─ size variant (sm/md/lg)
│   │  │    │         └─ visual property
│   │  │    └─ token category  
│   │  └─ component identifier
│   └─ component level
└─ namespace
```

**Component Boundary Management**:
- Size context flows from parent components (input_text, filtering interfaces)
- Tag tokens respect parent size semantics through consistent small/medium/large mapping
- Proportional constraints maintained across all size variants using semantic token references

### Design Decisions

#### Why Neutral-Only Color Palette?

Tags use **restricted neutral colors** to maintain form usability and avoid visual overload in input contexts.

**UX Rationale**:
- **Form clarity**: Prevents color distraction from form validation states
- **Accessibility focus**: Neutral palette ensures consistent contrast ratios
- **Input context**: Multiple colorful tags would create visual chaos in text inputs
- **Visual hierarchy**: Maintains focus on form content rather than decorative elements

*UX Validation: 1-year PoC confirmed neutral palette improves form completion rates and reduces cognitive load*

#### Why Three Size Variants?

Tag sizes align with **babushka sizing principle** providing appropriate scale for different form contexts.

**Size Context Mapping**:
- **Small (sm)**: Dense forms, compact inputs, mobile-first interfaces
- **Medium (md)**: Standard desktop forms, default filtering interfaces  
- **Large (lg)**: Prominent forms, accessibility-focused interfaces, touch targets

**Technical Benefits**:
- Automatic icon scaling through icon_holder inheritance
- Typography scale consistency with button and input components
- Proportional spacing maintained across all interaction states

#### Why Two Distinct Modes?

Tags serve **different interaction paradigms** requiring specialized behavior patterns and size management strategies.

**tag.input_mode Paradigm**:
- **Data collection**: Tags represent user-entered data
- **Removal action**: Users delete unwanted entries with remove buttons
- **Linear workflow**: Add → Review → Remove pattern
- **State simplicity**: Present or absent (no selection concept)
- **Focus target**: Remove button only (tag body is non-interactive)
- **Size constraint**: Locked to parent input field size for visual consistency

**tag.filter_mode Paradigm**:
- **Option selection**: Tags represent available filter criteria  
- **Toggle action**: Users select/deselect options through active state
- **Multi-selection**: Multiple filters can be active simultaneously
- **State persistence**: Selection state persists across interactions
- **Focus target**: Entire tag surface (whole component is interactive)
- **Size flexibility**: Independent sizing with designer control (default md)

*UX Validation: Separate modes prevent interaction confusion and improve each use case*

#### Inversity Strategy for Accessibility

Tags use **context-appropriate inversity** to ensure focus ring scannability and visual hierarchy across both modes.

**tag.input_mode (Normal Inversity)**:
- Background uses `inversity_normal` for neutral form context
- Remove button focus ring remains scannable against tag background
- Maintains form visual hierarchy without competing with validation states
- Size-locked inheritance ensures consistency with input field styling

**tag.filter_mode with Active State (Flipped Inversity)**:
- Active state uses `inversity_flipped` following button.primary pattern
- Selected tags gain visual prominence like primary buttons
- Focus ring maintains scannability through inversity contrast
- Independent size control allows for interface-appropriate scaling

**Current Implementation**:
- No sub-variants with different inversity (unlike button.primary/secondary)
- Single inversity strategy per mode for consistency
- Future extensibility reserved for specialized use cases

### Token Architecture Details

#### Size Variant Implementation
```json
// Small tags for compact inputs
"ob.c.tag.surface.min_height.sm": "{ob.s.size.stretchy}",     // 24px
"ob.c.tag.typography.size.sm": "{ob.s.typography.type_scale.xs.normal}",
"ob.c.tag.icon.size.sm": "{ob.s.icon.size.xs}",               // 12px

// Medium tags for standard forms  
"ob.c.tag.surface.min_height.md": "{ob.s.size.spacious}",     // 32px
"ob.c.tag.typography.size.md": "{ob.s.typography.type_scale.sm.normal}",
"ob.c.tag.icon.size.md": "{ob.s.icon.size.xs}",               // 12px

// Large tags for prominent interfaces
"ob.c.tag.surface.min_height.lg": "{ob.s.size.hefty}",        // 40px  
"ob.c.tag.typography.size.lg": "{ob.s.typography.type_scale.md.normal}",
"ob.c.tag.icon.size.lg": "{ob.s.icon.size.sm}"                // 16px
```

#### Spacing Coordination
```json
// Internal spacing scales proportionally
"ob.c.tag.spacing.padding.horizontal.sm": "{ob.s.spacing.md}",
"ob.c.tag.spacing.padding.horizontal.md": "{ob.s.spacing.lg}",  
"ob.c.tag.spacing.padding.horizontal.lg": "{ob.s.spacing.2xl}",

// Icon-text gaps maintain readability
"ob.c.tag.spacing.gap.sm": "{ob.s.spacing.sm}",
"ob.c.tag.spacing.gap.md": "{ob.s.spacing.md}",
"ob.c.tag.spacing.gap.lg": "{ob.s.spacing.lg}"
```

#### State Management
```json
// tag.input_mode (normal inversity, remove button focus)
"ob.c.tag.input_mode.color.bg.enabled": "{ob.s3.color.neutral.bg.contrast_medium.inversity_normal}",
"ob.c.tag.input_mode.color.bg.hover": "{ob.s3.color.neutral.bg.contrast_high.inversity_normal}",
"ob.c.tag.input_mode.color.bg.focus": "{ob.s3.color.neutral.bg.contrast_low.inversity_normal}",
"ob.c.tag.input_mode.color.bg.disabled": "{ob.s3.color.neutral.bg.contrast_low.inversity_normal}",

// Remove button maintains scannability (input_mode only)
"ob.c.tag.input_mode.remove_button.focus_ring": "{ob.s3.color.interaction.focus.ring.inversity_normal}",
"ob.c.tag.input_mode.remove_button.size.sm": "{ob.s.icon.size.xs}",
"ob.c.tag.input_mode.remove_button.size.md": "{ob.s.icon.size.xs}",
"ob.c.tag.input_mode.remove_button.size.lg": "{ob.s.icon.size.sm}",

// tag.filter_mode (includes active state with flipped inversity)
"ob.c.tag.filter_mode.color.bg.enabled": "{ob.s3.color.neutral.bg.contrast_medium.inversity_normal}",
"ob.c.tag.filter_mode.color.bg.hover": "{ob.s3.color.neutral.bg.contrast_high.inversity_normal}",
"ob.c.tag.filter_mode.color.bg.active": "{ob.s3.color.neutral.bg.contrast_medium.inversity_flipped}",
"ob.c.tag.filter_mode.color.fg.active": "{ob.s3.color.neutral.fg.contrast_medium.inversity_flipped}",

// Active tag focus ring (follows button.primary pattern)
"ob.c.tag.filter_mode.focus_ring.active": "{ob.s3.color.interaction.focus.ring.inversity_flipped}",

// Default size for filter_mode (designer can override)
"ob.c.tag.filter_mode.surface.min_height.default": "{ob.s.size.spacious}" // md
```

#### Accessibility Focus Strategy

**tag.input_mode**:
```json
// Tag body is non-interactive (no focus ring)
"ob.c.tag.input_mode.body.focus": "none",

// Remove button receives focus with scannable ring
"ob.c.tag.input_mode.remove_button.focus_ring.color": "{ob.s3.color.interaction.focus.ring.inversity_normal}",
"ob.c.tag.input_mode.remove_button.focus_ring.width": "{ob.s.border.width.focus}",
"ob.c.tag.input_mode.remove_button.focus_ring.offset": "{ob.s.spacing.focus_offset}"
```

**tag.filter_mode**:
```json
// Entire tag surface is interactive and focusable
"ob.c.tag.filter_mode.focus_ring.color.enabled": "{ob.s3.color.interaction.focus.ring.inversity_normal}",
"ob.c.tag.filter_mode.focus_ring.color.active": "{ob.s3.color.interaction.focus.ring.inversity_flipped}",
"ob.c.tag.filter_mode.focus_ring.width": "{ob.s.border.width.focus}",
"ob.c.tag.filter_mode.focus_ring.offset": "{ob.s.spacing.focus_offset}"
```

### Implementation Principles

#### Composition Over Configuration
```typescript
// Preferred: Clear component composition
<ob-tag size="md" removable="true">
  <ob-icon>category</ob-icon>
  Frontend
</ob-tag>

// Avoided: Configuration-heavy single component  
<ob-tag 
  size="md" 
  icon="category" 
  text="Frontend" 
  removable="true"
  iconColor="inherit"
  textAlign="left" />
```

#### Context-Aware Sizing
- Tags inherit size context from parent input components automatically
- No manual size coordination required between input_text and child tags
- Three-dimensional tokens ensure consistent visual relationships

#### Accessibility-First Design
- Specialized ARIA roles for tag removal actions  
- Keyboard interaction patterns improved for form input contexts
- Focus management that respects input field workflows

### Babushka Size Validation

Tags validate the **babushka sizing principle** by demonstrating how specialized components inherit and build upon foundational patterns:

**Size Inheritance Chain**:
```
icon_holder.size.sm → button.size.sm → tag.size.sm
    (12px icon)    →    (24px min)   →   (24px + form context)
    
icon_holder.size.xs → button.size.md → tag.size.md  
    (12px icon)    →    (32px min)   →   (32px + form context)
    
icon_holder.size.sm → button.size.lg → tag.size.lg
    (16px icon)    →    (40px min)   →   (40px + form context)
```

**Validation Benefits**:
- **Consistency**: Icons scale appropriately with button inheritance patterns
- **Predictability**: Developers understand size relationships across components
- **Maintainability**: Token updates propagate correctly through inheritance chain
- **Accessibility**: Touch target sizes remain appropriate across all variants

---

**Implementation Details**: See [Tag Implementation Guide](03-implementation.md)  
**Usage Guidelines**: See [Tag Usage Guidelines](04-guidelines.md)  
**Research Evidence**: See [Chips Family Research](_research/competitive-analysis/chips-family-analysis.md)
