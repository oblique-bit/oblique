# Button Component - Complete Implementation

**Generated:** September 26, 2025  
**Source:** Figma MCP extraction from button/button_label_icon component  
**Variants:** 24 complete button combinations

## Overview

This document contains the complete React/TypeScript implementation of the button component system generated from Figma. The code represents a sophisticated button component with 24 variants covering all combinations of type, state, and inversity modes.

## Component Structure

### Core Interface

```typescript
interface ButtonButtonLabelIconProps {
  showIconLeft?: boolean;
  showIconRight?: boolean;
  label?: string;
  focus?: boolean;
  swapIconLeft?: React.ReactNode | null;
  swapIconRight?: React.ReactNode | null;
  type?: "primary" | "secondary" | "tertirary";  // Note: "tertirary" matches Figma naming
  state?: "regular" | "hover" | "pressed" | "disabled";
  inversity?: "normal" | "flipped";
  flipped?: "on" | "off";
  disabled?: "on" | "off";
}
```

### Variant Matrix

The component supports **24 unique combinations**:

| Type | State | Inversity | Flipped | Disabled | Total Combinations |
|------|-------|-----------|---------|----------|------------------|
| primary | regular, hover, pressed, disabled | normal, flipped | on, off | on, off | 8 combinations |
| secondary | regular, hover, pressed, disabled | normal, flipped | on, off | on, off | 8 combinations |
| tertiary | regular, hover, pressed, disabled | normal, flipped | on, off | on, off | 8 combinations |
| **Total** | | | | | **24 combinations** |

## Design Token Integration

The generated code references comprehensive Oblique design system tokens:

### Color Tokens
- `ob/h/button/color/fg/primary/inversity_normal/enabled: #ffffff`
- `ob/h/button/color/bg/primary/inversity_normal/enabled: #2379a4`
- `ob/h/button/color/border/primary/inversity_normal/enabled: #00000000`

### Spacing Tokens
- `ob/h/button/label_icon/spacing/gap: 6`
- `ob/h/button/label_icon/spacing/padding/horizontal: 12`
- `ob/h/button/label_icon/spacing/padding/vertical: 6`

### Typography Tokens
- `ob/s/static/font_family/body: Noto Sans`
- `ob/s/dynamic/fontSize/md: 17`
- `ob/s/dynamic/font_weight/medium: 500`

### Interactive Tokens
- `ob/s3/color/interaction/focus_ring/inversity_normal: #8b5cf6`
- `ob/s3/color/neutral/shadow/first: #131b220d`

## Asset Management

The component includes **24 SVG assets** served from the Figma MCP server:
- Icons automatically generated for each button variant
- Localhost URLs: `http://localhost:3845/assets/[hash].svg`
- Icon coffee component with proper scaling and positioning

## Implementation Features

### 1. Complete Type Safety
- Full TypeScript interface with all props properly typed
- Comprehensive JSDoc documentation
- Props validation for all 24 variants

### 2. Icon Slot System
```typescript
{showIconLeft && (
  <div className="icon_slot_left" data-node-id="...">
    {swapIconLeft || <DefaultIconComponent />}
  </div>
)}
```

### 3. Tailwind CSS Integration
- Exact color values from design tokens
- Proper spacing using design system values
- Shadow effects for hover states
- Focus ring implementation
- Responsive sizing

### 4. Accessibility Features
- `aria-hidden` for decorative elements
- Proper semantic structure
- Focus management
- Screen reader friendly

### 5. Figma Sync Preservation
- All components include `data-node-id` attributes
- Maintains connection to Figma source
- Supports design-development synchronization

## Usage Examples

### Basic Usage
```tsx
<ButtonButtonLabelIcon 
  label="Click Me" 
  type="primary" 
  state="regular" 
/>
```

### With Custom Icon
```tsx
<ButtonButtonLabelIcon 
  label="Save Document" 
  type="secondary"
  showIconLeft={true}
  swapIconLeft={<SaveIcon />}
/>
```

### Disabled State
```tsx
<ButtonButtonLabelIcon 
  label="Unavailable" 
  type="primary"
  state="disabled"
  disabled="on"
/>
```

## Key Implementation Notes

1. **forceCode Parameter**: This component was generated using `forceCode: true` due to its complexity with 24 variants
2. **Asset Dependencies**: Icons are served from Figma MCP server on localhost:3845
3. **Token Integration**: Direct mapping to Oblique design system token architecture
4. **Variant Logic**: Each variant uses precise conditional rendering based on prop combinations
5. **Fallback Behavior**: Defaults to primary/regular/normal state when no specific variant matches

## Files Generated

- `ButtonLabelIcon.tsx` - Complete React component implementation
- `button-figma-extracted.md` - This documentation file
- Associated asset references (24 SVG files)

## Next Steps

To integrate this component into the design system:

1. **Move to component library**: Transfer to `src/lib/components/`
2. **Add Angular adaptation**: Create Angular equivalent following existing patterns
3. **Token validation**: Verify all referenced tokens exist in current token files
4. **Asset optimization**: Consider bundling/optimizing the 24 SVG assets
5. **Testing**: Add comprehensive unit tests for all 24 variants
6. **Documentation**: Update component documentation with usage guidelines

## Related Files

- `button-overview.md` - Existing button specification
- `implementation-summary.md` - Current implementation status
- `../token-decisions/flex-direction-token-decision-log.md` - Previous implementation decisions

---

*This implementation represents the complete extraction of the Figma button/button_label_icon component system, demonstrating successful design-to-code workflow using Figma MCP integration.*