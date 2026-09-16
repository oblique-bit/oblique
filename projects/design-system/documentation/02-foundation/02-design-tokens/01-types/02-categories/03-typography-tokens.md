# Typography Tokens

> Typography foundation — every text-related token in the system. Covers font families, font weights, font sizes, line heights, paragraph spacing, letter spacing and text-decoration / text-case / text-align. Composite text styles (Figma styles) are built by combining tokens from these sub-families.
>
> *(`ob.s.typography.token_family_docs.description` — [`03_semantic/typography/single/static.json`](../../../../../src/lib/themes/03_semantic/typography/single/static.json))*

## At a glance

| Layer | Path | Source files | Purpose |
|---|---|---|---|
| **Primitive** | `ob.p.font_size_rem.*`, `ob.p.font_family.*`, `ob.p.font_weight.*`, `ob.p.line_height*`, `ob.p.letter_spacing_px.*`, `ob.p.paragraph_spacing*` | [`02_primitive/typography.json`](../../../../../src/lib/themes/02_primitive/typography.json) | Atomic text values. Not for direct consumption. |
| **Semantic — single** | `ob.s.typography.scale.{static\|dynamic}.*` | [`03_semantic/typography/single/`](../../../../../src/lib/themes/03_semantic/typography/single/) | One property per token. Building blocks for components. |
| **Semantic — grouped** | `ob.s.typography.authoring.{static\|dynamic}.*` | [`03_semantic/typography/grouped/`](../../../../../src/lib/themes/03_semantic/typography/grouped/) | Composite tokens (`$type: "typography"`) that become Figma text styles. |
| **HTML — context** | `ob.h.typography.context.*` | [`05_html/typography/context/`](../../../../../src/lib/themes/05_html/typography/context/) | Per-element values for `h1`–`h6`, `body`, `p`, `p_lead`, per typography context. |
| **HTML — style** | `ob.h.heading.*`, `ob.h.body.*` | [`05_html/typography/style.json`](../../../../../src/lib/themes/05_html/typography/style.json) | The reusable named text styles. |

---

## The rem base: fixed at 16px

**Decision:** use rem units for all typography, with a **fixed 16px base font size** across every context and viewport.

**Rationale:**

- **Predictable calculations** — 1rem is 16px in every mode.
- **Tokens Studio compatibility** — avoids changing the base font size per viewport.
- **Developer experience** — engineers can convert rem values without a lookup.
- **Figma consistency** — no per-mode adjustment of the Tokens Studio base font size.
- **Accessibility** — rem respects the user's browser font-size preference while keeping the design proportions intact.

**Tokens Studio setting:** base font size is **16px** and never changes. It is a global plugin setting, so it affects every Figma file, and it drives the rem → pixel conversion shown in the Figma UI.

---

## Primitive layer

The primitive source carries two mathematically equivalent font-size scales:

| Scale | Path | Consumed by |
|---|---|---|
| Rem | `ob.p.font_size_rem.*` | The semantic typography files (`single/`, `grouped/`) |
| Unitless | `ob.p.font_size_unitless.*` | Kept for tooling that needs a bare number |

The semantic layer consumes `font_size_rem` directly. That keeps rem values in the CSS output, removes a calculation step, matches standard CSS practice, and makes a broken value easier to trace back to its primitive.

Beyond font size, the primitive file holds `font_family`, `font_weight`, `line_height`, `line_height_rem`, `letter_spacing_px`, `paragraph_spacing`, `paragraph_spacing_rem`, `text_decoration` and `text_case`.

> Primitives are atomic and context-agnostic. They must not be consumed directly by components.

---

## Semantic layer: single and grouped

The semantic typography tokens sit in two folders that serve different purposes.

| Folder | Token path segment | Files | Holds |
|---|---|---|---|
| `single/` | `ob.s.typography.scale.*` | `static.json`, `sm.json`, `md.json`, `lg.json` | One property per token (font size, line height, font weight, …). |
| `grouped/` | `ob.s.typography.authoring.*` | `static.json`, `sm.json`, `md.json`, `lg.json` | Composite tokens combining six properties into one `$type: "typography"` value. |

The folder name and the token path segment differ on purpose: `grouped/` describes where the file sits, `authoring` describes what the tokens are for — composing a text style, rather than styling one property of a component.

### Static and dynamic

Each folder splits its tokens into two flavours:

- **`static`** — fixed values. `static.json` carries them, and they do not change when the `ui_scale` mode switches.
- **`dynamic`** — scaled values. `sm.json`, `md.json` and `lg.json` each supply the same token names for their own `ui_scale` mode, applying the global multiplier `{ob.g.mode_collection.ui_scale.multiplier.typography.*}` to the primitive.

```json
// 03_semantic/typography/single/md.json — dynamic, multiplier applied
"ob.s.typography.scale.dynamic.font_size.md": {
  "$value": "{ob.p.font_size_rem.300} * {ob.g.mode_collection.ui_scale.multiplier.typography.md}"
}
```

