# button_teenage

**Rationale:** smaller size and icon size — use cases: dismiss, close, remove.
**Status:** DRAFT. See `All states matrix.md`.

A small utility button. Simple action — no loading/process states.

## States used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | |
| 5 | intent | (limited) | dismiss/close/remove rarely needs full primary/secondary/tertiary — confirm |
| 8 | interaction | default · hover · active | no `drag` |
| 9 | focus | unfocused · focused | |
| 10 | display | enabled · disabled | no `read_only` |

## Not used

- **system** — dismiss/close/remove are instant; no loading/process state.
- **selection** — no selected state.
