# Motion Mode (Enabled/Disabled)

**Accessibility mode collection that switches animation on or off**

---

## **Overview**

The **motion** mode collection carries the animation preference. It has two
modes — `enabled` and `disabled`. Switching to `disabled` collapses every
semantic duration token to `0ms`, so animated transitions resolve to an
immediate state change.

The point of the mode is that components do not branch. A component keeps
referencing the same duration token; the active mode decides whether that
token resolves to a real duration or to zero. No component needs a separate
no-animation variant.

Like lightness, motion is an end-user accessibility preference, not a
product-design decision: the person using the interface decides whether they
want animation. Density and UI Scale, by contrast, are set per interface by
the product designer.

## **Implementation**

### **Mode Files**

Located in: `03_semantic/motion/`

- **`mode/enabled.json`** — the base mode. The five semantic durations
  resolve to the primitive steps `instant` / `fast` / `medium` / `slow` /
  `slower`.
- **`mode/disabled.json`** — every duration resolves to
  `ob.p.motion.duration.instant` (`0ms`).
- **`static.json`** — the four easing curves. Mode-independent: this file is
  loaded whichever motion mode is active, so the curves are identical in
  both.

Only `ob.s.motion.duration.*` differs between the two modes. Easing is not
duplicated per mode.

### **Token Architecture**

**Structure Pattern:**
```json
{
  "ob": {
    "s": {
      "motion": {
        "duration": {
          "micro": {
            "$value": "{ob.p.motion.duration.fast}",     // enabled.json  → 100ms
            "$value": "{ob.p.motion.duration.instant}"   // disabled.json →   0ms
          }
        }
      }
    }
  }
}
```

### **Reference Chain**
```
Components → ob.s Motion (Duration) → ob.p Motion Primitives
                        ↑
              Mode switching occurs here
```

### **Mode Collection Registration**

The collection is registered at the global tier in
`01_global/mode_collection/motion.json`, which holds one `selector` per
mode:

| Mode | Selector | Activation |
|---|---|---|
| `enabled` | `default` | The base mode. No class is applied; it is the first-paint default. |
| `disabled` | `.ob-motion-disabled` | The application adds the class to `<body>`. |

### **For Developers**

Apply the disabled mode by adding `.ob-motion-disabled` to `<body>`. Enabled
is the base — no class needed.

The token source does not wire that class to a media query. The generated
CSS contains no `@media (prefers-reduced-motion: reduce)` block, so mapping
the operating-system preference to the class is the application's job. The
preference is exposed to CSS as `prefers-reduced-motion: reduce` and to
script through `matchMedia`. An in-app toggle can override it, the same way
lightness pairs automatic detection with a manual switch.

### **For Designers**

Motion has no Figma counterpart — see *In Figma* below. Record motion intent
in the specification and in prototype settings, and describe the reduced
variant in words rather than as a Figma mode.

## **Scope: what the motion mode changes**

**Motion mode controls:**
- `ob.s.motion.duration.*` — the five semantic durations, and everything
  that references them

**Motion mode does not control:**
- Easing curves (`ob.s.motion.easing.*`) — identical in both modes
- Anything outside the motion category — color, dimension, typography and
  border tokens are untouched

Disabling motion shortens the transition to zero; it does not remove the
transition declaration. The end state is the same in both modes.

For the token values themselves — the primitive steps, the five semantic
duration names, the four easing curves and how they land in CSS — see
[Motion Tokens](../01-types/02-categories/04-motion-tokens.md). This page
covers the mode mechanics only.

## **In Figma**

Motion is the one mode collection with **no Figma variable collection**.
Figma has no variable type for `duration` or `cubicBezier`, so there is
nothing to bind and no Figma mode to switch — the motion mode exists in CSS
only. Every other mode collection surfaces as a Figma variable collection
with one Figma mode per Oblique mode. See
[Token Types](../04-token-types.md) for the type-by-type Figma support
table.

## **Relation to the other mode collections**

Motion changes timing and nothing else, so it combines with any state of the
other six collections without conflict: a disabled-motion interface can be
dark, high-emphasis, compact, `lg`, prose and `2xl` at the same time. See
[Modes Interplay](./99-modes-interplay.md) for how the modes combine.

---

*Motion mode turns the reduced-motion preference into a single token-level
switch, so honouring it costs a class on `<body>` rather than a change in
every component.*
