# All States Matrix

**Status:** DRAFT — the state model is not finalized (see Jira OUX-215 naming, OUI-4436 token refactor).
**Purpose:** master reference of every state collection and which button type uses which.
**Replaces:** the former single `04-states.md`.
**Related:** the States concept (Confluence "States concept" page).

---

## Resolution chain

Collections resolve **top → down**. Top = deepest (theme); bottom = wins (binds to the component). Each collection is one variable-mode collection (one mode axis); a mode set on a frame cascades to its children. A downstream collection overrides an upstream one by aliasing past it.

This resolution order is **global and the same for every component** — it is the top-down order of the table below. A component may use only a subset of these collections, but it never reorders them.

| # | Collection | Type | Modes |
|---|---|---|---|
| 1 | lightness | theme | light · dark |
| 2 | emphasis | theme | high · low |
| 3 | surface | context | canvas · sunken_1 · sunken_2 · raised · overlay · backdrop |
| 4 | elevation | context | level_0 · level_1 · level_2 · level_3 |
| 5 | intent | variant | primary · secondary · tertiary |
| 6 | system | state | loading · loaded · processing · saving · submitting · empty · success · warning · critical · info |
| 7 | selection | state | unselected · selected · indeterminate |
| 8 | interaction | state | default · hover · active · drag |
| 9 | focus | state | unfocused · focused |
| 10 | display | state | enabled · disabled · read_only |

**Naming note:** `display` = Confluence "Component state"; `system` merges Confluence "Status" + "System-process". `intent`/`surface`/`elevation`/`lightness`/`emphasis` are not states (variant/context/theme) — kept here because they are part of the same resolution chain.

**Surface vs elevation:** elevation is **relative**, so it splits into two collections. `surface` = the substrate a component rests on — absolute, inherited from the parent frame. `elevation` = the component's own rise above that substrate — a relative step (`level_0` = flush with the parent). Effective surface = `surface` + `elevation`, and that result becomes the `surface` mode for the component's children. A plain button only reads `surface`; only components that elevate themselves (Card, Menu, Modal) set `elevation`.

---

## Component × collection matrix

Not every button type uses every collection.

| Button type | lightness | emphasis | surface | elevation | intent | system | selection | interaction | focus | display |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| button_icon_label | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ proc | ✗ | ✓ | ✓ | ✓ |
| button_icon | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ proc | ✗ | ✓ | ✓ | ✓ |
| button_teenage | ✓ | ✓ | ✓ | ✗ | ~ | ✗ | ✗ | ✓ | ✓ | ✓ |
| button_navigation | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| button_segmented | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| button_toggle | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ |
| button_split | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ proc | ✗ | ✓ | ✓ | ✓ |

✓ = uses · ✗ = not used · ~ = limited · "proc" = process modes only (no status — buttons carry no status in our DS). No button uses `elevation` — a button is a flat affordance; it reads `surface` but never elevates itself.

Per-type detail in the sibling `button_*.md` files.

---

## Rules

- For every button: `system` excludes status modes (`success/warning/critical/info`) — buttons don't carry status.
- For every button: `interaction` excludes `drag`; `display` excludes `read_only` (inputs only).
- `button_navigation` references **static** dimension tokens — the master-layout must not be size-modable.
- `button_split` additionally has a dropdown expanded/collapsed state — per Confluence this is documented with the component, not as a core state level.

---

## Open decisions

- [ ] Naming: `active` vs `pressed`
- [ ] Naming: Figma focus boolean — "Focus" vs "Focused"
- [ ] `surface` mode names — `sunken_1` / `sunken_2`
- [ ] Does `button_navigation` / `button_segmented` need `intent`?
- [ ] `visited` state — link-specific; include in the concept or keep link-only
- [ ] Confirm `system` merge (Status + System-process) vs keeping them separate
