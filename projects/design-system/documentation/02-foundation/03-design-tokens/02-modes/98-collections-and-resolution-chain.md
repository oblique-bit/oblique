# Mode collections & resolution chain

**Status:** DRAFT — state model not finalized; naming and the token refactor are in progress.
**Purpose:** single source of truth for every mode collection — the colour/state resolution chain, the dimension/typography modes, per-mode definitions, and which button uses which.
**Related:** the States concept (Confluence "States concept" page).

---

## Resolution chain

Collections resolve **top → down**: top = theme (deepest), bottom wins (binds to the component). Each is one variable-mode collection (one mode axis); a mode set on a frame cascades to children, and a downstream collection overrides an upstream one by aliasing past it. The order is **global** — every component uses the order below, or a subset of it, never a reorder.

| # | Collection | Type | Modes |
|---|---|---|---|
| 1 | lightness | theme | light · dark |
| 2 | emphasis | theme | high · low |
| 3 | surface | context | canvas · sunken_1 · sunken_2 · raised · overlay · backdrop |
| 4 | intent |  | primary · secondary · tertiary |
| 5 | process | state | loaded · loading · empty · failed |
| 6 | status | state | none · info · success · warning · critical · fatal |
| 7 | selection | state | unselected · selected · indeterminate |
| 8 | interaction | state | regular · hover · active |
| 9 | focus | state | unfocused · focused |
| 10 | display | state | enabled · disabled · read_only |

**Naming note:** `display` = Confluence "Component state". `process` (*is async work happening?*) and `status` (*what is the semantic outcome?*) are Confluence's "System-process" and "Status" levels — two collections, not one, because they are orthogonal: a component can be in both at once (`loading` + `info`, `loaded` + `critical`) and one collection allows only one active mode. `empty` (process) and `none` (status) both read as "nothing" but are distinct: `empty` = a completed operation returned no data; `none` = no status signal active. `lightness`/`emphasis`/`surface`/`intent` are not states — listed only because they share the chain. Their `Type` cells use `theme` / `context`; `intent` is left blank — it is an author-chosen, user-centred axis that does not fit theme/context/state. "Variant" is deliberately avoided as a category name — it is reserved for Figma's component-variant feature.

**Surface — and why there is no `elevation` collection:** `surface` is the single depth collection — the substrate a component rests on, inherited from the parent and cascading to its children. Elevation (a component lifting *itself* — Card, Menu, Modal) is **not** a mode. A self-elevating component does not flip an `elevation` mode; its own per-state tokens alias the elevation tokens (`raised`, `overlay` — each a paired background + shadow) directly. For example `card.bg @ hover → raised`, `tooltip.bg @ idle → overlay`. A plain button reads `surface` only and never elevates itself. See [Semantic Elevation Tokens](../01-types/05-semantic-elevation-tokens.md).

---

## Dimension & typography modes

Four further mode collections control **size, spacing and text** rather than colour and state. Unlike the resolution chain above, they have **no fixed resolution order** — they are deliberately independent axes; any combination is valid (e.g. `compact` density + `lg` size). Each affects a different component category. See [Modes interplay](./99-modes-interplay.md).

| # | Collection | Modes | Affects |
|---|---|---|---|
| 1 | ui_scale | sm · md · lg | component dimensions — molecules (button, input, tag, pill, icon); default `md` |
| 2 | density | compact · standard · spacious | layout / outer spacing — organisms (table, list, form, card); default `standard` |
| 3 | typography-context | interface · prose | text rendering — text components; build-time choice |
| 4 | viewport | desktop · mobile | viewport-driven scaling — `mobile` (< 768px) applies a 1.25× multiplier |

---

## Mode reference

One-line definition of every mode. Meta-terms (*mode*, *collection*, *variable*) are defined in the [glossary](../../../01-introduction/glossary.md) — not repeated here. State definitions follow the Confluence "States concept"; `lightness` / `emphasis` follow their mode docs. Definitions marked *(provisional)* have no authoritative source yet.

### lightness · theme
| Mode | Definition |
|---|---|
| light | Light theme — bright surfaces, dark text; for well-lit environments. |
| dark | Dark theme — dark surfaces, light text; eases eye strain in low light. |

### emphasis · theme
| Mode | Definition |
|---|---|
| high | High emphasis — full-intensity colour, for primary actions, critical information and focal elements. |
| low | Low emphasis — reduced-intensity colour, for secondary actions, supporting content and background elements. |

### surface · context *(provisional)*
| Mode | Definition |
|---|---|
| canvas | The base substrate — the default page surface a component rests on. |
| sunken_1 | A surface recessed one step below the canvas. |
| sunken_2 | A surface recessed two steps below the canvas. |
| raised | A surface lifted above the canvas. |
| overlay | A floating surface above the page content — menus, popovers, dialogs. |
| backdrop | The scrim layer behind an overlay that dims the content beneath. |

### intent
| Mode | Definition |
|---|---|
| primary | The main action — highest prominence in the action hierarchy. |
| secondary | A supporting action — medium prominence. |
| tertiary | The lowest-prominence action. |

### process · state
| Mode | Definition |
|---|---|
| loaded | The operation completed and content is present — the resting state. |
| loading | An async operation is in progress; interaction is suppressed and a progress indicator shows. |
| empty | The operation completed successfully but returned no content. |
| failed | The operation did not complete — it errored (e.g. network or data error). |

