# button_vd1 — clean-room build scripts

Recreate the `button_vd1` component in two phases. Splitting **build** from **bind**
guarantees no ghost variable modes: phase 1 references nothing, phase 2 binds only
to LOCAL variables looked up by name.

## Why two phases

A "ghost" variable-mode picker appears whenever any node consumes a variable from
an external library. Building the structure with static values first, then binding
strictly to local variables by name, makes a remote reference impossible — if a
variable isn't local, `02` throws instead of falling back to a library copy.

## Run order

From the figma-ds-cli package dir, with the target file active in Figma:

```
figma-ds-cli eval --file 01-build-structure.js   # creates button_vd1, static values
figma-ds-cli eval --file 02-bind-local-variables.js  # binds every part to local vars
```

## Prerequisites in the target file

- All `vd1_*` variable collections present locally (`vd1_base`, `vd1_interaction`,
  `vd1_focus`, `vd1_display`, `vd1_system`, …) — export them from Token Studio first.
- A local icon component (default `icon/download`; edit `ICON_NAME` in `01`).
- A page named `button` (falls back to the current page).

## What gets built

`button_vd1` COMPONENT (horizontal auto-layout) →
`icon_left`, `label_system`, `label_designer`, `icon_right`, `focus_ring` (absolute).
Component properties: `label-text` (TEXT), `icon-left` / `icon-right` (BOOLEAN).

## Bindings (phase 2)

| Part | Property | Local variable |
|---|---|---|
| frame | padding / gap / min-height / radius / border-width | `vd1_base` layout/* |
| frame | fill / stroke | `vd1_display` color/bg, color/border |
| frame | opacity | `vd1_system` opacity |
| frame | 2 drop shadows (x/y/blur/spread) | `vd1_interaction` shadow/* |
| frame | shadow colours | `vd1_base` shadow/*/color |
| labels | typography (family/size/weight/line-height/letter-spacing) | `vd1_base` typography/* |
| labels | fill | `vd1_display` color/fg |
| label_system | characters / visible | `vd1_system` label, show/system_label |
| label_designer | visible | `vd1_system` show/designer_label |
| label_designer | characters | `label-text` component property |
| icons | glyph fill | `vd1_display` color/fg |
| icons | visible | `icon-left` / `icon-right` component property |
| focus_ring | visible | `vd1_display` focus_ring/visible |
| focus_ring | radius / stroke-weight / stroke colour | `vd1_base` focus_ring/* |
