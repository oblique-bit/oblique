# List Component Overview

> Working version on the development line (git branch `tokens-dev`). The list tokens (ob.h.list.*) are not part of Oblique 16. They style the HTML list elements.

## Component Introduction

The list tokens are the tokens for the HTML list elements in Oblique DS. They cover spacing for a single item and spacing for a group of items. They are `ob.h.*` tokens (HTML components and elements), not `ob.c.*` component tokens. See [Component Tokens](../../02-token-tiers/04-component.md).

The list has spacing tokens only. It has no color, size or typography tokens.

## Token Groups

All list tokens start with `ob.h.list.`.

| Group | Path | What it covers | Tokens |
|-------|------|----------------|--------|
| single_item | `ob.h.list.single_item.spacing.*` | The gap between the icon and the text, and the bottom margin of a single element | 2 |
| group | `ob.h.list.group.spacing.*` | The top margin of a group, in the variants `high` and `low` | 2 |

## States and Variants

- **States:** the list tokens do not define any states.
- **Variants:** the group spacing has two variants in the token names: `high` and `low`. Each variant has a `margin_top` token. The tokens do not say what `high` and `low` stand for. They are path segments of the token name, not modes.

| Variant | Token | References |
|---------|-------|------------|
| `high` | `ob.h.list.group.spacing.high.margin_top` | `ob.s.dimension.static.ui_scale.element.xl.px` |
| `low` | `ob.h.list.group.spacing.low.margin_top` | `ob.s.dimension.static.ui_scale.none.px` |

## Modes

All four list tokens reference static dimension tokens (`ob.s.dimension.static.ui_scale.*`). Static tokens point to a primitive and do not change when a mode changes. The list tokens do not react to any mode: not `ui_scale`, `density`, `typography_context`, `viewport`, `lightness`, `emphasis` or `motion`.

## Units

The list tokens reference the `.px` sibling of a semantic dimension token, so the values are px. The unit that the CSS uses follows the rule in the [Token Usage Guide](../../05-reference/01-token-usage-guide.md#px-vs-rem--which-unit-when-building-a-component).

## Tokens

The list tokens are `ob.h.list.*`. They live in one file: `05_html/list.json`. HTML element tokens reference semantic tokens (`ob.s.*`) only.

---

**Next Steps:**
- [Component Architecture](02-architecture.md) - All tokens, design decisions and consumed tokens
