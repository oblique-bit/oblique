# Button Component Specification

**Version:** 3.0  
**Date:** September 26, 2025  
**Purpose:** Component specification for designers and developers

---

## Component Architecture

Three specialized button subcomponents serve distinct use cases:

### Component Structure Mapping

**Figma Structure → Token Structure**
```
button/button_label_icon → button.label_icon
button/button_remove     → button.remove  
button/button_icon_only  → button.icon_only
```

---

## Button Subcomponents

### 1. button.label_icon
**Primary Use Case:** Standard interactive button

**Purpose & Rationale:**
- Contains text label 
- Supports optional icons on left or right side for enhanced context
- Serves as the default button for most user actions

**Figma Layer Structure:**
```
button/button_label_icon
├── type=primary, state=regular, inversity=normal, flipped=off, disabled=off
├── type=primary, state=regular, inversity=flipped, flipped=on, disabled=off
├── type=secondary, state=regular, inversity=normal, flipped=off, disabled=off
├── type=secondary, state=regular, inversity=flipped, flipped=on, disabled=off
├── type=tertiary, state=regular, inversity=normal, flipped=off, disabled=off
├── type=tertiary, state=regular, inversity=flipped, flipped=on, disabled=off
├── type=primary, state=hover, inversity=normal, flipped=off, disabled=off
├── type=primary, state=hover, inversity=flipped, flipped=on, disabled=off
├── type=secondary, state=hover, inversity=normal, flipped=off, disabled=off
├── type=secondary, state=hover, inversity=flipped, flipped=on, disabled=off
├── type=tertiary, state=hover, inversity=normal, flipped=off, disabled=off
├── type=tertiary, state=hover, inversity=flipped, flipped=on, disabled=off
├── type=primary, state=pressed, inversity=normal, flipped=off, disabled=off
├── type=primary, state=pressed, inversity=flipped, flipped=on, disabled=off
├── type=secondary, state=pressed, inversity=normal, flipped=off, disabled=off
├── type=secondary, state=pressed, inversity=flipped, flipped=on, disabled=off
├── type=tertiary, state=pressed, inversity=normal, flipped=off, disabled=off
├── type=tertiary, state=pressed, inversity=flipped, flipped=on, disabled=off
├── type=primary, state=disabled, inversity=normal, flipped=off, disabled=on
├── type=primary, state=disabled, inversity=flipped, flipped=on, disabled=on
├── type=secondary, state=disabled, inversity=normal, flipped=off, disabled=on
├── type=secondary, state=disabled, inversity=flipped, flipped=on, disabled=on
├── type=tertiary, state=disabled, inversity=normal, flipped=off, disabled=on
└── type=tertiary, state=disabled, inversity=flipped, flipped=on, disabled=on
```

**Component Variant Schema Pattern:**
```
Each variant contains:
├── Background Frame (with fill/border styling)
├── Icon Slot (optional, left or right)
├── Text Label (typography styling)
└── Focus Ring (interaction state)
```

**Usage Context:**
- Form submissions ("Save", "Cancel", "Submit")
- Navigation actions ("Next", "Previous", "Continue") 
- Modal actions ("Confirm", "Delete", "Close")

### 2. button.icon_only
**Primary Use Case:** Space-efficient actions with universal iconography

**Purpose & Rationale:**
- Maximizes space efficiency in dense interface layouts
- Maintains proportional square dimensions (width = height)
- Provides consistent touch targets

**Figma Layer Structure:**
```
button/button_icon_only
├── type=primary, state=enabled, inversity=normal
├── type=primary, state=enabled, inversity=flipped
├── type=secondary, state=enabled, inversity=normal
├── type=secondary, state=enabled, inversity=flipped
├── type=tertiary, state=enabled, inversity=normal
├── type=tertiary, state=enabled, inversity=flipped
├── type=primary, state=hover, inversity=normal
├── type=primary, state=hover, inversity=flipped
├── type=secondary, state=hover, inversity=normal
├── type=secondary, state=hover, inversity=flipped
├── type=tertiary, state=hover, inversity=normal
├── type=tertiary, state=hover, inversity=flipped
├── type=primary, state=pressed, inversity=normal
├── type=primary, state=pressed, inversity=flipped
├── type=secondary, state=pressed, inversity=normal
├── type=secondary, state=pressed, inversity=flipped
├── type=tertiary, state=pressed, inversity=normal
├── type=tertiary, state=pressed, inversity=flipped
├── type=primary, state=disabled, inversity=normal
├── type=primary, state=disabled, inversity=flipped
├── type=secondary, state=disabled, inversity=normal
├── type=secondary, state=disabled, inversity=flipped
├── type=tertiary, state=disabled, inversity=normal
└── type=tertiary, state=disabled, inversity=flipped
```

