# button_toggle

**Rationale:** toggle button — has toggled / untoggled states.
**Status:** DRAFT. See `All states matrix.md`.

Defining feature: a binary **selection** state — toggled / untoggled.

## States used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | |
| 5 | intent | primary · secondary · tertiary | |
| 7 | selection | untoggled · toggled | the toggle state; maps to unselected/selected — naming TBD |
| 8 | interaction | default · hover · active | no `drag` |
| 9 | focus | unfocused · focused | |
| 10 | display | enabled · disabled | no `read_only` |

## Not used

- **system** — no loading/process state.

## Open

- [ ] `selection` modes: keep `toggled / untoggled`, or reuse `selected / unselected`?
