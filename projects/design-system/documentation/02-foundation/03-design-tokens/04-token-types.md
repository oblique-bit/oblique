# Token Types

**Purpose**: Reference for all token types used in Oblique, including tooling compatibility and standard alignment  
**Audience**: Design system maintainers, designers, engineers  
**Related**: [Architecture](./02-architecture.md) | [Token Naming](./03-naming.md)

---

## What is a token type

A token type declares the semantic category of a token's value — what kind of thing it represents. It is distinct from the value itself and from the token's name.

### Where the type lives

A token type appears in two places:

**1. In the JSON source — as `$type`**

Every token object in Oblique's theme files carries a `$type` field:

```json
{
  "background": {
    "$type": "color",
    "$value": "{ob.p.color.blue.500}"
  }
}
```

This annotation is the authoritative declaration. It controls how Tokens Studio interprets and exports the token.

**2. In the token path — as the `{type}` segment**

The same type must also appear as a segment in the token key itself (the `ob.{layer}.{type}.{...path}` structure). This ensures the type is readable without opening the JSON:

```
ob.c.button.color.background.primary
             ↑
             type = color
```

See [Requirement R1](#r1--type-must-appear-in-the-token-path) for the full rule.

### Where the type lands

Beyond the source JSON, the type determines how a token is handled downstream:

**CSS output** — Style Dictionary uses the type to format the output value. A `dimension` token gets its `px` or `rem` unit preserved; a `duration` token gets its `ms` unit. A `color` token is written as a hex or rgba value. The CSS custom property name itself does not carry the type, but the value format reflects it.

**Figma Variables** — Tokens Studio maps each `$type` to one of Figma's four variable types: Color, Number, String, or Boolean. This mapping is not always one-to-one. A `spacing` token, for example, arrives in Figma as a Number variable. The Figma variable type does not need to match the source `$type` precisely — what matters is that the token lands in Figma as a bindable variable. See [Priority Order for Type Decisions](#priority-order-for-type-decisions).

**Code (TypeScript/SCSS consumers)** — When engineers consume Oblique tokens via CSS custom properties or generated TypeScript maps, the type is readable directly from the token path. No JSON inspection required.

---

## Priority Order for Type Decisions

When a type definition conflicts across sources, apply this priority:

1. **Tokens Studio** — highest priority. Tokens Studio is the authoring tool and brokers the token-to-Figma pipeline. It supports both official W3C types and its own unofficial types. Unofficial types are auto-converted to W3C equivalents by `@tokens-studio/sd-transforms` before export.
2. **Figma Variables** — sufficient, not strict. Tokens must land in Figma as a variable — Color, Number, String, or Boolean. The Figma variable type does not need to match the source `$type` precisely. A type mismatch at this boundary (e.g. `spacing` arriving as a Number variable rather than a hypothetical Spacing variable) is acceptable. What matters is that the value is bindable.
3. **W3C DTCG specification** — reference standard, not binding when it conflicts with tooling. The spec is a draft (2nd editors' draft, June 2022) and is not yet fully adopted by Figma or Tokens Studio.

**Rule**: A token type is acceptable if it can be authored in Tokens Studio and arrives in Figma as any variable. Figma type fidelity is a nice-to-have, not a requirement.

---

## Requirements

### R1 — Type must appear in the token path

The `$type` field in JSON is only visible inside the source file. Design system consumers — engineers integrating tokens into apps, designers reading token documentation — must be able to identify a token's type from the token key alone, without inspecting the JSON.

**Requirement**: Every token path must contain the type as a path segment (the `{type}` position: `ob.{layer}.{type}.{...path}`).

```
ob.c.button.color.background.primary       ✅  type is "color"
ob.c.button.dimension.min_height           ✅  type is "dimension"
ob.c.button.spacing.padding_inline         ✅  type is "spacing"
ob.c.button.bg.primary                     ❌  type "color" is not readable from the path
ob.c.button.min_height                     ❌  type cannot be inferred
```

This makes the token path self-describing and reduces reliance on tooling to understand token intent.

### R2 — Path segment and `$type` must correspond

The `{type}` path segment and the `$type` annotation must refer to the same semantic concept. They do not need to be word-for-word identical (since `$type` is controlled by tooling conventions while the path segment is controlled by Oblique naming conventions), but the mapping must be explicit and consistent.

Defined mappings:

| Path segment | `$type` value(s) | Notes |
|--------------|------------------|-------|
| `color` | `color` | Direct match |
| `dimension` | `dimension`, `sizing`, `spacing`, `borderRadius`, `borderWidth` | All TS unofficial types that convert to `dimension` |
| `typography` | `typography`, `fontSizes`, `fontWeights`, `fontFamilies`, `lineHeights`, `letterSpacing`, `paragraphSpacing`, `textCase`, `textDecoration`, `textAlign` | Typography composite or its sub-properties |
| `duration` | `duration` | Motion timing |
| `easing` | `cubicBezier` | Motion curves |
| `shadow` | `boxShadow` | TS composite name for W3C `shadow` |
| `border` | `border` | W3C composite |
| `multiplier` | `number` | Unitless ratio or scale factor |

> **`$type` values are immutable — do not rename them.** These identifiers are Tokens Studio's internal conventions. Renaming any `$type` value (e.g. `boxShadow` → `box_shadow`) causes Tokens Studio to fall back to `other`, silently dropping the token from all Figma export pipelines. The path segment (left column) follows Oblique's snake\_case rule; the `$type` value (right column) follows Tokens Studio's camelCase convention. Both are intentional and coexist by design. See [Tokens Studio `$type` Exceptions](./03-naming.md#tokens-studio-type-exceptions) in the naming reference.

> **Note on `other`**: The `other` type (currently 172 tokens) does not map to any path segment. Tokens using `$type: other` must be audited and reassigned to a specific type with a corresponding path segment.

Per the W3C DTCG spec, type must not be inferred from the file or folder an object is stored in. The `$type` annotation is authoritative. The `{type}` path segment and `$type` must independently convey the type — neither replaces the other.

---

## Figma Variable Types (4 native types)

Figma supports only four variable types. All token values ultimately resolve to one of these:

| Figma Type | Accepts | Notes |
|------------|---------|-------|
| **Color** | Hex strings, rgba | Applied to fills, strokes, shadows, text colors |
| **Number** | Integers, decimals | Applied to corner radius, spacing, font size, font weight, opacity, stroke width, shadow values |
| **String** | Text strings | Applied to font family, font style, font weight (name), text content |
| **Boolean** | `true` / `false` | Applied to layer visibility, variant properties |

Figma has **no native type for duration, gradients, or composite tokens** (typography, shadow, border). These either resolve to multiple Number/Color variables or are handled via Figma Styles instead. For Oblique's purposes, this is not a blocking issue — tokens that arrive in Figma as a Number rather than a hypothetical Dimension variable are still usable. Figma type precision is not a requirement.

---

## Token Types Reference Table

The table below lists all types currently used in Oblique token files (via `$type`), mapped to their tooling and standard equivalents.

### Legend for support levels

- **Native** — first-class support, maps directly without transformation
- **Supported** — works in the tool; may require configuration or transforms
- **Unofficial** — tool-specific type not in W3C spec; auto-converted during build
- **Partial** — limited support; some properties may not sync
- **Not supported** — cannot be used without workaround
- **Not specified** — not defined in draft spec

---

### Color & Visual

| Oblique `$type` | W3C DTCG | Tokens Studio | Figma Variables | Notes |
|-----------------|----------|---------------|-----------------|-------|
| `color` | `color` (§8.1) | Native | **Color** | Full round-trip support. Handles light/dark via mode aliasing. |
| `boxShadow` | `shadow` (§9.5) | Unofficial composite | **Effect Style** ⚠️ | Exported as Figma Effect Style, not a Variable. The `$type` identifier must be exactly `boxShadow` (camelCase) — Tokens Studio uses this string to route the token into the Effect Style pipeline. Renaming it breaks export silently. |
| `border` | `border` (§9.3) | Supported composite | Not supported as composite | Border width and color can each bind to Number/Color variables. Style property cannot. |

---

### Dimension & Spacing (the `size` vs `sizing` issue)

> **Active inconsistency**: Oblique uses both `size` and `sizing` as path segments for the same conceptual category. Tokens Studio treats `sizing` as an unofficial type (converted to `dimension`). W3C has no `sizing` type — only `dimension`. See [decision below](#sizing-vs-size-decision).

| Oblique `$type` | W3C DTCG | Tokens Studio | Figma Variables | In Oblique | Notes |
|-----------------|----------|---------------|-----------------|------------|-------|
| `dimension` | `dimension` (§8.2) | Native | **Number** | 414 tokens | Official. Value must include `px` or `rem` unit. |
| `spacing` | Not specified | Unofficial → `dimension` | **Number** | 154 tokens | Tokens Studio–specific. Auto-converted to `dimension` by sd-transforms. Figma binds as Number. |
| `sizing` | Not specified | Unofficial → `dimension` | **Number** | 16 tokens | Tokens Studio–specific. Auto-converted to `dimension`. Path-level segment `sizing` in Oblique is a naming inconsistency — see note below. |
| `borderRadius` | Not specified | Unofficial → `dimension` | **Number** | 20 tokens | Unofficial. Converted to `dimension` on export. |
| `borderWidth` | Not specified | Unofficial → `dimension` | **Number** | 13 tokens | Unofficial. Converted to `dimension` on export. |
| `number` | (§ JSON number) | Native | **Number** | 34 tokens | Unitless. Used for multipliers, ratios, opacity. W3C treats this as a basic JSON type, not a named type. |

#### `sizing` vs `size` decision

Two distinct uses of `size`/`sizing` exist in Oblique token paths today:

- **`$type: sizing`** — the JSON token type set on 16 tokens. This is a Tokens Studio unofficial type, equivalent to `dimension`.
- **`.sizing.` path segment** — used in badge, infobox, popover, and hr tokens as the `{type}` segment to mean "the size of an element as a whole".
- **`.size.` path segment** — used in icon tokens as the `{type}` segment meaning the same thing.

Path segments and `$type` values are separate concerns. The inconsistency to fix is in the **path segments** (`.size.` vs `.sizing.`), not in the `$type` value.

**Recommendation**: Standardize path segment to `dimension` to align with both W3C and Tokens Studio (e.g. `ob.c.icon.component.dimension.lg`). This mirrors `.spacing.` and `.border_radius.` already used elsewhere. The `sizing` and `spacing` unofficial types can remain as `$type` values if needed for Tokens Studio compatibility during transition, but should be migrated to `dimension` over time.

---

### Typography

| Oblique `$type` | W3C DTCG | Tokens Studio | Figma Variables | In Oblique | Notes |
|-----------------|----------|---------------|-----------------|------------|-------|
| `typography` | `typography` (§9.7) | Supported composite | **Text Style** | 142 tokens | Figma cannot bind a full typography composite to a Variable. Tokens Studio exports it as a Figma Text Style. Individual sub-properties (fontSize, fontWeight, etc.) can each also bind to Number or String variables when exported separately. |
| `fontSizes` | `dimension` (fontSize sub-value) | Unofficial → `dimension` | **Number** | 86 tokens | Tokens Studio name. Official W3C sub-value. Figma binds as Number. |
| `fontWeights` | `fontWeight` (§8.4) | Unofficial → `fontWeight` | **Number** (numeric only) | 48 tokens | Figma supports font weight as Number variable. String weights (e.g. "bold") are not bindable as variables. |
| `fontFamilies` | `fontFamily` (§8.3) | Unofficial → `fontFamily` | **String** | 28 tokens | Figma binds as String. Must match exact installed font name. |
| `lineHeights` | Not specified | Unofficial → `number` | **Number** | 91 tokens | Not in W3C spec. Figma binds as Number (interpreted as `%`). |
| `letterSpacing` | `dimension` (sub-value) | Unofficial → `dimension` | **Number** | 67 tokens | Figma interprets letter spacing in `px`, not `%`. |
| `paragraphSpacing` | Not specified | Unofficial → `dimension` | **Number** | 79 tokens | Figma-specific text property. Not in W3C spec. |
| `textCase` | Not specified | Unofficial → `string` | **String** | 14 tokens | Not in W3C spec. |
| `textDecoration` | Not specified | Unofficial → `string` | **String** | 13 tokens | Not in W3C spec. |
| `textAlign` | Not specified | Unofficial → `string` | Not supported | 3 tokens | No Figma variable binding. Applied via Style or code only. |

---

### Animation & Motion

| Oblique `$type` | W3C DTCG | Tokens Studio | Figma Variables | In Oblique | Notes |
|-----------------|----------|---------------|-----------------|------------|-------|
| `duration` | `duration` (§8.5) | Native | Not supported | 20 tokens | Official W3C type. Value must include `ms` unit. Figma has no variable type for duration — applied via code only. |
| `cubicBezier` | `cubicBezier` (§8.6) | Native | Not supported | 10 tokens | Official W3C type. Array of 4 numbers defining a timing curve. No Figma variable binding. |

---

### Structural & Utility

| Oblique `$type` | W3C DTCG | Tokens Studio | Figma Variables | In Oblique | Notes |
|-----------------|----------|---------------|-----------------|------------|-------|
| `composition` | Not specified | Unofficial (composite) | Not exported | 78 tokens | Tokens Studio–specific composite type that bundles multiple layer properties (fill, border, shadow) into one token. No Figma Variable or Style is created. The plugin applies the bundled values directly to a selected Figma layer when used interactively. Deprecated in Tokens Studio v2+ — migration to individual typed tokens is queued. |
| `other` | Not specified | Unofficial | Not supported | 172 tokens | Generic catch-all in Tokens Studio. Not in W3C spec. Use specific types where possible. Should be audited and replaced with appropriate types. |
| `text` | (§ JSON string) | Unofficial → `string` | **String** | 7 tokens | Tokens Studio label for string/text tokens. |
| `asset` | Not specified | Unofficial | Not supported | 13 tokens | URL-based asset references. Not in W3C spec. No Figma variable binding. |
| `boolean` | (§ JSON boolean) | Native | **Boolean** | 0 tokens | Used for Figma layer visibility and variant props. W3C treats as basic JSON type. |

---

## Composite Token Figma Export Behaviour

Composite tokens cannot map to Figma Variables (Figma only accepts single-value tokens). Tokens Studio handles each composite type differently:

| `$type` | Figma output | How it works |
|---|---|---|
| `typography` | **Text Style** | Tokens Studio creates a named Figma Text Style. Each sub-property of the composite (fontFamily, fontWeight, fontSize, …) is mapped to the Style. Sub-properties can additionally be exported as individual Number/String variables when exported separately. |
| `boxShadow` | **Effect Style** | Tokens Studio creates a named Figma Effect Style. The composite value (offsetX, offsetY, blur, spread, color) is applied as a drop shadow or inner shadow effect. **The `$type` identifier must be exactly `boxShadow`** — Tokens Studio uses this exact string to identify Effect Style candidates. |
| `border` | No Style | Border composites are not exportable as a named Figma Style. Individual sub-values (border-width, border-color) can be exported as Number/Color variables. |
| `composition` | None (plugin-only) | Not exported as a Variable or Style. The plugin applies the bundled property values directly to a Figma layer when the user applies the token interactively. No named artefact is created in Figma. |

### Path segment vs `$type` for composite types

The Oblique path segment and the Tokens Studio `$type` value intentionally differ in case for composites:

| Oblique path segment | `$type` (immutable) | Reason |
|---|---|---|
| `shadow` | `boxShadow` | TS convention; must stay `boxShadow` for Effect Style routing |
| `typography` | `typography` | Single word — no case conflict |
| `border` | `border` | Single word — no case conflict |

Do not rename `boxShadow` to `box_shadow` in `$type` fields. The path segment `shadow` is correct snake\_case. Only the `$type` value is the exception.

Types defined in the second editors' draft (June 2022):

**Scalar types** (§8): `color`, `dimension`, `fontFamily`, `fontWeight`, `duration`, `cubicBezier`

**Composite types** (§9): `strokeStyle`, `border`, `transition`, `shadow`, `gradient`, `typography`

**Not yet in spec** (planned): font style, percentage/ratio, file/asset

The spec explicitly states that tools **must not** use groups to infer type — only `$type` declarations count. Custom/unofficial types are permitted by the format (tools may ignore unknown types).

---

## Issues and Known Limitations

| Issue | Affected types | Status |
|-------|---------------|--------|
| `.size.` vs `.sizing.` path segment inconsistency | `dimension`, `sizing` | Queued for fix — standardize to `dimension` |
| `other` type used for 172 tokens — too generic | `other` | Audit needed |
| `composition` is deprecated in Tokens Studio | `composition` | Migration needed to individual types |
| Figma has no variable type for `duration`, `cubicBezier`, `gradient`, `transition` | motion tokens | Applied code-only; no Figma binding possible |
| Typography composite `$type` cannot bind to Figma variables as a whole | `typography` | Uses Figma Text Styles instead; no variable-level composite |
| `textAlign` has no Figma variable binding | `textAlign` | Code-only; 3 tokens affected |
| S2→S3 hierarchy violations using `ob.s.color.neutral.no_color` in S2 | `color` | 4 tokens queued for fix |
| `boxShadow` `$type` must remain exactly `boxShadow` (camelCase) | `boxShadow` | Naming exception — do not rename; triggers Figma Effect Style export. See [Tokens Studio `$type` Exceptions](./03-naming.md#tokens-studio-type-exceptions). |

---

## References

- W3C Design Tokens Community Group — [Format Specification (2nd Editors' Draft)](https://second-editors-draft.tr.designtokens.org/format/#types)
- Tokens Studio — [Token Types Documentation](https://docs.tokens.studio/manage-tokens/token-types)
- Figma — [Overview of Variables, Collections, and Modes](https://help.figma.com/hc/en-us/articles/14506821864087)
- `@tokens-studio/sd-transforms` — [SD-Transforms preprocessor](https://github.com/Tokens-studio/sd-transforms/?tab=readme-ov-file#using-the-preprocessor)