**Component Variant Schema Pattern:**
```
Each variant contains:
├── Background Frame (square 36×36px with fill/border styling)
├── Icon Layer (24px icon, centered)
└── Focus Ring (interaction state)
```

**Usage Context:**
- Toolbar actions (close, minimize, maximize)
- Navigation controls (back, forward, menu toggle)
- Secondary actions where space is premium

### 3. button.remove
**Primary Use Case:** Removal actions within parent components

**Purpose & Rationale:**
- **Never used as standalone component** - always embedded within parents
- Specialized for removal/deletion actions
- Maintains visual hierarchy as secondary/tertiary action

**Figma Layer Structure:**
```
button/button_remove
├── state=enabled, inversity=normal
├── state=enabled, inversity=flipped
├── state=hover, inversity=normal
├── state=hover, inversity=flipped
├── state=pressed, inversity=normal
├── state=pressed, inversity=flipped
├── state=disabled, inversity=normal
└── state=disabled, inversity=flipped
```

**Component Variant Schema Pattern:**
```
Each variant contains:
├── Background Frame (square 16×16px, tertiary styling)
├── Remove Icon (16px close/x icon)
└── Interaction States (hover/pressed effects)
```

**Usage Context:**
- **Tags**: Remove tag from collection
- **List Items**: Remove item from lists
- **Form Fields**: Remove dynamic form elements

**Parent Component Integration:**
```
Tag Component
├── Text Content
└── button.remove ← embedded child
```

---

## Color System Integration

**Color Token Path:** `ob.s3.color.interaction`

All button components consume colors strictly from the interaction color group. See [colors-semantic-interaction.md](../../03-design-tokens/colors/colors-semantic-interaction.md) for complete color specifications.

---

## Token Architecture

### Structure Mapping

**Figma Naming** (`button/button_label_icon`):
- Reflects Figma's component organization hierarchy
- Groups related variants under common parent frames

**Token Naming** (`button.label_icon`):
- Follows CSS-friendly dot notation for implementation
- Aligns with W3C Design Token Community Group standards

### Token Reference by Component

#### button.label_icon Tokens

**Typography & Content:**
- `ob/s/static/font_family/body` - Font family
- `ob/s/dynamic/fontSize/md` - Font size (17px)
- `ob/s/dynamic/font_weight/medium` - Font weight (500)
- `ob/s/dynamic/letter_spacing_px/wide` - Letter spacing (0.5px)
- `ob/s/dynamic/lineHeight/xs` - Line height (16px)
- `ob/s/dynamic/paragraphSpacing/xs` - Paragraph spacing (8px)

**Layout & Spacing:**
- `ob/h/button/label_icon/spacing/gap` - Icon-text gap (6px)
- `ob/h/button/label_icon/spacing/padding/horizontal` - Horizontal padding (12px)
- `ob/h/button/label_icon/spacing/padding/vertical` - Vertical padding (6px)
- `ob/h/button/label_icon/container/size/min_height` - Minimum height (24px)
- `ob/h/button/label_icon/icon_size` - Icon size (24px)

**Visual Properties:**
- `ob/h/button/border_radius` - Border radius (1px)
- `ob/h/button/border_width` - Border width (1px)

