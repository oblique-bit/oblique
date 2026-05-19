# button_toggle

**Rationale:** toggle button — has toggled / untoggled states.
**Status:** DRAFT. See [Mode collections & resolution chain](../../../02-foundation/03-design-tokens/02-modes/98-collections-and-resolution-chain.md).

Defining feature: a binary **selection** state — toggled / untoggled.

## Collections used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | reads the substrate it sits on |
| 5 | intent | primary · secondary · tertiary | |
| 8 | selection | untoggled · toggled | the toggle state; maps to unselected/selected — naming TBD |
| 9 | interaction | regular · hover · active | |
| 10 | focus | unfocused · focused | |
| 11 | display | enabled · disabled | no `read_only` (inputs only) |

## Not used

- **elevation** — a button is flat; it reads `surface` but never elevates itself.
- **process** — no loading/process state.
- **status** — buttons carry no status.

## Open

- [ ] `selection` modes: keep `toggled / untoggled`, or reuse `selected / unselected`?
