# button_segmented

**Rationale:** segmented control — has a selection state per segment.
**Status:** DRAFT. See [Mode collections & resolution chain](../../../02-foundation/03-design-tokens/02-modes/98-collections-and-resolution-chain.md).

Defining feature: each segment carries a **selection** state.

## Collections used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | reads the substrate it sits on |
| 8 | selection | unselected · selected | per segment; no `indeterminate` |
| 9 | interaction | regular · hover · active | |
| 10 | focus | unfocused · focused | |
| 11 | display | enabled · disabled | no `read_only` (inputs only) |

## Not used

- **elevation** — a button is flat; it reads `surface` but never elevates itself.
- **intent** — segments share one role; confirm.
- **process** — no loading/process state.
- **status** — buttons carry no status.
