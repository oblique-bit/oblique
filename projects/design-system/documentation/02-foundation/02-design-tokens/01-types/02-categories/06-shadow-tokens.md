# Shadow Tokens

> Semantic elevation shadows — four steps (`none`, `sm`, `md`, `lg`), each a single drop shadow whose vertical offset and blur grow with the elevation. Semantic-only: there is no shadow primitive tier.
>
> *(Summarised from the four tokens' own `$description` fields — [`03_semantic/shadow.json`](../../../../../src/lib/themes/03_semantic/shadow.json) carries no `token_family_docs` node.)*

## At a glance

| Layer | Path | Source files | Purpose |
|---|---|---|---|
| **Primitive** | *(none)* | — | There is no `ob.p.shadow.*` file. Geometry is written as literal px in the semantic file; only the colour is an alias. |
| **Semantic** | `ob.s.shadow.{none\|sm\|md\|lg}` | [`03_semantic/shadow.json`](../../../../../src/lib/themes/03_semantic/shadow.json) | 4 composite `boxShadow` tokens — the complete category. |
| **Component** | (per component) | none yet | No token file references `ob.s.shadow.*` in this release. |

Shadows reach Figma as **Effect Styles**, not variables — Figma has no composite shadow variable. `$themes.json` records the four style ids for the `static` and `semantic` themes.

---

## The four steps

| Token | x | y | blur | spread | Colour | CSS output |
|---|---|---|---|---|---|---|
| `none` | `0px` | `0px` | `0px` | `0px` | `ob.p.color.basic.transparent` | `0px 0px 0px 0px transparent` |
| `sm` | `0px` | `1px` | `2px` | `0px` | `ob.p.color.cobalt_alpha.50` | `0px 1px 2px 0px rgb(7.451% 10.588% 13.333% / 0.05)` |
| `md` | `0px` | `2px` | `4px` | `0px` | `ob.p.color.cobalt_alpha.50` | `0px 2px 4px 0px rgb(7.451% 10.588% 13.333% / 0.05)` |
| `lg` | `0px` | `4px` | `8px` | `0px` | `ob.p.color.cobalt_alpha.50` | `0px 4px 8px 0px rgb(7.451% 10.588% 13.333% / 0.05)` |

The scale is regular: `y` doubles at every step (1 → 2 → 4) and `blur` is always `2 × y`. `x` and `spread` are `0` throughout — every shadow falls straight down, none of them spreads.

### What each step is for

Each token's own `$description`:

| Token | `$description` |
|---|---|
| `none` | No shadow. Single drop-shadow with zero geometry and a transparent colour, so it renders nothing. Flat, non-elevated surfaces and resting interactive states. |
| `sm` | Small elevation shadow. Single drop-shadow. Surfaces that sit just above the page, such as cards and raised panels. |
| `md` | Medium elevation shadow. Single drop-shadow. Surfaces lifted on interaction or layered over content, such as hovered controls and dropdowns. |
| `lg` | Large elevation shadow. Single drop-shadow. Surfaces that float above the whole page, such as dialogs and modals. |

`none` is a real token, not the absence of one. It exists so a component can bind its shadow property to a token in every state, including the resting one, instead of unsetting the property.

---

## The composite shape

```json
"ob.s.shadow.md": {
  "$type": "boxShadow",
  "$value": {
    "x": "0px",
    "y": "2px",
    "blur": "4px",
    "spread": "0px",
    "color": "{ob.p.color.cobalt_alpha.50}",
    "type": "dropShadow"
  }
}
```

Two things to know about this shape:

- **The geometry is literal, not aliased.** `x`, `y`, `blur` and `spread` are written as px strings in the semantic file. They do not reference `ob.p.dimension.px.*`. Changing a shadow's geometry means editing the literal in `shadow.json`.
- **`type` is `dropShadow` for all four.** Tokens Studio also supports `innerShadow`; no Oblique shadow uses it today.

Each token is a **single** shadow. The composite value is one object, not an array of layers.

---

## Colour

| Token | Colour | Resolves to |
|---|---|---|
| `none` | `ob.p.color.basic.transparent` | the CSS `transparent` keyword |
| `sm`, `md`, `lg` | `ob.p.color.cobalt_alpha.50` | `ob.p.color.cobalt.900` at 5% alpha (sRGB), via the Tokens Studio `modify` extension |

The primitive's own `$description` reads: "Role: Shared. Transparent neutral. Used for disabled states, overlays, and shadows."

**These are primitive-direct references from the semantic tier.** That is the documented exception for static utility colours — values that do not vary by lightness or emphasis, where routing through S1 and S2 would add ceremony with no semantic benefit. See [Intentional Primitive Bypass for Static Utility Colors](../01-tiers/03-semantic-tokens.md#intentional-primitive-bypass-for-static-utility-colors).

The consequence is visible in the build: `--ob-s-shadow-*` is emitted once in the base block and never re-emitted inside `.ob-lightness-dark` or any other mode block. The shadows are mode-invariant.

### Not to be confused with `ob.s.color.neutral.shadow.*`

The neutral colour family ships two separate shadow **colour** tokens, `ob.s.color.neutral.shadow.first` (5% cobalt) and `.second` (10% cobalt), described in the source as the first and second layer of a two-effect shadow. The `ob.s.shadow.*` composites do not reference them — they reference the primitive directly. The two sets are independent today.

---

## Figma export

`boxShadow` is a Tokens Studio unofficial composite. Tokens Studio routes it to a named Figma **Effect Style**, applying the composite value as a drop-shadow effect.

> **The `$type` must stay exactly `boxShadow`** (camelCase). Tokens Studio matches that exact string to identify Effect Style candidates. Renaming it — for example to `box_shadow` to match Oblique's snake_case rule — makes Tokens Studio fall back to `other` and silently drops the token from the export.

The path segment is `shadow` (correct snake_case); only the `$type` value is the exception. See [`../../03-naming.md`](../../03-naming.md) and [`../../04-token-types.md`](../../04-token-types.md).

---

## Naming conventions

```
ob.s.shadow.<size>
```

- `<size>` ∈ `none, sm, md, lg`

The flattest path in the token system. There is no inversity split, no mode split, no `px`/`rem` split and no primitive tier — one segment names the elevation step and that is the whole category.

---

## Related docs

- [`../01-tiers/03-semantic-tokens.md`](../01-tiers/03-semantic-tokens.md) — Semantic layer architecture and the primitive-bypass exception
- [`./01-color-tokens/01-colors-primitive.md`](./01-color-tokens/01-colors-primitive.md) — the `cobalt_alpha` primitive scale
- [`./05-border-tokens.md`](./05-border-tokens.md) — the other semantic-only, dimension-derived category
- [`../../03-naming.md`](../../03-naming.md) — the Tokens Studio `$type` exceptions
- [`../../04-token-types.md`](../../04-token-types.md) — `boxShadow` and composite Figma export behaviour
