# Motion Tokens

> Primitive duration steps (instant, fast, medium, slow, slower) and easing curves (linear, ease_out, ease_in, ease_in_out). Referenced by semantic motion tokens.
>
> *(`ob.p.motion.token_family_docs.description` — [`02_primitive/motion.json`](../../src/lib/themes/02_primitive/motion.json). The semantic layer has no single family description; it carries one per sub-family, quoted in the sections below.)*

## At a glance

| Layer | Path | Source files | Purpose |
|---|---|---|---|
| **Primitive** | `ob.p.motion.duration.*`, `ob.p.motion.easing.*` | [`02_primitive/motion.json`](../../src/lib/themes/02_primitive/motion.json) | Atomic timing steps and curves. Not for direct consumption. |
| **Semantic — static** | `ob.s.motion.easing.*` | [`03_semantic/motion/static.json`](../../src/lib/themes/03_semantic/motion/static.json) | 4 named curves. Identical in both motion modes. |
| **Semantic — mode** | `ob.s.motion.duration.*` | [`03_semantic/motion/mode/enabled.json`](../../src/lib/themes/03_semantic/motion/mode/enabled.json), [`disabled.json`](../../src/lib/themes/03_semantic/motion/mode/disabled.json) | 5 named durations. Re-resolve when the motion mode switches. |
| **HTML** | `ob.h.{element}.motion.*` | [`05_html/link/link.json`](../../src/lib/themes/05_html/link/link.json) | Consumes the semantic motion tokens. |

Motion is the one token category with **no Figma binding at all**. Figma has no variable type for `duration` or `cubicBezier`, and neither is exportable as a Figma Style, so motion tokens ship in CSS only — see [`../02-token-tiers/00-overview.md`](../02-token-tiers/00-overview.md).

Motion is also one of the system's seven **mode collections**. The token-side effect is covered in [The `motion` mode](#the-motion-mode) below; see [`../04-modes/07-motion.md`](../04-modes/07-motion.md) for the mode mechanics.

---

## Primitive layer

Two sub-families, 9 tokens.

### `ob.p.motion.duration.*` — 5 steps

| Token | `$value` | `$description` |
|---|---|---|
| `instant` | `0ms` | For immediate state changes with no transition |
| `fast` | `100ms` | For micro-interactions like button hovers |
| `medium` | `200ms` | For tooltip appearances and simple transitions |
| `slow` | `300ms` | For modal appearances and complex transitions |
| `slower` | `500ms` | For page transitions and major layout changes |

`$type` is `duration` — an official W3C DTCG scalar type. The `ms` unit is part of the value.

### `ob.p.motion.easing.*` — 4 curves