### status · state
| Mode | Definition |
|---|---|
| none | No status signal active — the element carries no semantic meaning. |
| info | Neutral, informational meaning. |
| success | A positive outcome — e.g. validation passed. |
| warning | A cautionary meaning; not used for validation errors. |
| critical | A negative outcome — an error. |
| fatal | The most severe negative meaning — e.g. an Infobox-level failure. |

### selection · state
| Mode | Definition |
|---|---|
| unselected | The element is not chosen. |
| selected | A persistent choice — the element stays chosen, or its associated view is active. |
| indeterminate | A mixed / partial selection (e.g. a checkbox group); announced to screen readers as "partially checked". |

### interaction · state
| Mode | Definition |
|---|---|
| regular | The resting state — no interaction feedback. |
| hover | The pointer is over an enabled element, signalling it is interactive; not reachable by keyboard or touch. |
| active | The transient state while the element is pressed — between hover and release (a.k.a. pressed / down). |

### focus · state
| Mode | Definition |
|---|---|
| unfocused | The element does not hold input focus. |
| focused | The element holds input focus and is ready to receive input; triggered by mouse, touch or keyboard. |

### display · state
| Mode | Definition |
|---|---|
| enabled | Focusable and editable — available for interaction. |
| disabled | Not focusable and not editable; text may or may not be copyable. |
| read_only | Focusable but not editable; text may or may not be copyable. |

### ui_scale · dimension
| Mode | Definition |
|---|---|
| sm | Small — compact component dimensions, for data-heavy interfaces. |
| md | Medium — the default component size. |
| lg | Large — generous component dimensions, for accessibility and marketing contexts. |

### density · dimension
| Mode | Definition |
|---|---|
| compact | Minimal outer spacing — maximum information density (multiplier 0.75). |
| standard | Balanced outer spacing — the default (multiplier 1.0). |
| spacious | Generous outer spacing — breathing room for focus-intensive tasks (multiplier 1.5). |

### typography-context · typography
| Mode | Definition |
|---|---|
| interface | Compact typography for UI elements — navigation, forms, controls. |
| prose | Generous typography for reading content — articles, documentation, marketing. |

### viewport · environment
| Mode | Definition |
|---|---|
| desktop | Viewport ≥ 768px — standard scaling. |
| mobile | Viewport < 768px — applies a 1.25× scaling multiplier for touch. |

---

## Component × collection matrix (Button example)

| Button type | lightness | emphasis | surface | intent | process | status | selection | interaction | focus | display |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| button_icon_label | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ |
| button_icon | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ |
| button_teenage | ✓ | ✓ | ✓ | ~ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| button_navigation | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| button_segmented | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| button_toggle | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| button_split | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✓ |

✓ uses · ✗ not used · ~ limited. No button uses `status` (buttons carry no status). A button is flat — it reads `surface`, never elevates itself. Per-type detail: each button's `modes.md` under `04-components/01-button/`.

---

## Rules

- Every button: `status` unused (buttons carry no status — `process` only); `display` excludes `read_only` (inputs only).
- `button_navigation` references **static** dimension tokens — the master-layout must not be size-modable.
- `button_split`'s dropdown has an expanded/collapsed state — per Confluence documented with the component, not as a core state level.

---

## Disabled elements & focus

How collections resolve at the boundary. **Rule:** disabled controls are generally **not** focusable — removed from the tab sequence.

| | `<button disabled>` | `<button aria-disabled="true">` |
|---|---|---|
| Focusable | no | yes |
| Triggers its action | no | no — must be blocked in code |
| Submitted with the form | no | yes |
| Use when | fully inactive | stays discoverable/focusable but inactive |

WCAG does **not** forbid focusable disabled elements — it requires visible focus, clear programmatic state, predictable behaviour. So a focusable disabled element must expose `aria-disabled="true"`, not trigger its action, show a focus indicator, and stay readable.

**DS rule:** remove disabled controls from the tab sequence by default (native `disabled`). **Exception:** disabled items in composite widgets (menu, tabs, listbox, tree) may stay focusable via `aria-disabled="true"` when discoverability matters.

| Case | Focusable? | Approach |
|---|---|---|
| Standard button / form input | no | native `disabled` |
| Submit blocked until form valid | usually no | native `disabled`, or keep enabled + show validation |
| Menu / tab / listbox / tree item | sometimes | `aria-disabled="true"` if discoverability is needed |
| Custom component | depends | `aria-disabled="true"` only if it should stay focusable |

**Consequence:** all `button_*` are standard controls → native `disabled` → not focusable, so `display = disabled` **excludes** `focus`.

Composite-widget items are the exception. A disabled item inside a menu, tab list, listbox or tree is marked `aria-disabled="true"` (not the native attribute), so it **stays in the keyboard path** — arrow keys still land on it, letting the user reach it and hear that it is unavailable. For such an item `focus` keeps resolving even while `display = disabled`. Example: a disabled item in a dropdown menu can be `disabled` **and** `focused` at the same time — it shows a focus indicator while the user arrows past it, but pressing Enter does nothing.

---

## Open decisions

- [ ] Naming: `active` vs `pressed`
- [ ] Naming: Figma focus boolean — "Focus" vs "Focused"
- [ ] `surface` mode names — `sunken_1` / `sunken_2`
- [ ] Does `button_navigation` / `button_segmented` need `intent`?
- [ ] `visited` state — link-specific; in the concept or link-only?
- [x] ~~`system` merge~~ — resolved: split into `process` + `status` (orthogonal axes)
- [x] ~~numeric `elevation` collection~~ — resolved: dropped. Elevation lives in component state tokens that alias `raised` / `overlay`, not in a mode.
