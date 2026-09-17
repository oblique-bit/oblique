# Token Naming Conventions

**Purpose**: Naming standards and patterns for design tokens  
**Audience**: Design system maintainers, developers, designers  
**Related**: [Architecture](01-architecture.md) | [Token Types](../02-token-tiers/00-overview.md)

---

## **Token Naming Patterns**

### **Core Patterns**

**Semantic Token Pattern:**
```
ob.{semantic_level}.{type}.{category}.{property}.{variant}
```

**Component Token Pattern:**
```
ob.{component_level}.{component}.{type}.{property}.{variant}.{state}
```

**Global Token Pattern:**
```
ob.g.{type}.{property}.{variant}
```

The `{type}` segment identifies the token's data type (`color`, `dimension`, `typography`, etc.) and must be present in every token path. For the full list of valid types, their mapping to `$type` in JSON, and tooling compatibility, see [Token Types](../02-token-tiers/00-overview.md).

### **Standard Token Hierarchy**
```
ob.s.type.component.property.variant.state
│  │  │    │         │        │       │
│  │  │    │         │        │       └─ State (hover, focus, active)
│  │  │    │         │        └─ Variant (primary, secondary, etc.)
│  │  │    │         └─ Property (bg, fg, border, etc.)
│  │  │    └─ Component (button, input, etc.)
│  │  └─ Type (color, dimension, etc.)
│  └─ Level (s1, s2, s for semantic layers)
└─ Design System prefix
```

---

## **Naming Guidelines**

