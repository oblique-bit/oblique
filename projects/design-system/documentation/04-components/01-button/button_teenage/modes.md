# button_teenage

**Rationale:** smaller size and icon size — use cases: dismiss, close, remove.
**Status:** DRAFT. See [Mode collections & resolution chain](../../../02-foundation/03-design-tokens/02-modes/98-collections-and-resolution-chain.md).

A small utility button. Simple, instant action — no async feedback.

## Collections used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | reads the substrate it sits on |
| 5 | intent | (limited) | dismiss/close/remove rarely needs full primary/secondary/tertiary — confirm |
| 9 | interaction | regular · hover · active | |
| 10 | focus | unfocused · focused | |
| 11 | display | enabled · disabled | no `read_only` (inputs only) |

## Not used

- **elevation** — a button is flat; it reads `surface` but never elevates itself.
- **process** — dismiss/close/remove are instant; no loading/process state.
- **status** — buttons carry no status.
- **selection** — no selected state.
