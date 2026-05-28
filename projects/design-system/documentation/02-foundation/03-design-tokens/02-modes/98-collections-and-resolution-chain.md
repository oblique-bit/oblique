# Mode collections & resolution chain

**Status:** DRAFT — naming updated 2026-05-28; collection names carry category prefixes (COR_ / STS_ / CMP_).
**Purpose:** single source of truth for every mode collection — the resolution chain, per-mode definitions, and which component uses which.
**Related:** the States concept (`documentation/02-foundation/04-states.md`).

---

## Category prefixes

The prefix on every collection name signals which category it belongs to. Categories are invisible in tokens and in Figma — only the prefixed collection names appear.

| Prefix | Category | What it covers |
|---|---|---|
| `COR_` | core | Environment, dimensions, typography — set globally or per section; cascades down |
| `STS_` | states | Interactive behaviour — availability, interaction, selection, focus, feedback, process; cascades down |
| `CMP_` | component | Component-specific axes — not cascading; scoped to one component type |

---

## Resolution chain

Collections resolve **top → down**: top = most foundational (global theme), bottom wins (most specific, binds to the component). Each collection is one variable-mode axis; a mode set on a frame cascades to children, and a downstream collection overrides an upstream one by aliasing past it. The order is **global** — every component uses the order below, or a subset of it, never a reorder.

### Core collections

| # | Collection | Modes |
|---|---|---|
| 1 | `COR_brand` | app · marketing |
| 2 | `COR_lightness` | light · dark |
| 3 | `COR_emphasis` | high · low |
| 4 | `COR_viewport` | xs · sm · md · lg · xl · 2xl |
| 5 | `COR_scale` | sm · md · lg |
| 6 | `COR_density` | compact · standard · spacious |
| 7 | `COR_motion` | on · off |
| 8 | `COR_typography` | interface · prose |

### State collections

| # | Collection | Modes |
|---|---|---|
| 9 | `STS_availability` | enabled · disabled · read_only |
| 10 | `STS_interaction` | rest · active · hover · drag |
| 11 | `STS_selection` | selected · unselected · indeterminate |
| 12 | `STS_focus` | focused · unfocused |
| 13 | `STS_feedback` | info · resolved · critical · attention · fatal |
| 14 | `STS_process` | loaded · loading · empty · failed |

### Component collections

Component collections are **not cascading** — they are scoped to one component type. A mode set on a parent frame does not propagate to child components of a different type. Mode values are drawn from the central taxonomy; components do not invent new values.

| Collection | Modes |
|---|---|
| `CMP_button` | primary · secondary · tertiary |
| `CMP_link` | standard · visited |
| `CMP_input` | required · autofilled · aifilled |

**Note on `STS_process` and `STS_feedback`:** these two are orthogonal — a component can be `loading` and `critical` at the same time. One collection = one active mode, so they must remain separate. `STS_feedback` has no `none` mode — components that carry no feedback signal simply do not consume this collection.

---

## Mode reference

One-line definition of every mode.

### `COR_brand`

| Mode | Definition |
|---|---|
| app | Application context — standard product UI. |
| marketing | Marketing context — landing pages, campaigns, promotional surfaces. |

### `COR_lightness`

| Mode | Definition |
|---|---|
| light | Light theme — bright surfaces, dark text; for well-lit environments. |
| dark | Dark theme — dark surfaces, light text; eases eye strain in low light. |

### `COR_emphasis`

| Mode | Definition |
|---|---|
| high | High emphasis — full-intensity colour, for primary actions, critical information and focal elements. |
| low | Low emphasis — reduced-intensity colour, for secondary actions, supporting content and background elements. |

### `COR_viewport`

| Mode | Definition |
|---|---|
| xs | Extra-small viewport — narrowest breakpoint. |
| sm | Small viewport. |
| md | Medium viewport — default. |
| lg | Large viewport. |
| xl | Extra-large viewport. |
| 2xl | Double extra-large viewport — widest breakpoint. |

### `COR_scale`

| Mode | Definition |
|---|---|
| sm | Small — compact component dimensions, for data-heavy interfaces. |
| md | Medium — the default component size. |
| lg | Large — generous component dimensions, for accessibility and marketing contexts. |

### `COR_density`

| Mode | Definition |
|---|---|
| compact | Minimal outer spacing — maximum information density (multiplier 0.75). |
| standard | Balanced outer spacing — the default (multiplier 1.0). |
| spacious | Generous outer spacing — breathing room for focus-intensive tasks (multiplier 1.5). |

### `COR_motion`

| Mode | Definition |
|---|---|
| on | Standard motion — transitions and animations play at full speed. |
| off | Reduced motion — transitions suppressed or minimised; honours `prefers-reduced-motion: reduce`. |

### `COR_typography`

