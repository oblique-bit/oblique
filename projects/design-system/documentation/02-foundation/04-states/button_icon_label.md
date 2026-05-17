# button_icon_label

**Rationale:** main use case — forms.
**Status:** DRAFT. See `All states matrix.md`.

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
| 10 | display | enabled · disabled | no `read_only` (inputs only) |

## Not used

- **selection** — a plain action button has no selected state.
