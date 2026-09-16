# Border Tokens

> Semantic border tokens — border-radius, border-width, outline-offset, and border shorthand. Referenced by component and HTML token files.
>
> *(`ob.s.border_radius.token_family_docs.description` — [`03_semantic/border.json`](../../../../../src/lib/themes/03_semantic/border.json). The node sits under `border_radius` but describes the whole file.)*

## At a glance

| Layer | Path | Source files | Purpose |
|---|---|---|---|
| **Primitive** | *(none)* | — | There is no `ob.p.border.*` file. Lengths come from `ob.p.dimension.px.*`; the focus-ring colour comes from the semantic colour chain. |
| **Semantic** | `ob.s.border_radius.*`, `ob.s.border_width.*`, `ob.s.outline_offset.*`, `ob.s.border.focus_ring.*` | [`03_semantic/border.json`](../../../../../src/lib/themes/03_semantic/border.json) | 4 groups, 20 tokens: 18 scalars + 2 composites. |
| **Component** | (per component) | various | Consumes the semantic border tokens. |

The 18 scalar tokens land in Figma as Number variables. The 2 composite `border` tokens do not — Figma has no composite border variable and Tokens Studio creates no Style for them, so they exist in CSS only. See [`../../04-token-types.md`](../../04-token-types.md).

---

## No primitive tier

Border is a **derived** category. Every length alias points straight at the shared dimension primitives:

```
ob.s.border_radius.md   → {ob.p.dimension.px.2}
ob.s.border_width.md    → {ob.p.dimension.px.3}
ob.s.outline_offset.sm  → {ob.p.dimension.px.2}
```

There is deliberately no parallel `ob.p.border.*` scale to keep in sync. The only non-dimension input is the focus-ring colour, which comes from the semantic colour layer.

---

## The four groups

| Group | Path | `$type` | Tokens | Resolves to |
|---|---|---|---|---|
| Radius | `ob.s.border_radius.<size>` | `borderRadius` | 5 | `ob.p.dimension.px.*` |
| Width | `ob.s.border_width.<size>` | `borderWidth` | 8 | `ob.p.dimension.px.*` |
| Outline offset | `ob.s.outline_offset.<size>` | `dimension` | 5 | `ob.p.dimension.px.*` |
| Focus ring | `ob.s.border.focus_ring.<inversity>` | `border` | 2 | composite — see below |

`borderRadius` and `borderWidth` are Tokens Studio unofficial types that convert to `dimension` on export. `outline_offset` already uses the official `dimension` type.

---

## `border_radius` — 5 sizes

| Token | Primitive | CSS |
|---|---|---|
| `none` | `ob.p.dimension.px.0` | `0` |
| `sm` | `ob.p.dimension.px.1` | `1px` |
| `md` | `ob.p.dimension.px.2` | `2px` |
| `lg` | `ob.p.dimension.px.4` | `4px` |
| `rounded` | `ob.p.dimension.px.9999` | `999px` |

`rounded` is the full-rounding step (pill shapes and circles). Note the primitive it points at is keyed `9999` but carries the `$value` `999`, so the emitted custom property is `--ob-s-border_radius-rounded: 999px`. The primitive's own `$description` reads "Maximum value for full rounding".

None of the radius tokens carry an individual `$description`; the file relies on the family description quoted at the top of this page.

---

## `border_width` — 8 sizes

| Token | Primitive | CSS |
|---|---|---|
| `none` | `ob.p.dimension.px.0` | `0` |
| `xs` | `ob.p.dimension.px.1` | `1px` |
| `sm` | `ob.p.dimension.px.2` | `2px` |
| `md` | `ob.p.dimension.px.3` | `3px` |
| `lg` | `ob.p.dimension.px.4` | `4px` |
| `xl` | `ob.p.dimension.px.8` | `8px` |
| `2xl` | `ob.p.dimension.px.12` | `12px` |
| `3xl` | `ob.p.dimension.px.16` | `16px` |

The scale runs from a hairline to a heavy block edge. `md` (3px) is the width the focus ring composites reference.

The JSON orders `none` last, after `3xl`; the table above is sorted by magnitude for reading.

Border widths are a documented `.px` case — they must stay crisp and are not scaled to `.rem`. See the [px vs rem rule](../../05-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component) in the token usage guide.

---

## `outline_offset` — 5 sizes

The gap between an outline and the element edge. This is the only group in the file whose tokens each carry their own `$description`.

| Token | Primitive | CSS | `$description` |
|---|---|---|---|
| `none` | `ob.p.dimension.px.0` | `0` | No outline offset - outline directly touches element boundary |
| `xs` | `ob.p.dimension.px.1` | `1px` | Minimal outline offset for tight spacing requirements |
| `sm` | `ob.p.dimension.px.2` | `2px` | Small outline offset for standard interactive elements |
| `md` | `ob.p.dimension.px.3` | `3px` | Medium outline offset for buttons and larger interactive elements |
| `lg` | `ob.p.dimension.px.4` | `4px` | Large outline offset for prominent interactive elements |

---

## `border.focus_ring` — 2 composites

The only composite tokens in the file. Each bundles colour, width and style into one `$type: "border"` value, ready to apply as a CSS `outline`.