| Token | `$value` | `$description` |
|---|---|---|
| `linear` | `cubic-bezier(0, 0, 1, 1)` | Linear motion with no acceleration |
| `ease_out` | `cubic-bezier(0, 0, 0.2, 1)` | Starts fast, ends slow - good for entrances |
| `ease_in` | `cubic-bezier(0.4, 0, 1, 1)` | Starts slow, ends fast - good for exits |
| `ease_in_out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Slow start and end - good for emphasis |

`$type` is `cubicBezier`, also an official W3C scalar type.

> Primitives are atomic and context-agnostic. They must not be consumed directly by components.

---

## Semantic layer: easing is static, duration is mode-scoped

The two sub-families are split across files by whether the motion mode changes them.

| Sub-family | File(s) | Mode-scoped | Tokens |
|---|---|---|---|
| `ob.s.motion.easing.*` | `motion/static.json` | no | 4 |
| `ob.s.motion.duration.*` | `motion/mode/enabled.json`, `motion/mode/disabled.json` | yes | 5 per mode |

### `ob.s.motion.easing.*` — the curves

> Mode-independent easing curve tokens — standard, entrance, exit, and emphasis. Not affected by motion mode.
>
> *(`$description` from `motion/static.json`)*

| Token | Resolves to | `$description` |
|---|---|---|
| `standard` | `ob.p.motion.easing.ease_out` | Default easing for most UI animations |
| `entrance` | `ob.p.motion.easing.ease_out` | For elements entering the screen |
| `exit` | `ob.p.motion.easing.ease_in` | For elements leaving the screen |
| `emphasis` | `ob.p.motion.easing.ease_in_out` | For attention-drawing animations |

`standard` and `entrance` both resolve to `ease_out` today. They stay separate tokens because their `$description` records different intents — a later change to one does not have to change the other.

### `ob.s.motion.duration.*` — the durations

> Motion tokens for the Enabled motion mode — durations from instant to relaxed for animated UI interactions.
>
> *(`$description` from `motion/mode/enabled.json`)*

| Token | `$description` (from `enabled.json`) |
|---|---|
| `instant` | No animation - immediate state changes |
| `micro` | For hover states, focus rings, and micro-interactions |
| `smooth` | For tooltips, dropdowns, and smooth transitions |
| `comfortable` | For modals, sidebars, and prominent UI changes |
| `relaxed` | For page transitions and major layout shifts |

The primitive names describe raw magnitude (`fast`, `slow`); the semantic names describe interaction weight (`micro`, `smooth`, `comfortable`, `relaxed`). `instant` is the one name shared across both layers.

---

## The `motion` mode

`motion` is one of the seven mode collections — alongside `lightness`, `emphasis`, `ui_scale`, `density`, `typography_context` and `viewport`. It has two modes: **`enabled`** and **`disabled`**.

The collection is registered at the global tier in [`01_global/mode_collection/motion.json`](../../src/lib/themes/01_global/mode_collection/motion.json):

> Motion mode collection — animation preference. Modes: enabled (the base — no class is applied), disabled (.ob-motion-disabled). Each mode carries the CSS class string the application adds to `<body>` to activate it.
>
> *(`ob.g.mode_collection.motion.token_family_docs.$description`)*

| Mode | Selector | Activation |
|---|---|---|
| `enabled` | `default` | The base mode. No class is applied; it is the first-paint default. |
| `disabled` | `.ob-motion-disabled` | The application adds the class to `<body>`. |

### What the two mode files differ on

Only `ob.s.motion.duration.*`. Nothing else in the category is duplicated per mode.

| Token | `enabled.json` resolves to | `disabled.json` resolves to |
|---|---|---|
| `instant` | `ob.p.motion.duration.instant` → `0ms` | `ob.p.motion.duration.instant` → `0ms` |
| `micro` | `ob.p.motion.duration.fast` → `100ms` | `ob.p.motion.duration.instant` → `0ms` |
| `smooth` | `ob.p.motion.duration.medium` → `200ms` | `ob.p.motion.duration.instant` → `0ms` |
| `comfortable` | `ob.p.motion.duration.slow` → `300ms` | `ob.p.motion.duration.instant` → `0ms` |
| `relaxed` | `ob.p.motion.duration.slower` → `500ms` | `ob.p.motion.duration.instant` → `0ms` |

In `disabled.json` the four non-instant tokens carry the `$description` "Reduced motion: instant transition", and the file's own family description states the intent:

> Motion tokens for the Disabled motion mode — all durations set to zero for reduced-motion accessibility.
>
> *(`$description` from `motion/mode/disabled.json`)*

**Easing is not duplicated per mode.** `motion/static.json` is loaded whichever motion mode is active, so the four curves are identical in both.

### How it lands in CSS

The base block carries the `enabled` values; a single class block overrides what changes.

```css
:root {
  --ob-s-motion-duration-instant:     0ms;
  --ob-s-motion-duration-micro:       100ms;
  --ob-s-motion-duration-smooth:      200ms;
  --ob-s-motion-duration-comfortable: 300ms;
  --ob-s-motion-duration-relaxed:     500ms;
  --ob-s-motion-easing-standard: cubic-bezier(0, 0, 0.2, 1);
}

.ob-motion-disabled {
  --ob-s-motion-duration-micro:       0ms;
  --ob-s-motion-duration-smooth:      0ms;
  --ob-s-motion-duration-comfortable: 0ms;
  --ob-s-motion-duration-relaxed:     0ms;
}
```

`--ob-s-motion-duration-instant` is not re-emitted in the override block — its value is already `0ms` in both modes.

The token source does not wire `.ob-motion-disabled` to any media query. Per the mode collection's description, applying the class is the application's job.

---

## Consumption

`ob.h.link.motion.duration` → `{ob.s.motion.duration.micro}` and `ob.h.link.motion.easing` → `{ob.s.motion.easing.standard}` in [`05_html/link/link.json`](../../src/lib/themes/05_html/link/link.json) are the only consumers of motion tokens in the token source today.

---

## Naming conventions

```
ob.p.motion.<sub_family>.<step>       primitive
ob.s.motion.<sub_family>.<name>       semantic
ob.h.<element>.motion.<sub_family>    HTML element
```

- `<sub_family>` ∈ `duration | easing`
- Primitive `<step>` ∈ `instant, fast, medium, slow, slower` (duration) / `linear, ease_out, ease_in, ease_in_out` (easing)
- Semantic `<name>` ∈ `instant, micro, smooth, comfortable, relaxed` (duration) / `standard, entrance, exit, emphasis` (easing)

The `{type}` path segment is `motion` at every tier. Per [`../02-token-tiers/00-overview.md`](../02-token-tiers/00-overview.md) the segment maps to two `$type` values: `duration` and `cubicBezier`.

---

## Related docs

- [`../02-token-tiers/02-primitive.md`](../02-token-tiers/02-primitive.md) — Primitive layer architecture
- [`../02-token-tiers/03-semantic.md`](../02-token-tiers/03-semantic.md) — Semantic layer architecture
- [`../04-modes/00-overview.md`](../04-modes/00-overview.md) — How modes work and the last-wins resolution rule
- [`../04-modes/07-motion.md`](../04-modes/07-motion.md) — Motion mode mechanics: the two modes, the class, and what the mode does not change
- [`../01-introduction/01-architecture.md`](../01-introduction/01-architecture.md) — The mode collection files and the `selector` pattern
- [`../02-token-tiers/00-overview.md`](../02-token-tiers/00-overview.md) — `duration` and `cubicBezier` types, and why neither binds to a Figma variable
