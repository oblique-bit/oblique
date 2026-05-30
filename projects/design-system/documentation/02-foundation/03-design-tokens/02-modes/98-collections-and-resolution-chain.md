# Mode collections & resolution chain

**Status:** DRAFT — taxonomy 2026-05-29. Prefix scheme: `sys_` (six environment-driven) · bare word (eleven shared designer) · `component_aspect` (component). Category structure: 01 Shared (01.01 `sys_` · 01.02 Design) / 02 Component — internal taxonomy concepts, not Figma collection names.
**Purpose:** single source of truth for every mode collection — the resolution chain, per-mode definitions, and which component uses which.
**Related:** the States concept (`documentation/02-foundation/04-states.md`).

---

## Resolution chain

### Shared collections

**01 Shared** (internal category — not a Figma collection name). "Shared" names the mechanism: these collections **cascade top → down** through the frame tree — a mode set on an ancestor frame propagates to all descendant components. Most foundational first; most specific wins. Each collection is one variable-mode axis; the order is global — every component uses the order below, or a subset of it, never a reorder.

#### 01.01 System — `sys_`

Driven by enduser or environment context (brand/tenant, theme, device, locale, a11y preferences). Values are not set by the designer in Figma.

| # | Collection | Modes |
|---|---|---|
| 1 | `sys_brand` | oblique · bk · ZH · BE · LU · UR · SZ · OW · NW · GL · ZG · FR · SO · BS · BL · SH · AR · AI · SG · GR · AG · TG · TI · VD · VS · NE · GE · JU |
| 2 | `sys_lightness` | light · dark |
| 3 | `sys_contrast` | standard · high |
| 4 | `sys_viewport` | xs · sm · md · lg · xl · 2xl |
| 5 | `sys_motion` | on · off |
| 6 | `sys_language` | DE · FR · IT · EN · RM |

#### 01.02 Design

Designer-authored decisions set in Figma — surface context, emphasis, scale, interaction state axes, and more.

| # | Collection | Modes |
|---|---|---|
| 7 | `surface` | canvas · sunken_1 · sunken_2 · raised · overlay |
| 8 | `emphasis` | high · low |
| 9 | `scale` | sm · md · lg |
| 10 | `density` | compact · standard · spacious |
| 11 | `typography` | interface · prose |
| 12 | `interaction` | rest · pressed · hover · drag |
| 13 | `selection` | selected · unselected · indeterminate |
| 14 | `focus` | focused · unfocused |
| 15 | `access` | enabled · disabled · read_only |
| 16 | `process` | loaded · loading · empty · failed |
| 17 | `feedback` | info · resolved · critical · attention · fatal |

### Component collections

**02 Component** (internal category — not a Figma collection name). The defining split from 01 Shared: component collections **do not cascade**. A mode set on a parent frame does not propagate to child components of a different type — the component consumes its collection locally. Mode values are drawn from the central taxonomy; components do not invent new values. Component collections follow the `component_aspect` naming pattern (e.g. `button_intent`, `link_visit`, `input_fill`).

| Collection | Modes |
|---|---|
| `button_intent` | primary · secondary · tertiary |
| `link_visit` | standard · visited |
| `input_fill` | required · autofilled · aifilled |

> **Validation needed:** The cascading vs non-cascading split is a theoretical model. Whether Figma variable mode inheritance actually behaves this way across component boundaries must be confirmed in a PoC prototype before this taxonomy is treated as settled.

**Note on `process` and `feedback`:** these two are orthogonal — a component can be `loading` and `critical` at the same time. One collection = one active mode, so they must remain separate. `feedback` has no `none` mode — components that carry no feedback signal simply do not consume this collection.

---

## Mode reference

One-line definition of every mode.

### `sys_brand`

