# Guidelines for Designers

This document provides practical guidance for designers working with design tokens in the Oblique Design System, focusing on token hierarchy, naming conventions, and implementation patterns.

---

## Token Hierarchy Overview

### Layer Structure
- **`ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`** - Global tokens (system-wide foundation)
- **`ob.p.assets.logo.assets.logo.assets.assets.*`** - Primitive tokens (raw values)
- **`ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*`** - Semantic layer 1 (lightness variations)
- **`ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.*`** - Semantic layer 2 (emphasis variations) 
- **`ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.*`** - Component tokens (inherit from semantic)
- **`ob.h.list.single_item.spacing.marker_gap.list.*`** - HTML element tokens (inherit from semantic/component)

**For Component Design**: Always use **`ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.*` tokens for all color decisions in components
2. **Reference Component Tokens**: Use `ob.c.tag.container.spacing.gap.spacing.gap when working with specific components
3. **Use Other Semantic Tokens**: Use `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*` for spacing, typography, sizing (non-color tokens)
4. **Avoid Lower Layers**: Don't use `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*` or `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.*` directly in component designs
5. **Avoid Primitives**: Don't use `ob.p.assets.logo.assets.logo.assets.assets.*` tokens directly in designs
6. **Check Token Existence**: Always verify tokens exist in the actual system

---

## Real Token Examples

### **Spacing Tokens (Always Available)**
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index      (0)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index        (0.5 units)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index        (1 unit)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index        (1.5 units)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index        (2 units)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index        (2.5 units)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index       (3 units)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index       (4 units)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index       (5 units)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index       (6 units)
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index       (7 units)
```

### **Button Tokens (HTML Layer)**
```
ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list.list.list
ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list.list.list
ob.h.list.single_item.spacing.marker_gap.list.single_item.spacing.marker_gap.list.list.list
ob.h.list.single_item.spacing.marker_gap.list-label.font-size.md
```

### **Component Tokens**
```
ob.c.tag.container.spacing.gap.spacing.gap
ob.c.tag.container.spacing.gap.spacing.gap
ob.c.tag.container.spacing.gap.spacing.gap
ob.c.tag.container.spacing.gap.spacing.gap
ob.c.tag.container.spacing.gap.spacing.gap
ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap
```

### **Sizing Tokens**
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
```

### **Border & Radius Tokens**
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-width.xs
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-width.sm
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index-width.md
```

### **Typography Tokens**
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_indexSize.xs
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_indexSize.sm
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_indexSize.md
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_indexSize.lg
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_indexSize.xl
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.H1.type-scale.md.normal
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.H1.type-scale.lg.strong
```

---

## Design standard practices

### 1. **Token Validation**
- **Always verify** tokens exist in the actual JSON files
- **Search existing components** for similar token patterns
- **Check component structure** before creating new designs

### 2. **Naming Patterns**
- Use **descriptive names** that reflect function, not appearance
- Follow **hierarchical structure**: category -> property -> variant -> state
- Use **semantic values** like `sm`, `md`, `lg` rather than pixel values

### 3. **Component Design**
When designing components:
- **Reference existing patterns** from component tokens
- **Use consistent spacing** from the spacing scale
- **Apply proper color tokens** based on component type:
  - Status components: `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.*`
  - Neutral components: `ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index`

**Important**: Always use **S3 semantic tokens** in component design. S3 contains the final compiled tokens with all variations (lightness, emphasis, inversity) resolved. Never reference S1 or S2 layers directly in components.

### 4. **Common Mistakes to Avoid**
- **Creating non-existent tokens** in design specifications
- **Using primitive tokens** directly in component designs
- **Inconsistent naming** that doesn't follow established patterns
- **Missing token validation** before finalizing designs

---

## Working with Figma

### Token Studio Integration
1. **Use Variables** for all design decisions
2. **Reference semantic tokens** rather than primitive values
3. **Create component variants** that use different token values
4. **Test theme switching** to ensure proper token references

### Variable Naming
When creating Figma variables, use the exact token structure:
```
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index.stepper_mobile.z_index
ob.c.tag.container.spacing.gap.spacing.gap.spacing.gap
```

**Note**: For color tokens, always reference the **S3 semantic layer** which contains all compiled variations. This ensures you get the complete token with all theme, emphasis, and inversity variations properly resolved.

---

## Token Creation Guidelines

### When to Create New Tokens

#### Global Tokens (`ob.g.theme_configuration.viewport.mobile.theme_configuration.viewport.mobile.theme_configuration.viewport.viewport.*`)
**Create global tokens when:**
- System-wide foundation values need to be established
- Cross-theme consistency is required
- *[Work in Progress - detailed guidelines coming soon]*

#### Primitive Tokens (`ob.p.assets.logo.assets.logo.assets.assets.*`)
**Create primitive tokens when:**
- Raw values need to be stored (colors, measurements, fonts)
- Base system values require centralization
- *[Work in Progress - detailed guidelines coming soon]*

#### Semantic Tokens (`ob.s.z_index.stepper_mobile.z_index.stepper_mobile.z_index.z_index.*`)
**Create semantic tokens when:**
- Contextual meaning needs to be applied to primitives
- Theme-specific interpretations are required
- *[Work in Progress - detailed guidelines coming soon]*

#### Component Tokens (`ob.c.tag.container.spacing.gap.spacing.gap
**Create component tokens when:**
- Component-specific styling patterns emerge
- Variants within a component need systematization
- *[Work in Progress - detailed guidelines coming soon]*

#### HTML Tokens (`ob.h.list.single_item.spacing.marker_gap.list.*`)
**Create HTML tokens when:**
- Element-specific styling needs standardization
- HTML semantic elements require consistent treatment
- *[Work in Progress - detailed guidelines coming soon]*

**Don't create tokens for:**
- One-off design decisions
- Values that should use existing tokens
- Unclear or ambiguous use cases

### Contribution Process
1. **Document the use case** and semantic meaning
2. **Check for existing tokens** that could serve the purpose
3. **Follow naming conventions** consistently
4. **Test across themes** and contexts
5. **Update this document** with new examples

---

## Related Documentation

- [Token Consumption Guidelines](./guidelines-token-consumption.md) - Detailed rules for developers
- [Color Tokens](./colors/colors-overview.md) - Complete color system reference
- [Architecture](./architecture.md) - Token hierarchy and structure
- [Theming](./theming.md) - Theme switching and variations

---

*Last updated: August 5, 2025 - Created with actual token examples from codebase*
