# button_split

**Rationale:** button with arrow + other clickable options in a dropdown.
**Status:** DRAFT. See [Mode collections & resolution chain](../../../02-foundation/03-design-tokens/02-modes/98-collections-and-resolution-chain.md).

A primary action plus a dropdown trigger. The dropdown adds an expanded/collapsed state.

## Collections used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | reads the substrate it sits on |
| 5 | intent | primary · secondary · tertiary | |
| 6 | process | loaded · loading · failed | the main action can load; no `empty` |
| 9 | interaction | regular · hover · active | |
| 10 | focus | unfocused · focused | |
| 11 | display | enabled · disabled | no `read_only` (inputs only) |

## Not used

- **elevation** — a button is flat; it reads `surface` but never elevates itself.
- **status** — buttons carry no status.
- **selection** — no selected state.

## Notes

- The dropdown has an **expanded / collapsed** state. Per Confluence, collapsed/expanded is a higher-level component state — documented with the component, not as a core state level.
