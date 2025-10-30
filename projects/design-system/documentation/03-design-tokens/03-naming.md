# Token Naming Conventions

**Purpose**: Comprehensive naming standards and patterns for design tokens  
**Audience**: Design system maintainers, developers, designers  
**Related**: [Architecture](./02-architecture.md) | [Token Types](./01-token-types.md)

---

## **Token Naming Patterns**

### **Core Patterns**

**Semantic Token Pattern:**
```
ob.{semantic_level}.{category}.{subcategory}.{property}.{variant}
```

**Component Token Pattern:**
```
ob.{component_level}.{component}.{category}.{property}.{variant}.{state}
```

**Global Token Pattern:**
```
ob.g.{category}.{property}.{variant}
```

### **Standard Token Hierarchy**
```
ob.s.category.component.property.variant.state
│  │  │       │         │        │       │
│  │  │       │         │        │       └─ State (hover, focus, active)
│  │  │       │         │        └─ Variant (primary, secondary, etc.)
│  │  │       │         └─ Property (bg, fg, border, etc.)
│  │  │       └─ Component (button, input, etc.)
│  │  └─ Category (color, dimension, etc.)
│  └─ Level (s1, s2, s3 for semantic layers)
└─ Design System prefix
```

---

## **Naming Guidelines**

### **Core Rules**
1. **Singular naming** - Use `color` not `colors`
2. **Lowercase only** - All segments lowercase
3. **Hyphen separation** - Connect compound words with hyphens in file paths
4. **Underscore compounds** - Use underscores for multi-word identifiers within tokens
5. **Two words max** - Keep compound terms concise
6. **Hierarchical order** - Follow established segment order
7. **Reference hierarchy** - Follow proper reference chain (`Component → Semantic → Primitive`), with `ob.g.*` tokens being the exception

### **Layer-Specific Patterns**

#### **Primitive Tokens** - Describe appearance
- **Pattern**: `ob.p.{category}.{name}.{variation}`
- **Examples**: `ob.p.color.red.50`, `ob.p.dimension.base`
- **Rule**: Describe *what it looks like*

#### **Semantic Tokens** - Describe intent  
- **Pattern**: `ob.s{level}.{category}.{purpose}.{property}`
- **Examples**: `ob.s3.color.primary.bg`, `ob.s1.color.critical.fg`
- **Rule**: Describe *why it's used*

#### **Component Tokens** - Describe usage
- **Pattern**: `ob.c.{component}.{element}.{property}.{variant}.{state}`
- **Examples**: `ob.c.button.bg.primary.hover`, `ob.c.input.border.focus`
- **Rule**: Describe *component-specific styling*

---

## **Primitive vs Semantic Naming**

**Primitive = Appearance** → Describe *what it looks like*  
**Semantic = Intent** → Describe *why it's used*

This separation ensures clean abstraction levels and future-proof naming:

### **Correct Pattern**
```
ob.p.color.transparent     → rgba(0, 0, 0, 0) (visual appearance)
ob.s3.color.no_color      → references transparent (semantic intent)
ob.c.button.bg.secondary  → references no_color (component usage)
```

### **Benefits**
- **Primitive**: Describes visual appearance ("transparent", "blue", "large")
- **Semantic**: Describes usage intent ("no_color", "primary", "emphasis_high")  
- **Component**: Describes component-specific styling, not visual appearance
- **Future-proof**: Changes to semantic meaning won't break component references
- **Timeless naming**: Remains valid regardless of visual changes

