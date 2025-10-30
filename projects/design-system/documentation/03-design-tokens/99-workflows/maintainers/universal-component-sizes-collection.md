# Universal Component-Sizes Collection Plan

**Date:** September 6, 2025  
**Purpose:** Create a universal variable collection that can be used across multiple components  
**Status:** Planning Phase

## Collection Structure

### Collection Name: `Component-Sizes`
**Modes:** `xs | sm | md | lg`

### Variable Properties

#### 1. Spacing Category - Padding Variables
**Create in:** `▼ Spacing`
```
component/padding-vertical:
  - xs: {ob.s.spacing.none} (0px)
  - sm: {ob.s.spacing.sm} (8px) 
  - md: {ob.s.spacing.md} (12px)
  - lg: {ob.s.spacing.2xl} (20px)

component/padding-horizontal:
  - xs: {ob.s.spacing.none} (0px)
  - sm: {ob.s.spacing.xl} (20px)
  - md: {ob.s.spacing.3xl} (24px) 
  - lg: {ob.s.spacing.4xl} (32px)
```

#### 2. Spacing Category - Gap Variables
**Create in:** `▼ Spacing`
```
component/gap-icon-text:
  - xs: {ob.s.spacing.sm} (8px)
  - sm: {ob.s.spacing.sm} (8px)
  - md: {ob.s.spacing.md} (12px)
  - lg: {ob.s.spacing.lg} (16px)
```

#### 3. Sizing Category - Icon Size Variables
**Create in:** `▼ Sizing`
```
component/icon-size:
  - xs: {ob.s.icon.size.xs} (12px)
  - sm: {ob.s.icon.size.xs} (12px)
  - md: {ob.s.icon.size.sm} (16px)  
  - lg: {ob.s.icon.size.md} (20px)
```

#### 4. Typography Category - Typography Variables
**Create in:** `▼ Typography`
```
component/typography-size:
  - xs: {ob.s.typography.type_scale.xs.normal}
  - sm: {ob.s.typography.type_scale.sm.normal}
  - md: {ob.s.typography.type_scale.sm.normal}
  - lg: {ob.s.typography.type_scale.sm.normal}
```

#### 5. Sizing Category - Min-Height Variables (for buttons)
**Create in:** `▼ Sizing`
```
component/min-height:
  - xs: {ob.s.size.compact} (100px)
  - sm: {ob.s.size.compact} (100px)
  - md: {ob.s.size.spacious} (300px)
  - lg: {ob.s.size.hefty} (450px)
```

## Token Structure Examples

### How Variables Will Look in Each Mode

#### xs
**Tokens Studio:** `▼ Spacing`
**Text_Icons Variant:**
```
ob.h.button_aug.text_icons.spacing.padding.vertical
{ob.s.spacing.none}

ob.h.button_aug.text_icons.spacing.padding.horizontal
{ob.s.spacing.none}

ob.h.button_aug.text_icons.spacing.gap
{ob.s.spacing.sm}
```

**Tokens Studio:** `▼ Sizing`
**Text_Icons Variant:**
```
ob.h.button_aug.text_icons.icon.size
{ob.s.icon.size.xs}
```

**Tokens Studio:** `▼ Spacing`
**Icon_Only Variant:**
```
ob.h.button_aug.icon_only.spacing.padding.vertical
{ob.s.spacing.none}

ob.h.button_aug.icon_only.spacing.padding.horizontal
{ob.s.spacing.none}
```

**Tokens Studio:** `▼ Sizing`
**Icon_Only Variant:**
```
ob.h.button_aug.icon_only.icon.size
{ob.s.icon.size.xs}
```

#### sm
**Tokens Studio:** `▼ Spacing`
**Text_Icons Variant:**
```
ob.h.button_aug.text_icons.spacing.padding.vertical
{ob.s.spacing.sm}

ob.h.button_aug.text_icons.spacing.padding.horizontal
{ob.s.spacing.xl}

ob.h.button_aug.text_icons.spacing.gap
{ob.s.spacing.sm}
```

**Tokens Studio:** `▼ Sizing`
**Text_Icons Variant:**
```
ob.h.button_aug.text_icons.icon.size
{ob.s.icon.size.xs}
```

**Tokens Studio:** `▼ Spacing`
**Icon_Only Variant:**
```
ob.h.button_aug.icon_only.spacing.padding.vertical
{ob.s.spacing.sm}

ob.h.button_aug.icon_only.spacing.padding.horizontal
{ob.s.spacing.sm}
```

