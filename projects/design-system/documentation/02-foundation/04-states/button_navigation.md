# button_navigation

**Rationale:** references **static** dimension tokens — the master-layout must not be size-modable.
**Status:** DRAFT. See `All states matrix.md`.

Lives in the master-layout. Has a **selected** state (the current page / active nav item).

## States used

| # | Collection | Modes | Notes |
|---|---|---|---|
| 1 | lightness | light · dark | |
| 2 | emphasis | high · low | |
| 7 | selection | unselected · selected | current nav item; no `indeterminate` |
| 8 | interaction | default · hover · active | no `drag` |
| 9 | focus | unfocused · focused | |
| 10 | display | enabled · disabled | no `read_only` |

## Not used

- **surface** — fixed surface in the master-layout.
- **intent** — no primary/secondary/tertiary hierarchy for nav items.
- **system** — nav items don't load.

## Notes

- Dimensions are **static** — `button_navigation` does not react to the size / ui_scale mode.
