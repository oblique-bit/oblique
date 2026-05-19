# button_navigation

**Rationale:** references **static** dimension tokens — the master-layout must not be size-modable.
**Status:** DRAFT. See [Mode collections & resolution chain](../../../02-foundation/03-design-tokens/02-modes/98-collections-and-resolution-chain.md).

Lives in the master-layout. Has a **selected** state (the current page / active nav item).

## Collections used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 8 | selection | unselected · selected | current nav item; no `indeterminate` |
| 9 | interaction | regular · hover · active | |
| 10 | focus | unfocused · focused | |
| 11 | display | enabled · disabled | no `read_only` (inputs only) |

## Not used

- **surface** — fixed surface in the master-layout.
- **elevation** — a button is flat; it never elevates itself.
- **intent** — no primary/secondary/tertiary hierarchy for nav items.
- **process** — nav items don't load.
- **status** — buttons carry no status.

## Notes

- Dimensions are **static** — `button_navigation` does not react to the `ui_scale` mode.
