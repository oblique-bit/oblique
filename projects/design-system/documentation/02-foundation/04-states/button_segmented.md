# button_segmented

**Rationale:** segmented control — has active/selected states per segment.
**Status:** DRAFT. See `All states matrix.md`.

Defining feature: each segment carries a **selection** state.

## States used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | |
| 7 | selection | unselected · selected | per segment; no `indeterminate` |
| 8 | interaction | default · hover · active | no `drag` |
| 9 | focus | unfocused · focused | |
| 10 | display | enabled · disabled | no `read_only` |

## Not used

- **intent** — segments share one role; confirm.
- **system** — no loading/process state.
