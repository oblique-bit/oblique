# Variable-Based Sizing System for Oblique Components

**Version:** 1.0  
**Date:** September 2, 2025  
**Status:** Work in Progress - Not Yet Approved by Product Owner  
**Purpose:** Implementation of variable-based sizing for Oblique components to replace size variants

## **Target Audience**
**Primary:** DS/Oblique Developers, DS/Oblique Designers  
**Secondary:** Component Architects, Token System Maintainers  
**Prerequisites:** Understanding of Figma variables, component architecture, design token systems  
**Related Personas:** [Design System Personas](../../02-foundation/02-personas.md)

## Overview
This document outlines the implementation of variable-based sizing for Oblique's 4 core components (Button, Badge, Tag, Pill) to replace size variants and enable semantic flexibility while reducing variant explosion.

## Strategic Context
Based on the [Variables vs Variants Strategic Analysis](./07-figma-variables-vs-variants-strategic-analysis.md), moving sizing from variants to variables reduces potential variants by 75% while enabling semantic differentiation per component.

## Existing Token Architecture Analysis

### Current Size-Aware Components
- **Button**: `sm`, `md`, `lg` (in `/themes/html/button/`)
- **Badge**: `sm`, `lg` (in `/themes/component/atoms/badge.json`)  
- **Pill**: `sm`, `md`, `lg` (in `/themes/component/molecules/pill.json`)
- **Tag**: `sm`, `md`, `lg` (in `/themes/component/molecules/tag.json`)

### Existing Token Resources

#### 1. Semantic Sizing Scale (from `semantic/sizing.json`)
```
none → nano → micro → tiny → teensy → smol → compact → neat → cozy → snug → 
normal → roomy → stretchy → generous → spacious → chubby → bulky → hefty → 
max → ultra → mega → giga → hyper → supernova
```

**Currently Used by Components:**
- `stretchy` (250px) - Badge sm, Pill sm, Tag sm
- `spacious` (300px) - Pill md, Tag md  
- `hefty` (450px) - Pill lg, Tag lg
- `normal` (200px) - Badge sizes

#### 2. Semantic Spacing Scale (from `semantic/spacing/desktop.json`)
```
none → xs → sm → md → lg → ml → xl → 2xl → 3xl → 4xl → 5xl → 6xl → 7xl → 8xl
```

**Currently Used by Components:**
- Padding: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`
- Gap: `sm`, `md`, `lg`

## Variable Collection Architecture

### Component-Specific Variable Collections
Create 4 separate variable collections that allow semantic sizing differences:

#### 1. Button-Sizes Collection
```
Modes: sm | md | lg

Size Properties:
- min-height: compact | spacious | hefty
- padding-horizontal: lg | xl | 2xl  
- padding-vertical: xs | sm | md
- icon-size: xs | xs | sm
- icon-gap: sm | md | lg
- typography: xs | md | md
- min-width: neat | roomy | generous
```

#### 2. Badge-Sizes Collection  
```
Modes: sm | lg

Size Properties:
- height: normal | stretchy
- min-width: normal | stretchy
- max-width: normal | ultra
- padding-horizontal: sm | md
- padding-vertical: sm | md
- typography: sm-strong | sm-strong
```

#### 3. Pill-Sizes Collection
```
Modes: sm | md | lg

Size Properties:
- min-height: stretchy | spacious | hefty
- padding-horizontal: lg | xl | 3xl
- padding-vertical: xs | sm | lg
- icon-size: xs | xs | sm
- icon-gap: sm | md | lg
- typography: xs | md | md
```

#### 4. Tag-Sizes Collection
```
Modes: sm | md | lg

Size Properties:  
- min-height: stretchy | spacious | hefty
- padding-horizontal: md | lg | 2xl
- padding-vertical: none | xs | lg
- icon-size: xs | xs | sm
- icon-gap: sm | md | lg
- typography: xs | sm | md
```

## Implementation Benefits

### 1. Semantic Flexibility
- **Button sm ≠ Badge sm**: Different components can have semantically appropriate sizing
- **Consistent Experience**: Size selection (sm/md/lg) remains consistent across components
- **Context-Aware**: Each component improved for its specific use cases

### 2. Token Reuse
- **100% Existing Tokens**: All size values use existing semantic sizing/spacing tokens
- **No New Dependencies**: Builds on established token architecture
- **Consistent Scale**: Maintains design system coherence

### 3. Variant Reduction
- **Before**: 4 sizes × N variants = 4N total variants per component
- **After**: N variants + 1 size variable collection = N + 1 entities per component
- **Result**: ~75% reduction in variant count system-wide

## Technical Implementation

### Variable Structure
```
Collection: Button-Sizes
├── Mode: sm
│   ├── button/min-height → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
│   ├── button/padding-h → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
│   └── button/padding-v → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
├── Mode: md  
│   ├── button/min-height → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
│   ├── button/padding-h → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
│   └── button/padding-v → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
└── Mode: lg
    ├── button/min-height → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
    ├── button/padding-h → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
    └── button/padding-v → {ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index}
```

### Token Mapping Strategy
1. **Height/Min-Height**: Use semantic sizing tokens (`stretchy`, `spacious`, `hefty`)
2. **Padding**: Use semantic spacing tokens (`xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`)
3. **Icons**: Use existing icon size tokens (`xs`, `sm`)
4. **Typography**: Use existing type scale tokens

### Migration Path
1. **Phase 1**: Create variable collections with existing token mappings
2. **Phase 2**: Update component variants to consume size variables
3. **Phase 3**: Remove size-specific variants, keeping functional variants only
4. **Phase 4**: Validate cross-component consistency and semantic appropriateness

## Cross-Component Size Comparison

| Size | Button Min-Height | Badge Height | Pill Min-Height | Tag Min-Height |
|------|------------------|--------------|-----------------|----------------|
| **sm** | compact (100px) | normal (200px) | stretchy (250px) | stretchy (250px) |
| **md** | spacious (300px) | - | spacious (300px) | spacious (300px) |
| **lg** | hefty (450px) | stretchy (250px) | hefty (450px) | hefty (450px) |

*Note: Different values per component enable semantic appropriateness while maintaining consistent size selection UX*

## Next Steps
1. **Validate Token Mappings**: Ensure all referenced tokens exist and have correct values
2. **Create Variable Collections**: Set up Figma variable collections with mode structure
3. **Map Component Properties**: Connect component layers to appropriate size variables
4. **Test Semantic Relationships**: Verify size relationships make sense in context
5. **Document Usage Guidelines**: Create guidance for when to use each size per component

## Related Documentation
- [Variables vs Variants Strategic Analysis](./07-figma-variables-vs-variants-strategic-analysis.md)
- [Component Token Architecture](../../03-design-tokens/)
- [Sizing System Guidelines](../../03-design-tokens/responsiveness.md)

---
*This variable-based sizing system enables semantic flexibility while building on Oblique's existing token architecture and reducing system complexity.*