See [`02-modes/03-ui-scale.md`](../../02-modes/03-ui-scale.md) for the mode mechanics.

### How grouped tokens reference single tokens

A grouped token references the matching single token of the same flavour. For a dynamic grouped token that means referencing the **already-scaled** single token: the multiplier is applied once, at the single-token level, and is not re-applied here.

```json
// 03_semantic/typography/grouped/md.json
"ob.s.typography.authoring.dynamic.md.normal": {
  "$type": "typography",
  "$value": {
    "fontFamily":       "{ob.s.typography.scale.static.font_family.body}",
    "fontWeight":       "{ob.s.typography.scale.dynamic.font_weight.medium}",
    "fontSize":         "{ob.s.typography.scale.dynamic.font_size.md}",
    "lineHeight":       "{ob.s.typography.scale.dynamic.line_height.md}",
    "letterSpacing":    "{ob.s.typography.scale.dynamic.letter_spacing_px.normal}",
    "paragraphSpacing": "{ob.s.typography.scale.dynamic.paragraph_spacing.md}"
  }
}
```

The static counterpart in `grouped/static.json` has the same shape with `scale.static.*` references throughout.

---

## HTML level: context and style

Two files at the HTML level turn the semantic scale into text that ships.

### `context/` — per-element values

`ob.h.typography.context.*` defines font family, font size, font weight, line height, letter spacing, foreground colour, paragraph spacing and surrounding spacing for each of `h1`–`h6`, `body`, `p` and `p_lead`.

Two files supply the same token names for the two typography contexts:

- `interface.json` — tuned for UI controls and labels.
- `prose.json` — tuned for long-form reading.

See [`02-modes/04-typography-context.md`](../../02-modes/04-typography-context.md) for the concrete values and the mode mechanics.

The vertical spacing around these elements comes from the `typography_context` dimension group, not from the typography tokens themselves — see [`02-dimension-tokens.md`](./02-dimension-tokens.md).

### `style.json` — the named text styles

`05_html/typography/style.json` holds the reusable text styles that map to Figma typography styles:

- `ob.h.heading.H1` … `ob.h.heading.H6`
- `ob.h.body.normal`, `ob.h.body.link`, `ob.h.body.strong`, `ob.h.body.lead`

---

## Token resolution flow

Example for a medium `ui_scale`:

1. **Primitive** — `ob.p.font_size_rem.300` is `1rem`.
2. **Semantic (scaled)** — `ob.s.typography.scale.dynamic.font_size.*` in `single/md.json` references that primitive step and multiplies it by the `ui_scale` typography multiplier.
3. **HTML context** — `ob.h.typography.context.h1.font_size` references `ob.s.typography.scale.static.font_size.3xl` directly, because the heading scale is the fixed, non-scaling part.

---

## Two token shapes, chosen by use case

The system uses two different token shapes for typography. The choice is deliberate and depends on where the tokens are consumed.

### A. Composite tokens for text styles

- **Shape** — one token combining font family, font weight, font size, line height, letter spacing and paragraph spacing.
- **Purpose** — map directly onto Figma typography styles, so a designer applies one style and a developer reads one token.
- **Example** — `ob.h.heading.H1` carries the complete definition for that heading level.
- **Location** — `05_html/typography/style.json`, built from `ob.s.typography.authoring.*`.

### B. Individual property tokens for components

- **Shape** — one token per typography property.
- **Purpose** — give a component granular control in CSS without adding a component-specific typography style to Figma.
- **Example shape** — `ob.h.button.typography.font_size`, `ob.h.button.typography.line_height`.
- **Current state** — button does not ship in this release, so no `ob.h.button.typography.*` tokens exist yet. When it returns it belongs under `ob.h.*` (an HTML element), not `ob.c.*`, the same as `link`.

### Why both

Headings need Figma typography styles so the design application stays consistent. Component elements need per-property control, and giving each of them a Figma style would fill the file with styles no designer applies on its own. The two shapes answer those two needs.

---

## Related docs

- [`../01-tiers/02-primitive-tokens.md`](../01-tiers/02-primitive-tokens.md) — Primitive layer architecture
- [`../01-tiers/03-semantic-tokens.md`](../01-tiers/03-semantic-tokens.md) — Semantic layer architecture
- [`../01-tiers/04-component-tokens.md`](../01-tiers/04-component-tokens.md) — `ob.c.*` and `ob.h.*` token patterns
- [`./02-dimension-tokens.md`](./02-dimension-tokens.md) — vertical spacing around typography (`typography_context` group)
- [`../../02-modes/03-ui-scale.md`](../../02-modes/03-ui-scale.md) — UI Scale mode
- [`../../02-modes/04-typography-context.md`](../../02-modes/04-typography-context.md) — Typography context mode
- [`../../04-token-types.md`](../../04-token-types.md) — `$type` values, including the Tokens Studio typography type