| Mode | Definition |
|---|---|
| interface | Compact typography for UI elements — navigation, forms, controls. |
| prose | Generous typography for reading content — articles, documentation, marketing. |

### `STS_availability`

| Mode | Definition |
|---|---|
| enabled | Focusable and editable — available for interaction. |
| disabled | Not focusable and not editable; text may or may not be copyable. |
| read_only | Focusable but not editable; text may or may not be copyable. |

### `STS_interaction`

| Mode | Definition |
|---|---|
| rest | The resting state — no interaction feedback. |
| active | The transient state while the element is pressed — between hover and release (a.k.a. pressed / down). |
| hover | The pointer is over an enabled element, signalling it is interactive; not reachable by keyboard or touch. |
| drag | The element is being dragged. |

### `STS_selection`

| Mode | Definition |
|---|---|
| selected | A persistent choice — the element stays chosen, or its associated view is active. |
| unselected | The element is not chosen. |
| indeterminate | A mixed / partial selection (e.g. a checkbox group); announced to screen readers as "partially checked". |

### `STS_focus`

| Mode | Definition |
|---|---|
| focused | The element holds input focus and is ready to receive input; triggered by mouse, touch or keyboard. |
| unfocused | The element does not hold input focus. |

### `STS_feedback`

| Mode | Definition |
|---|---|
| info | Neutral, informational meaning. |
| resolved | A positive outcome — e.g. validation passed. |
| critical | A negative outcome — an error. |
| attention | A cautionary meaning; not used for validation errors. |
| fatal | The most severe negative meaning — e.g. an Infobox-level failure. |

Used by components that carry a semantic feedback signal: Infobox, Badge, Pill. Components that carry no feedback signal (e.g. Button) do not consume this collection.

### `STS_process`

| Mode | Definition |
|---|---|
| loaded | The operation completed and content is present — the resting state. |
| loading | An async operation is in progress; interaction is suppressed and a progress indicator shows. |
| empty | The operation completed successfully but returned no content. |
| failed | The operation did not complete — it errored (e.g. network or data error). |

### `CMP_button`

| Mode | Definition |
|---|---|
| primary | The main action — highest prominence in the action hierarchy. |
| secondary | A supporting action — medium prominence. |
| tertiary | The lowest-prominence action. |

### `CMP_link`

| Mode | Definition |
|---|---|
| standard | An unvisited link. |
| visited | A link the user has already followed; colour-coded to aid navigation history. |

### `CMP_input`

| Mode | Definition |
|---|---|
| required | The field must be filled before the form can be submitted. |
| autofilled | The value was populated automatically by the browser or operating system. |
| aifilled | The value was populated or suggested by an AI assistant. |

---

## Component × collection matrix (Button example)

| Button type | COR_lightness | COR_emphasis | COR_scale | STS_availability | STS_interaction | STS_focus | STS_process | STS_feedback | STS_selection | CMP_button |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| button_icon_label | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| button_icon | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| button_teenage | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ~ |
| button_navigation | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| button_segmented | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| button_toggle | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ |
| button_split | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |

✓ uses · ✗ not used · ~ limited. No button uses `STS_feedback` (buttons carry no feedback signal — `STS_process` only). `STS_availability` excludes `read_only` for all buttons (inputs only). Per-type detail: each button's `modes.md` under `04-components/01-button/`.

---

## Rules

- Every button: `STS_feedback` unused; `STS_availability` excludes `read_only` (inputs only).
- `button_navigation` references **static** dimension tokens — must not be scale-modable (`COR_scale` excluded).
- `button_split`'s dropdown has an expanded/collapsed state — documented with the component, not as a core state level.

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

**Consequence:** all `button_*` are standard controls → native `disabled` → not focusable, so `STS_availability = disabled` **excludes** `STS_focus = focused`.

Composite-widget items are the exception. A disabled item inside a menu, tab list, listbox or tree is marked `aria-disabled="true"` — it stays in the keyboard path so the user can reach it and hear that it is unavailable. Such an item can be `disabled` **and** `focused` at the same time.

---

## Open decisions

- [ ] Naming: `active` vs `pressed` (`STS_interaction`)
- [ ] Naming: Figma focus boolean — "Focus" vs "Focused"
- [ ] `COR_viewport` — exact px breakpoint values for xs · sm · md · lg · xl · 2xl
- [ ] Does `button_navigation` / `button_segmented` need `CMP_button`?
- [x] ~~`visited` state~~ — resolved: `CMP_link · standard · visited`
- [x] ~~`drag` mode~~ — resolved: included in `STS_interaction`
- [x] ~~`system` merge~~ — resolved: split into `STS_process` + `STS_feedback` (orthogonal axes)
- [x] ~~numeric `elevation` collection~~ — resolved: dropped; elevation lives in component state tokens that alias raised / overlay, not in a mode