**Tokens Studio:** `▼ Sizing`
**Icon_Only Variant:**
```
ob.h.button_aug.icon_only.icon.size
{ob.s.icon.size.xs}
```

#### md
**Tokens Studio:** `▼ Spacing`
**Text_Icons Variant:**
```
ob.h.button_aug.text_icons.spacing.padding.vertical
{ob.s.spacing.md}

ob.h.button_aug.text_icons.spacing.padding.horizontal
{ob.s.spacing.3xl}

ob.h.button_aug.text_icons.spacing.gap
{ob.s.spacing.md}
```

**Tokens Studio:** `▼ Sizing`
**Text_Icons Variant:**
```
ob.h.button_aug.text_icons.icon.size
{ob.s.icon.size.sm}
```

**Tokens Studio:** `▼ Spacing`
**Icon_Only Variant:**
```
ob.h.button_aug.icon_only.spacing.padding.vertical
{ob.s.spacing.md}

ob.h.button_aug.icon_only.spacing.padding.horizontal
{ob.s.spacing.md}
```

**Tokens Studio:** `▼ Sizing`
**Icon_Only Variant:**
```
ob.h.button_aug.icon_only.icon.size
{ob.s.icon.size.sm}
```

#### lg
**Tokens Studio:** `▼ Spacing`
**Text_Icons Variant:**
```
ob.h.button_aug.text_icons.spacing.padding.vertical
{ob.s.spacing.2xl}

ob.h.button_aug.text_icons.spacing.padding.horizontal
{ob.s.spacing.4xl}

ob.h.button_aug.text_icons.spacing.gap
{ob.s.spacing.lg}
```

**Tokens Studio:** `▼ Sizing`
**Text_Icons Variant:**
```
ob.h.button_aug.text_icons.icon.size
{ob.s.icon.size.md}
```

**Tokens Studio:** `▼ Spacing`
**Icon_Only Variant:**
```
ob.h.button_aug.icon_only.spacing.padding.vertical
{ob.s.spacing.2xl}

ob.h.button_aug.icon_only.spacing.padding.horizontal
{ob.s.spacing.2xl}
```

**Tokens Studio:** `▼ Sizing`
**Icon_Only Variant:**
```
ob.h.button_aug.icon_only.icon.size
{ob.s.icon.size.md}
```

## Mapping to Button_Aug

### Text_Icons Variant
- **Padding Vertical:** `component/padding-vertical` (xs=0, sm=8px, md=12px, lg=20px)
- **Padding Horizontal:** `component/padding-horizontal` (xs=0, sm=20px, md=24px, lg=32px)
- **Icon-Text Gap:** `component/gap-icon-text` (sm=8px, md=12px, lg=16px)
- **Icon Size:** `component/icon-size` (sm=12px, md=16px, lg=20px)

### Icon_Only Variant  
- **Padding Vertical:** `component/padding-vertical` (xs=0, sm=8px, md=12px, lg=20px)
- **Padding Horizontal:** `component/padding-vertical` (same as vertical for circular shape)
- **Icon Size:** `component/icon-size` (xs=12px, sm=12px, md=16px, lg=20px)

## Implementation Steps

1. **Create Variable Collection in Figma:**
   - Collection name: `Component-Sizes`
   - Set up 4 modes: xs, sm, md, lg
   - Add all variable properties listed above

2. **Map to Tokens Studio:**
   - Update button_aug/static.json to reference the new variables
   - Replace mode-specific extensions with variable references

3. **Test with Button_Aug:**
   - Verify all size combinations work correctly
   - Ensure icon_only circular shape maintains proper proportions
   - Test text_icons rectangular shape scales appropriately

4. **Extend to Other Components:**
   - Badge: Use component/padding-* and component/typography-size
   - Pill: Use component/padding-* and component/icon-size  
   - Tag: Use component/padding-* and component/gap-icon-text

## Benefits

- **Single Source of Truth:** One collection for all component sizing
- **Consistent Experience:** Same size selection across all components  
- **Easy Maintenance:** Update one collection to affect all components
- **Future-Proof:** Can add new size modes (e.g., xs, xl) universally
- **Semantic Flexibility:** Each component can map to appropriate variables

## Fallback Plan

If universal approach doesn't work:
- Split into component-specific collections (Button-Sizes, Badge-Sizes, etc.)
- Keep the same token mappings but allow different semantic interpretations
- Maintain consistent mode names (xs, sm, md, lg) across all collections