**Color System - Primary:**
- `ob/h/button/color/fg/primary/inversity_normal/enabled` - Text color normal (#ffffff)
- `ob/h/button/color/bg/primary/inversity_normal/enabled` - Background normal (#2379a4)
- `ob/h/button/color/border/primary/inversity_normal/enabled` - Border normal (transparent)
- `ob/h/button/color/fg/primary/inversity_flipped/enabled` - Text color flipped (#2e8fbf)
- `ob/h/button/color/bg/primary/inversity_flipped/enabled` - Background flipped (#ffffff)

**Color System - Secondary:**
- `ob/h/button/color/fg/secondary/inversity_normal/enabled` - Text color normal (#2e8fbf)
- `ob/h/button/color/bg/secondary/inversity_normal/enabled` - Background normal (transparent)
- `ob/h/button/color/border/secondary/inversity_normal/enabled` - Border normal (#2e8fbf)
- `ob/h/button/color/fg/secondary/inversity_flipped/enabled` - Text color flipped (#ffffff)
- `ob/h/button/color/border/secondary/inversity_flipped/enabled` - Border flipped (#ffffff)

**Color System - Tertiary:**
- `ob/h/button/color/fg/tertiary/inversity_normal/enabled` - Text color normal (#2e8fbf)
- `ob/h/button/color/bg/tertiary/inversity_normal/enabled` - Background normal (transparent)
- `ob/h/button/color/border/tertiary/inversity_normal/enabled` - Border normal (transparent)
- `ob/h/button/color/fg/tertiary/inversity_flipped/enabled` - Text color flipped (#ffffff)

**Interactive States (All Types):**
- `*/hover` - Hover state colors
- `*/pressed` - Pressed state colors  
- `*/disabled` - Disabled state colors

**Focus & Shadow:**
- `ob/s3/color/interaction/focus_ring/inversity_normal` - Focus ring color (#8b5cf6)
- `ob/s3/color/neutral/shadow/first` - First shadow layer (#131b220d)
- `ob/s3/color/neutral/shadow/second` - Second shadow layer (#131b221a)

#### button.icon_only Tokens

**Layout & Spacing:**
- `ob/h/button/icon_only/spacing/padding/horizontal` - Horizontal padding (6px)
- `ob/h/button/icon_only/spacing/padding/vertical` - Vertical padding (6px)
- `ob/c/icon_slot/size_proportional/standard` - Icon size (24px)

**Visual Properties:**
- `ob/h/button/border_radius` - Border radius (1px)
- `ob/h/button-aug/border_width` - Border width (1px)

**Color System:** 
- Uses same color token structure as button.label_icon
- All primary, secondary, tertiary color variations
- All interaction states (enabled, hover, pressed, disabled)
- Both inversity modes (normal, flipped)

#### button.remove Tokens

**Layout & Spacing:**
- `ob/c/icon_slot/size_proportional/mini` - Icon size (16px)
- Component size: 16×16px (compact square)

**Color System:**
- `ob/h/button/color/fg/tertiary/*` - Uses tertiary color system only
- `ob/h/button/color/bg/tertiary/*` - Tertiary background colors
- `ob/h/button/color/border/tertiary/*` - Tertiary border colors
- All interaction states: enabled, hover, pressed, disabled
- Both inversity modes: normal, flipped

**Neutral System:**
- `ob/s3/color/neutral/no_color` - Transparent color (#00000000)

---

## Sizing Philosophy

### Component-Specific Sizing

**button.label_icon - Content-Driven Sizing:**
- Height remains consistent for predictable touch targets
- Width adapts to text content length and icon presence

**button.icon_only - Proportional Square Constraint:**
- **Width = Height** ensures optimal touch interaction
- Icon scales proportionally within button dimensions

**button.remove - Compact Integration:**
- **Smallest square dimensions** to minimize visual impact in parent components
- Touch-friendly despite compact size (minimum 32px touch target)

---

**Implementation Status:** Production ready  
**Related Documentation:** [Interaction Colors](../../03-design-tokens/colors/colors-semantic-interaction.md) • [Token Architecture](./token-decisions/flex-direction-token-decision-log.md)
**Implementation Status:** Production ready  
**Related Documentation:** [Interaction Colors](../../03-design-tokens/colors/colors-semantic-interaction.md) • [Token Architecture](./token-decisions/flex-direction-token-decision-log.md)

