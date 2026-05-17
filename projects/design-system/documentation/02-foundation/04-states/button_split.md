# button_split

**Rationale:** button with arrow + other clickable options in a dropdown.
**Status:** DRAFT. See `All states matrix.md`.

A primary action plus a dropdown trigger. The dropdown adds an expanded/collapsed state.

## States used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 3 | surface | canvas · sunken_1 · sunken_2 | |
| 5 | intent | primary · secondary · tertiary | |
| 6 | system | loading · loaded · processing · saving · submitting · empty | main action can load; process only |
| 8 | interaction | default · hover · active | no `drag` |
| 9 | focus | unfocused · focused | |
| 10 | display | enabled · disabled | no `read_only` |

## Not used

- **selection** — no selected state.

## Notes

- The dropdown has an **expanded / collapsed** state. Per Confluence, collapsed/expanded is a higher-level component state — documented with the component, not as a core state level.