| Mode | Definition |
|---|---|
| oblique | Application context — standard product UI. |
| bk | Marketing context — landing pages, campaigns, promotional surfaces. |
| ZH | Canton of Zürich — cantonal brand palette. |
| BE | Canton of Bern / Berne — cantonal brand palette. |
| LU | Canton of Luzern — cantonal brand palette. |
| UR | Canton of Uri — cantonal brand palette. |
| SZ | Canton of Schwyz — cantonal brand palette. |
| OW | Canton of Obwalden — cantonal brand palette. |
| NW | Canton of Nidwalden — cantonal brand palette. |
| GL | Canton of Glarus — cantonal brand palette. |
| ZG | Canton of Zug — cantonal brand palette. |
| FR | Canton of Fribourg / Freiburg — cantonal brand palette. |
| SO | Canton of Solothurn — cantonal brand palette. |
| BS | Canton of Basel-Stadt — cantonal brand palette. |
| BL | Canton of Basel-Landschaft — cantonal brand palette. |
| SH | Canton of Schaffhausen — cantonal brand palette. |
| AR | Canton of Appenzell Ausserrhoden — cantonal brand palette. |
| AI | Canton of Appenzell Innerrhoden — cantonal brand palette. |
| SG | Canton of St. Gallen — cantonal brand palette. |
| GR | Canton of Graubünden / Grigioni / Grischun — cantonal brand palette. |
| AG | Canton of Aargau — cantonal brand palette. |
| TG | Canton of Thurgau — cantonal brand palette. |
| TI | Canton of Ticino — cantonal brand palette. |
| VD | Canton of Vaud — cantonal brand palette. |
| VS | Canton of Valais / Wallis — cantonal brand palette. |
| NE | Canton of Neuchâtel — cantonal brand palette. |
| GE | Canton of Genève — cantonal brand palette. |
| JU | Canton of Jura — cantonal brand palette. |

### `sys_lightness`

| Mode | Definition |
|---|---|
| light | Light theme — bright surfaces, dark text; for well-lit environments. |
| dark | Dark theme — dark surfaces, light text; eases eye strain in low light. |

### `sys_contrast`

| Mode | Definition |
|---|---|
| standard | Standard contrast — default colour intensity; meets WCAG AA. |
| high | High contrast — increased colour intensity for users who need stronger visual differentiation; targets WCAG AAA. |

### `surface`

| Mode | Definition |
|---|---|
| canvas | The page itself — baseline content surface. Default. Components here carry shadow to lift above it. |
| sunken_1 | Recessed region (light gray). Shadow weakens; components use a smaller shadow. |
| sunken_2 | Deep recess (mid-gray). Shadow cannot carry lift; components switch to border instead. |
| raised | In-layout elevated surface. A component on a raised parent uses its own tokens to lift above it. |
| overlay | Out-of-layout floating surface. Component tokens are context-independent; `surface` is not consumed. |

**Rule:** `surface` is available in the resolution chain and cascades from container frames to children. Whether a component's tokens vary by it is a per-component decision made at token-authoring time — the system offers the axis, the component designer decides whether to consume it.

### `emphasis`

| Mode | Definition |
|---|---|
| high | High emphasis — full-intensity colour, for primary actions, critical information and focal elements. |
| low | Low emphasis — reduced-intensity colour, for secondary actions, supporting content and background elements. |

### `sys_viewport`

| Mode | Definition |
|---|---|
| xs | Extra-small viewport — narrowest breakpoint. |
| sm | Small viewport. |
| md | Medium viewport — default. |
| lg | Large viewport. |
| xl | Extra-large viewport. |
| 2xl | Double extra-large viewport — widest breakpoint. |

### `scale`

| Mode | Definition |
|---|---|
| sm | Small — compact component dimensions, for data-heavy interfaces. |
| md | Medium — the default component size. |
| lg | Large — generous component dimensions, for accessibility and marketing contexts. |

### `density`

| Mode | Definition |
|---|---|
| compact | Minimal outer spacing — maximum information density (multiplier 0.75). |
| standard | Balanced outer spacing — the default (multiplier 1.0). |
| spacious | Generous outer spacing — breathing room for focus-intensive tasks (multiplier 1.5). |

### `sys_motion`

| Mode | Definition |
|---|---|
| on | Standard motion — transitions and animations play at full speed. |
| off | Reduced motion — transitions suppressed or minimised; honours `prefers-reduced-motion: reduce`. |

### `typography`

| Mode | Definition |
|---|---|
| interface | Compact typography for UI elements — navigation, forms, controls. |
| prose | Generous typography for reading content — articles, documentation, marketing. |

### `sys_language`

| Mode | Definition |
|---|---|
| DE | German — default language. |
| FR | French. |
| IT | Italian. |
| EN | English. |
| RM | Romansh. |

### `access`

| Mode | Definition |
|---|---|
| enabled | Focusable and editable — available for interaction. |
| disabled | Not focusable and not editable; text may or may not be copyable. |
| read_only | Focusable but not editable; text may or may not be copyable. |

### `interaction`

| Mode | Definition |
|---|---|
| rest | The resting state — no interaction feedback. |
| pressed | The transient state while the element is pressed — between pointer-down and release (a.k.a. active / down). |
| hover | The pointer is over an enabled element, signalling it is interactive; not reachable by keyboard or touch. |
| drag | The element is being dragged. |

