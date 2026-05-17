# button_icon

**Rationale:** icon-only — needs dedicated paddings & behaviour.
**Status:** DRAFT. See `All states matrix.md`.

Same state set as `button_icon_label` — it differs in layout (padding, icon behaviour), not in states.

## States used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | |
| 5 | intent | primary · secondary · tertiary | |
| 6 | system | loading · loaded · processing · saving · submitting · empty | process only — no status |
| 8 | interaction | default · hover · active | no `drag` |
| 9 | focus | unfocused · focused | |
| 10 | display | enabled · disabled | no `read_only` |

## Not used

- **selection** — no selected state.