### **Core Rules**
1. **Singular naming** - Use `color` not `colors`
2. **Lowercase only** - All segments lowercase (exception: Tokens Studio `$type` values — see [Tokens Studio `$type` Exceptions](#tokens-studio-type-exceptions) below)
3. **Hyphen separation** - Connect compound words with hyphens in file paths
4. **Underscore compounds** - Use underscores for multi-word identifiers within tokens
5. **Two words max** - Keep compound terms concise
6. **Hierarchical order** - Follow established segment order
7. **Reference hierarchy** - Follow proper reference chain (`Component → Semantic → Primitive`), with `ob.g.*` tokens being the exception

### **Tokens Studio `$type` Exceptions** {#tokens-studio-type-exceptions}

The `$type` field in token JSON files is controlled by **Tokens Studio conventions**, not Oblique naming rules. These identifiers must match exactly what Tokens Studio expects — changing them to snake_case will cause the token to fall back to `other` type, breaking Figma export.

> **Do not rename `$type` values during naming consistency cleanup.** Only token path segments are in scope for renaming.

Tokens Studio uses camelCase for all unofficial (non-W3C) type identifiers:

| `$type` value | Figma output | Rename? |
|---|---|---|
| `boxShadow` | **Effect Style** — must be exactly `boxShadow` | never |
| `fontFamilies` | String variable | never |
| `fontSizes` | Number variable | never |
| `fontWeights` | Number variable | never |
| `lineHeights` | Number variable | never |
| `letterSpacing` | Number variable | never |
| `paragraphSpacing` | Number variable | never |
| `textCase` | String variable | never |
| `textDecoration` | String variable | never |
| `borderRadius` | Number variable | never |
| `borderWidth` | Number variable | never |
| `cubicBezier` | Not exported | never |
| `composition` | Not exported (plugin-only) | never |

**`boxShadow` is particularly critical**: Tokens Studio exports `boxShadow` tokens as Figma **Effect Styles**, not Variables. If the `$type` is changed (e.g. to `box_shadow`), Tokens Studio does not recognise it and the Effect Style is not created. The path segment for shadow tokens uses `shadow` (snake_case) while the `$type` remains `boxShadow` — this is the documented mapping, not an error.

The token **path segment** for these types follows Oblique's snake_case rule as normal. Only the `$type` value is exempt:

```json
{
  "ob": {
    "s": {
      "shadow": {
        "md": {
          "$type": "boxShadow",
          "$value": { ... }
        }
      }
    }
  }
}
```

Here `shadow` (path segment) is snake_case per Oblique convention; `boxShadow` (`$type`) is camelCase per Tokens Studio convention. Both are correct.

### **Layer-Specific Patterns**

#### **Primitive Tokens** - Describe appearance
- **Pattern**: `ob.p.{type}.{name}.{variation}`
- **Examples**: `ob.p.color.red.50`, `ob.p.dimension.px.16`
- **Rule**: Describe *what it looks like*

#### **Semantic Tokens** - Describe intent  
- **Pattern**: `ob.s{level}.{type}.{purpose}.{property}`
- **Examples**: `ob.s.color.neutral.fg.contrast_high`, `ob.s1.color.status.critical.fg`
- **Rule**: Describe *why it's used*

#### **Component Tokens** - Describe usage
- **Pattern**: `ob.c.{component}.{element}.{property}.{variant}.{state}` (custom components) or `ob.h.{element}.{property}.{variant}` (HTML elements)
- **Examples**: `ob.h.link.color.hover`, `ob.c.{component}.border.focus`
- **Rule**: Describe *component-specific styling*

#### **Consumer Usage Names (Token-Safe)**
For usage-facing naming that is read by system consumers, prefer concise underscore identifiers.

- **Pattern**: `{usage_name}` using lowercase + underscore
- **Example usage names** (for a component with multiple presentation contexts): `static`, `component`, `inline_text`
- **Rule**: Keep technical variable modes and implementation details out of the primary usage label.

For backward compatibility, existing technical token paths may still use legacy segment names.
When this happens, document the mapping explicitly:

- `static` -> `ob.c.{component}.static.*`
- `component` -> `ob.c.{component}.component.*`
- `inline_text` -> `ob.c.{component}.inline_text.*`

> **`inline_text` spacing note**: The horizontal gap between the icon and adjacent text is provided by a literal space character inserted by the consumer (`<ob-icon/> label`). This spacing is font-metric-driven (space glyph width) and cannot be tokenized. Token-driven gap control would require a flex container, which changes the layout contract from inline to block—not appropriate for inline text flow.

---

## **Primitive vs Semantic Naming**

**Primitive = Appearance** → Describe *what it looks like*  
**Semantic = Intent** → Describe *why it's used*

This separation ensures clean abstraction levels and future-proof naming:

### **Correct Pattern**
```
ob.p.color.basic.transparent  → transparent (visual appearance)
ob.s.color.neutral.no_color   → references basic.transparent (semantic intent)
ob.c.{component}.bg.secondary → references neutral.no_color (component usage)
```

### **Benefits**
- **Primitive**: Describes visual appearance ("transparent", "blue", "large")
- **Semantic**: Describes usage intent ("no_color", "primary", "emphasis_high")  
- **Component**: Describes component-specific styling, not visual appearance
- **Future-proof**: Changes to semantic meaning won't break component references
- **Timeless naming**: Remains valid regardless of visual changes

### **Example Application**
- **Primitive**: `transparent` → transparent *(what it looks like)*
- **Semantic**: `no_color` → references transparent *(why it's transparent)*
- **Component**: `{component}.bg.secondary` → references no_color *(semantic usage)*

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

#### **Property Compounds** (token path segments — snake_case)
- `border_radius` / `font_family` / `font_size` / `font_weight`
- `line_height` / `letter_spacing` / `text_decoration`

> These are **path segment** names, not `$type` values. The corresponding `$type` values use Tokens Studio's camelCase convention (`lineHeights`, `letterSpacing`, etc.) — see [Tokens Studio `$type` Exceptions](#tokens-studio-type-exceptions).

---

## **Reference Patterns**

### **Valid Reference Hierarchy**
```
ob.h.link.color.hover → {ob.s.color.interaction.contrast_levels.fg.low.inversity_normal}
ob.s.color.interaction.contrast_levels.fg.low.inversity_normal → {ob.s2.color.interaction.contrast_levels.fg.low.inversity_normal}
ob.s2.color.interaction.contrast_levels.fg.low.inversity_normal → {ob.s1.color.interaction.emphasis_low.fg_base.contrast_low.inversity_normal}
ob.s1.color.interaction.emphasis_low.fg_base.contrast_low.inversity_normal → {ob.p.color.cobalt.600}
```

### **Invalid Reference Patterns**
```
ob.h.link.color.hover → {ob.p.color.cobalt.600}                                          (skipping semantic layer)
ob.p.color.cobalt.600 → {ob.s.color.interaction.contrast_levels.fg.low.inversity_normal} (primitive referencing semantic)
ob.s2.color.interaction.contrast_levels.fg.low.inversity_normal → {ob.s.color.interaction.contrast_levels.fg.low.inversity_normal} (S2 referencing ob.s)
```

### **Global Token Exception**
```
ob.s.dimension.dynamic.ui_scale.element.md.px → roundTo({ob.p.dimension.px.8} * {ob.g.mode_collection.ui_scale.multiplier.dimension.md}, 2) * 1px
```
A semantic token may reference a global token (`ob.g.*`) directly alongside a primitive, in the same formula — global tokens are the one exception to the reference hierarchy, referenceable from any layer.

---

## **Style Dictionary Integration**

Style Dictionary preserves the underscore format in CSS variables, eliminating transformation complexity:

### **CSS Variable Output**
```scss
/* Correct: Underscore format preserved */
a {
  color: var(--ob-h-link-color-default);
  outline-color: var(--ob-s-color-interaction-focus_ring-inversity_normal);
}
```

### **Token Studio → CSS Consistency**
- **Token Studio**: `ob.s.color.neutral.fg.contrast_high.inversity_normal`
- **Figma Variable**: `ob.s.color.neutral.fg.contrast_high.inversity_normal`  
- **CSS Variable**: `--ob-s-color-neutral-fg-contrast_high-inversity_normal`

Only the path separators change (`.` to `-`), while compound identifiers remain unchanged.

---

## **Category-Specific Naming**

### **Color Tokens**
- **Structure**: `ob.{layer}.color.{color_name}.{shade}`
- **Examples**: `ob.p.color.red.500`, `ob.s.color.neutral.fg.contrast_high.inversity_normal`
- **Modes**: Handled through S1 lightness layer (light/dark)

### **Dimension Tokens**  
- **Structure**: `ob.{layer}.dimension.{size_name}`
- **Examples**: `ob.p.dimension.px.16`, `ob.s.dimension.dynamic.ui_scale.element.md.px`
- **Modes**: Handled through ui_scale modes (sm/md/lg)

### **Typography Tokens**
- **Structure**: `ob.{layer}.typography.{property}.{variant}`
- **Examples**: `ob.p.font_size_unitless.400`, `ob.h.typography.context.h1.font_size`
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