```json
"ob.s.border.focus_ring.inversity_normal": {
  "$type": "border",
  "$value": {
    "color": "{ob.s.color.interaction.focus_ring.inversity_normal}",
    "width": "{ob.s.border_width.md}",
    "style": "solid"
  },
  "$description": "CSS implementation of focus ring for accessibility compliance. Use with outline property."
}
```

| Token | Colour reference | Width | Style |
|---|---|---|---|
| `inversity_normal` | `ob.s.color.interaction.focus_ring.inversity_normal` | `ob.s.border_width.md` (3px) | `solid` |
| `inversity_flipped` | `ob.s.color.interaction.focus_ring.inversity_flipped` | `ob.s.border_width.md` (3px) | `solid` |

Both carry the same `$description`.

### How a composite lands in CSS

Style Dictionary expands each composite into one custom property per sub-property:

```css
--ob-s-border-focus_ring-inversity_normal-color: #8b5cf6;
--ob-s-border-focus_ring-inversity_normal-style: solid;
--ob-s-border-focus_ring-inversity_normal-width: 3px;
```

Applied together as an outline:

```css
outline: var(--ob-s-border-focus_ring-inversity_normal-width)
         var(--ob-s-border-focus_ring-inversity_normal-style)
         var(--ob-s-border-focus_ring-inversity_normal-color);
```

### Reference chain

The width stays inside the border category; the colour leaves it and walks the full semantic colour chain:

```
ob.s.border.focus_ring.inversity_normal
  ├── width → ob.s.border_width.md → ob.p.dimension.px.3
  ├── style → "solid" (literal, no token)
  └── color → ob.s.color.interaction.focus_ring.inversity_normal
                → ob.s1.color.interaction.focus_ring.inversity_normal
                  → ob.p.color.purple.*
```

`style` is the one value in the whole category with no token behind it. Figma cannot bind a border style to a variable either, so there is nothing to gain from tokenising it.

---

## Inversity

`inversity_normal` / `inversity_flipped` is a **flat key segment, not a mode**. A component can need both values at the same time — a flipped element nested inside a normal surface — and a mode has only one active value at a time. Inversity is a designer's decision at the component level, not a user preference. See [Inversity: Component-Level Contrast Inversion](../01-tiers/04-component-tokens.md#inversity-component-level-contrast-inversion).

| Segment | Meaning |
|---|---|
| `inversity_normal` | Standard surface. The default. |
| `inversity_flipped` | Inverse surface. |

The two focus-ring variants are the border category's only use of the segment — radius, width and outline offset have no inversity split, because a length does not change with the surface it sits on.

### Inversity and lightness are different axes

The inversity segment picks **which** of the two focus-ring colours a component uses. The `lightness` mode decides **what each one resolves to**, one layer down in the colour chain. The generated CSS shows both at work:

```css
:root {
  --ob-s-border-focus_ring-inversity_normal-color:  #8b5cf6;
  --ob-s-border-focus_ring-inversity_flipped-color: #a78bfa;
}

.ob-lightness-dark {
  --ob-s-border-focus_ring-inversity_normal-color:  #a78bfa;
  --ob-s-border-focus_ring-inversity_flipped-color: #8b5cf6;
}
```

The `width` and `style` sub-properties are not re-emitted in the lightness block — only the colour changes with the mode.

---

## Accessibility

The focus-ring tokens are the system's focus indicator. Their role in WCAG conformance, the outline-offset tokens, and the 3px width are mapped in the [WCAG 2.2 and the Token System](../../05-token-usage-guide.md#wcag-22-and-the-token-system) section of the token usage guide. The component-level focus state model is in [`03-states.md`](../../../03-states.md).

---

## Naming conventions

```
ob.s.border_radius.<size>
ob.s.border_width.<size>
ob.s.outline_offset.<size>
ob.s.border.focus_ring.<inversity>
```

The category spans four sibling top-level keys rather than one `border` tree: three compound property segments (`border_radius`, `border_width`, `outline_offset`) and one nested path (`border.focus_ring`). `border_radius` is listed among the property compounds in [`../../03-naming.md`](../../03-naming.md).

- `<size>` ∈ `none, xs, sm, md, lg, xl, 2xl, 3xl` — the subset differs per group (see the tables above)
- `<inversity>` ∈ `inversity_normal | inversity_flipped`

---

## Related docs

- [`../01-tiers/03-semantic-tokens.md`](../01-tiers/03-semantic-tokens.md) — Semantic layer architecture
- [`../01-tiers/04-component-tokens.md`](../01-tiers/04-component-tokens.md) — Inversity, and the `ob.c.*` / `ob.h.*` patterns
- [`./02-dimension-tokens.md`](./02-dimension-tokens.md) — the `ob.p.dimension.px.*` scale every border length resolves to
- [`./01-color-tokens/06-colors-semantic-interaction.md`](./01-color-tokens/06-colors-semantic-interaction.md) — the focus-ring colour tokens and their use in interactive components
- [`../../04-token-types.md`](../../04-token-types.md) — `borderRadius`, `borderWidth` and the `border` composite's Figma export behaviour
- [`../../05-token-usage-guide.md`](../../05-token-usage-guide.md) — which token to reach for, and the px vs rem rule