### `selection`

| Mode | Definition |
|---|---|
| selected | A persistent choice — the element stays chosen, or its associated view is active. |
| unselected | The element is not chosen. |
| indeterminate | A mixed / partial selection (e.g. a checkbox group); announced to screen readers as "partially checked". |

### `focus`

| Mode | Definition |
|---|---|
| focused | The element holds input focus and is ready to receive input; triggered by mouse, touch or keyboard. |
| unfocused | The element does not hold input focus. |

### `feedback`

| Mode | Definition |
|---|---|
| info | Neutral, informational meaning. |
| resolved | A positive outcome — e.g. validation passed. |
| critical | A negative outcome — an error. |
| attention | A cautionary meaning; not used for validation errors. |
| fatal | The most severe negative meaning — e.g. an Infobox-level failure. |

Used by components that carry a semantic feedback signal — e.g. `infobox`, `badge`, `pill`, `progress_bar`, `stepper`, and probably others. Components that carry no feedback signal (e.g. `button`) do not consume this collection.

### `process`

| Mode | Definition |
|---|---|
| loaded | The operation completed and content is present — the resting state. |
| loading | An async operation is in progress; interaction is suppressed and a progress indicator shows. |
| empty | The operation completed successfully but returned no content. |
| failed | The operation did not complete — it errored (e.g. network or data error). |

### `button_intent`

| Mode | Definition |
|---|---|
| primary | The main action — highest prominence in the action hierarchy. |
| secondary | A supporting action — medium prominence. |
| tertiary | The lowest-prominence action. |

### `link_visit`

| Mode | Definition |
|---|---|
| standard | An unvisited link. |
| visited | A link the user has already followed; colour-coded to aid navigation history. |

### `input_fill`

| Mode | Definition |
|---|---|
| required | The field must be filled before the form can be submitted. |
| autofilled | The value was populated automatically by the browser or operating system. |
| aifilled | The value was populated or suggested by an AI assistant. |

---

## Component × collection matrix (Button example)

| Button type | sys_lightness | emphasis | scale | access | interaction | focus | process | feedback | selection | button_intent |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| button_icon_label | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| button_icon | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| button_teenage | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ~ |
| button_navigation | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| button_segmented | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| button_toggle | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ |
| button_split | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |

✓ uses · ✗ not used · ~ limited. No button uses `feedback` (buttons carry no feedback signal — `process` only). `access` excludes `read_only` for all buttons (inputs only). Per-type detail: each button's `modes.md` under `04-components/01-button/`.

---

## Rules

- Every button: `feedback` unused; `access` excludes `read_only` (inputs only).
- `button_navigation` references **static** dimension tokens — must not be scale-modable (`scale` excluded).
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

**Consequence:** all `button_*` are standard controls → native `disabled` → not focusable, so `access = disabled` **excludes** `focus = focused`.

Composite-widget items are the exception. A disabled item inside a menu, tab list, listbox or tree is marked `aria-disabled="true"` — it stays in the keyboard path so the user can reach it and hear that it is unavailable. Such an item can be `disabled` **and** `focused` at the same time.

---

## Open decisions

- [x] ~~Naming: `active` vs `pressed` (`interaction`)~~ — resolved: `pressed`
- [x] ~~Naming: Figma focus boolean — "Focus" vs "Focused"~~ — resolved: `focused` (adjective pattern: `focused` · `selected` · `disabled`)
- [ ] `sys_viewport` — exact px breakpoint values for xs · sm · md · lg · xl · 2xl
- [x] ~~Does `button_navigation` / `button_segmented` need `button_intent`?~~ — resolved: no; selection state covered by `selection`
- [x] ~~`availability` collection name~~ — resolved: `access` (10 chars vs 16; `availability` parked as 2nd alt; `display` rejected — CSS collision)
- [x] ~~prefix scheme~~ — resolved: `sys_` (six environment-driven) · bare word (eleven shared designer) · `component_aspect` (component). Categories 01 Shared / 02 Component are internal taxonomy concepts.
- [x] ~~`visited` state~~ — resolved: `link_visit · standard · visited`
- [x] ~~`drag` mode~~ — resolved: included in `interaction`
- [x] ~~`system` merge~~ — resolved: split into `process` + `feedback` (orthogonal axes)
- [x] ~~numeric `elevation` collection~~ — resolved: dropped; elevation lives in component state tokens that alias raised / overlay, not in a mode