### **Example Application**
- **Primitive**: `transparent` → rgba(0, 0, 0, 0) *(what it looks like)*
- **Semantic**: `no_color` → references transparent *(why it's transparent)*
- **Component**: `button.bg.secondary` → references no_color *(semantic usage)*

---

## **Compound Units System**

Design tokens use compound units (multi-word identifiers) with underscores for consistency across Token Studio, Figma Variables, and CSS output.

### **Current Format (Underscore)**
| Token Format | CSS Format |
|-------------|------------|
| `contrast_high` | `contrast_high` |
| `contrast_medium` | `contrast_medium` |
| `contrast_low` | `contrast_low` |
| `inversity_normal` | `inversity_normal` |
| `inversity_flipped` | `inversity_flipped` |

### **Benefits**
- **Consistent naming** across Token Studio, Figma, and CSS
- **No transformation complexity** between platforms
- **Predictable token names** for developers
- **Cross-platform compatibility** maintained

### **Key Compound Categories**

#### **Semantic Compounds**
- `inversity_normal` / `inversity_flipped`
- `emphasis_high` / `emphasis_low`
- `contrast_highest` / `contrast_high` / `contrast_medium` / `contrast_low`

#### **State Compounds**
- `bg_base` / `bg_hover` / `bg_focus` / `bg_active`
- `fg_base` / `fg_hover` / `fg_focus` / `fg_disabled`

#### **Property Compounds**
- `border_radius` / `font_family` / `font_size` / `font_weight`
- `line_height` / `letter_spacing` / `text_decoration`

---

## **Reference Patterns**

### **Valid Reference Hierarchy**
```
✔️ ob.h.button.bg.primary → {ob.s3.color.primary}
✔️ ob.s3.color.primary → {ob.p.color.blue.500}
✔️ ob.s2.dimension.lg → {ob.p.dimension.base} * {ob.g.multiplier.dimension.lg}
✔️ ob.c.tooltip.spacing → {ob.s3.spacing.xs}
✔️ ob.s1.color.primary → {ob.p.color.blue.500} (lightness layer)
```

### **Invalid Reference Patterns**
```
❌ ob.h.button.bg.primary → {ob.p.color.blue.500}  (skipping semantic layer)
❌ ob.p.color.blue.500 → {ob.s3.color.primary}      (primitive referencing semantic)
❌ ob.s2.color.text → {ob.s3.color.primary}         (S2 referencing S3)
```

### **Global Token Exception**
```
✔️ ob.s3.dimension.lg → {ob.g.multiplier.dimension.lg}
✔️ ob.c.button.padding → {ob.g.spacing.unit} * 2
```
Global tokens (`ob.g.*`) can be referenced from any layer as they provide system-wide foundation values.

---

## **Style Dictionary Integration**

Style Dictionary preserves the underscore format in CSS variables, eliminating transformation complexity:

### **CSS Variable Output**
```scss
/* Correct: Underscore format preserved */
.button {
  background-color: var(--ob-s3-color-primary-bg-contrast_high-inversity_normal);
  border-radius: var(--ob-c-button-border_radius-primary);
  font-weight: var(--ob-s3-typography-font_weight-emphasis_high);
}
```

### **Token Studio → CSS Consistency**
- **Token Studio**: `ob.s3.color.primary.bg.contrast_high.inversity_normal`
- **Figma Variable**: `ob.s3.color.primary.bg.contrast_high.inversity_normal`  
- **CSS Variable**: `--ob-s3-color-primary-bg-contrast_high-inversity_normal`

Only the path separators change (`.` to `-`), while compound identifiers remain unchanged.

---

## **Category-Specific Naming**

### **Color Tokens**
- **Structure**: `ob.{layer}.color.{color_name}.{shade}`
- **Examples**: `ob.p.color.red.50`, `ob.s3.color.primary.bg`
- **Modes**: Handled through S1 lightness layer (light/dark)

### **Dimension Tokens**  
- **Structure**: `ob.{layer}.dimension.{size_name}`
- **Examples**: `ob.p.dimension.xs`, `ob.s3.dimension.button_height`
- **Modes**: Handled through component-size modes (sm/md/lg)

### **Typography Tokens**
- **Structure**: `ob.{layer}.typography.{property}.{variant}`
- **Examples**: `ob.p.typography.font_size.lg`, `ob.s3.typography.heading.h1`
- **Modes**: Handled through typography-context (interface/prose)

---

## **Best Practices**

### **Naming Strategy**
1. **Start semantic** - Begin with semantic intent, not visual appearance
2. **Layer appropriately** - Use correct abstraction level for each token
3. **Reference properly** - Follow established hierarchy chains
4. **Think future-proof** - Consider how names will age with design changes
5. **Stay consistent** - Follow established patterns within each category

### **Common Pitfalls**
- **Don't mix abstraction levels** - Keep visual and semantic naming separate
- **Don't skip semantic layers** - Always reference through appropriate semantic tokens
- **Don't use visual names semantically** - Avoid `red_button` for semantic tokens
- **Don't break reference chains** - Maintain proper hierarchical references

### **Quality Checks**
- **Semantic names** should describe purpose, not appearance
- **Component tokens** should reference semantic tokens, not primitives
- **Primitive names** should describe visual characteristics
- **Reference chains** should follow established hierarchy patterns

---

*Token naming conventions ensure consistency, maintainability, and clarity across the entire design system.*