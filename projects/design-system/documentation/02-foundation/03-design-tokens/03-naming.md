# Token Naming Conventions

**Purpose**: Comprehensive naming standards and patterns for design tokens  
**Audience**: Design system maintainers, developers, designers  
**Related**: [Architecture](./02-architecture.md) | [Token Types](./04-token-types.md)

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

The `{type}` segment identifies the token's data type (`color`, `dimension`, `typography`, etc.) and must be present in every token path. For the full list of valid types, their mapping to `$type` in JSON, and tooling compatibility, see [Token Types](./04-token-types.md).

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
| `boxShadow` | **Effect Style** — must be exactly `boxShadow` | ❌ never |
| `fontFamilies` | String variable | ❌ never |
| `fontSizes` | Number variable | ❌ never |
| `fontWeights` | Number variable | ❌ never |
| `lineHeights` | Number variable | ❌ never |
| `letterSpacing` | Number variable | ❌ never |
| `paragraphSpacing` | Number variable | ❌ never |
| `textCase` | String variable | ❌ never |
| `textDecoration` | String variable | ❌ never |
| `borderRadius` | Number variable | ❌ never |
| `borderWidth` | Number variable | ❌ never |
| `cubicBezier` | Not exported | ❌ never |
| `composition` | Not exported (plugin-only) | ❌ never |

**`boxShadow` is particularly critical**: Tokens Studio exports `boxShadow` tokens as Figma **Effect Styles**, not Variables. If the `$type` is changed (e.g. to `box_shadow`), Tokens Studio does not recognise it and the Effect Style is not created. The path segment for shadow tokens uses `shadow` (snake_case) while the `$type` remains `boxShadow` — this is the documented mapping, not an error.

The token **path segment** for these types follows Oblique's snake_case rule as normal. Only the `$type` value is exempt:

```json
{
  "ob": {
    "s": {
      "shadow": {
        "elevation_low": {
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
- **Examples**: `ob.p.color.red.50`, `ob.p.dimension.base`
- **Rule**: Describe *what it looks like*

#### **Semantic Tokens** - Describe intent  
- **Pattern**: `ob.s{level}.{type}.{purpose}.{property}`
- **Examples**: `ob.s.color.primary.bg`, `ob.s1.color.critical.fg`
- **Rule**: Describe *why it's used*

#### **Component Tokens** - Describe usage
- **Pattern**: `ob.c.{component}.{element}.{property}.{variant}.{state}`
- **Examples**: `ob.c.button.bg.primary.hover`, `ob.c.input.border.focus`
- **Rule**: Describe *component-specific styling*

#### **Consumer Usage Names (Token-Safe)**
For usage-facing naming that is read by system consumers, prefer concise underscore identifiers.

- **Pattern**: `{usage_name}` using lowercase + underscore
- **Approved icon usage names**:
  - `static`
  - `component`
  - `inline_text`
- **Rule**: Keep technical variable modes and implementation details out of the primary usage label.

For backward compatibility, existing technical token paths may still use legacy segment names.
When this happens, document the mapping explicitly:

- `static` -> `ob.c.icon.static.*`
- `component` -> `ob.c.icon.component.*`
- `inline_text` -> `ob.c.icon.inline_text.*`

> **`inline_text` spacing note**: The horizontal gap between the icon and adjacent text is provided by a literal space character inserted by the consumer (`<ob-icon/> label`). This spacing is font-metric-driven (space glyph width) and cannot be tokenized. Token-driven gap control would require a flex container, which changes the layout contract from inline to block—not appropriate for inline text flow.

---

## **Primitive vs Semantic Naming**

**Primitive = Appearance** → Describe *what it looks like*  
**Semantic = Intent** → Describe *why it's used*

This separation ensures clean abstraction levels and future-proof naming:

### **Correct Pattern**
```
ob.p.color.transparent     → rgba(0, 0, 0, 0) (visual appearance)
ob.s.color.no_color      → references transparent (semantic intent)
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

#### **Property Compounds** (token path segments — snake_case)
- `border_radius` / `font_family` / `font_size` / `font_weight`
- `line_height` / `letter_spacing` / `text_decoration`

> These are **path segment** names, not `$type` values. The corresponding `$type` values use Tokens Studio's camelCase convention (`lineHeights`, `letterSpacing`, etc.) — see [Tokens Studio `$type` Exceptions](#tokens-studio-type-exceptions).

---

## **Reference Patterns**

### **Valid Reference Hierarchy**
```
✔️ ob.h.button.bg.primary → {ob.s.color.primary}
✔️ ob.s.color.primary → {ob.p.color.blue.500}
✔️ ob.s2.dimension.lg → {ob.p.dimension.base} * {ob.g.multiplier.dimension.lg}
✔️ ob.c.tooltip.spacing → {ob.s.spacing.xs}
✔️ ob.s1.color.primary → {ob.p.color.blue.500} (lightness layer)
```

### **Invalid Reference Patterns**
```
❌ ob.h.button.bg.primary → {ob.p.color.blue.500}  (skipping semantic layer)
❌ ob.p.color.blue.500 → {ob.s.color.primary}      (primitive referencing semantic)
❌ ob.s2.color.text → {ob.s.color.primary}         (S2 referencing ob.s)
```

### **Global Token Exception**
```
✔️ ob.s.dimension.lg → {ob.g.multiplier.dimension.lg}
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
  background-color: var(--ob-s-color-primary-bg-contrast_high-inversity_normal);
  border-radius: var(--ob-c-button-border_radius-primary);
  font-weight: var(--ob-s-typography-font_weight-emphasis_high);
}
```

### **Token Studio → CSS Consistency**
- **Token Studio**: `ob.s.color.primary.bg.contrast_high.inversity_normal`
- **Figma Variable**: `ob.s.color.primary.bg.contrast_high.inversity_normal`  
- **CSS Variable**: `--ob-s-color-primary-bg-contrast_high-inversity_normal`

Only the path separators change (`.` to `-`), while compound identifiers remain unchanged.

---

## **Category-Specific Naming**

### **Color Tokens**
- **Structure**: `ob.{layer}.color.{color_name}.{shade}`
- **Examples**: `ob.p.color.red.50`, `ob.s.color.primary.bg`
- **Modes**: Handled through S1 lightness layer (light/dark)

### **Dimension Tokens**  
- **Structure**: `ob.{layer}.dimension.{size_name}`
- **Examples**: `ob.p.dimension.xs`, `ob.s.dimension.button_height`
- **Modes**: Handled through component-size modes (sm/md/lg)

### **Typography Tokens**
- **Structure**: `ob.{layer}.typography.{property}.{variant}`
- **Examples**: `ob.p.typography.font_size.lg`, `ob.s.typography.heading.h1`
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