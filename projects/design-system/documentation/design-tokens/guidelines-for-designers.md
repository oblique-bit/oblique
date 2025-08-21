# Guidelines for Designers

This document provides practical guidance for designers working with design tokens in the Oblique Design System, focusing on token hierarchy, naming conventions, and implementation patterns.

---

## Token Hierarchy Overview

### Layer Structure
- **`ob.g.*`** - Global tokens (system-wide foundation)
- **`ob.p.*`** - Primitive tokens (raw values)
- **`ob.s.*`** - Semantic tokens (inherit from primitives)
- **`ob.c.*`** - Component tokens (inherit from semantic)
- **`ob.h.*`** - HTML element tokens (inherit from semantic/component)

### Design Workflow

1. **Start with Semantic Tokens**: Use `ob.s.*` tokens for most design decisions
2. **Reference Component Tokens**: Use `ob.c.*` when working with specific components
3. **Avoid Primitives**: Don't use `ob.p.*` tokens directly in designs
4. **Check Token Existence**: Always verify tokens exist in the actual system

---

## Real Token Examples

### **Spacing Tokens (Always Available)**
```
ob.s.spacing.none      (0)
ob.s.spacing.xs        (0.5 units)
ob.s.spacing.sm        (1 unit)
ob.s.spacing.md        (1.5 units)
ob.s.spacing.lg        (2 units)
ob.s.spacing.xl        (2.5 units)
ob.s.spacing.2xl       (3 units)
ob.s.spacing.3xl       (4 units)
ob.s.spacing.4xl       (5 units)
ob.s.spacing.5xl       (6 units)
ob.s.spacing.6xl       (7 units)
```

### **Button Tokens (HTML Layer)**
```
ob.h.button.spacing.with-text.padding.horizontal.md
ob.h.button.spacing.with-text.padding.vertical.md
ob.h.button.spacing.with-text.gap.md
ob.h.button.typography.text-label.font-size.md
```

### **Component Tokens**
```
ob.c.badge.color.bg.info.enabled
ob.c.badge.color.fg.info.enabled
ob.c.tooltip.spacing.padding-top
ob.c.tooltip.spacing.padding-right
ob.c.infobox.spacing.padding-left
ob.c.tag.spacing.padding.horizontal.md
```

### **Sizing Tokens**
```
ob.s.size.none
ob.s.size.nano
ob.s.size.micro
ob.s.size.tiny
ob.s.size.compact
ob.s.size.normal
ob.s.size.spacious
ob.s.size.hefty
ob.s.size.ultra
```

### **Border & Radius Tokens**
```
ob.s.radii.none
ob.s.radii.sm
ob.s.radii.md
ob.s.radii.lg
ob.s.radii.round
ob.s.border-width.xs
ob.s.border-width.sm
ob.s.border-width.md
```

### **Typography Tokens**
```
ob.s.fontSize.xs
ob.s.fontSize.sm
ob.s.fontSize.md
ob.s.fontSize.lg
ob.s.fontSize.xl
ob.s.typography.type-scale.md.normal
ob.s.typography.type-scale.lg.strong
```

---

## Design Best Practices

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
  - Status components: `ob.s2.color.status.*`
  - Interactive components: `ob.s3.color.interaction.*`
  - Neutral components: `ob.s2.color.neutral.*`

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
ob.s.spacing.md
ob.s.color.interaction.emphasis-high.bg-base
ob.c.button.spacing.padding.horizontal.md
```

---

## Token Creation Guidelines

### When to Create New Tokens

#### Global Tokens (`ob.g.*`)
**Create global tokens when:**
- System-wide foundation values need to be established
- Cross-theme consistency is required
- *[Work in Progress - detailed guidelines coming soon]*

#### Primitive Tokens (`ob.p.*`)
**Create primitive tokens when:**
- Raw values need to be stored (colors, measurements, fonts)
- Base system values require centralization
- *[Work in Progress - detailed guidelines coming soon]*

#### Semantic Tokens (`ob.s.*`)
**Create semantic tokens when:**
- Contextual meaning needs to be applied to primitives
- Theme-specific interpretations are required
- *[Work in Progress - detailed guidelines coming soon]*

#### Component Tokens (`ob.c.*`)
**Create component tokens when:**
- Component-specific styling patterns emerge
- Variants within a component need systematization
- *[Work in Progress - detailed guidelines coming soon]*

#### HTML Tokens (`ob.h.*`)
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
- [Color Tokens](./colors/colors.md) - Complete color system reference
- [Architecture](./architecture.md) - Token hierarchy and structure
- [Theming](./theming.md) - Theme switching and variations

---

*Last updated: August 5, 2025 - Created with actual token examples from codebase*
