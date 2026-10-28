# Elevation Mode (level2 / level1 / level0 / level-1)

**Surface level mode collection that switches the background of a surface and the Button backgrounds that depend on it**

---

## **Overview**

The **elevation** mode collection describes the level of the surface a component sits on. It has four modes: `level2`, `level1`, `level0` (the base surface, such as the page) and `level-1`. Switching the mode on a container changes the background of that container and the Button backgrounds on it.

The mode does not add new colors. It picks a step of the existing contrast ladder of the background tokens:

| Mode | Background step |
|---|---|
| `level2` | `contrast_medium` |
| `level1` | `contrast_high` |
| `level0` | `contrast_highest` |
| `level-1` | `contrast_highest`, and in dark mode `cobalt.900` for the neutral surface |

`level0` is the base mode and the first-paint default. The names carry a number only. For the neutral surface (`inversity_normal`) a higher level is a darker surface in light mode and a lighter one in dark mode, so the names do not promise "above" or "below". The elevation changes only the neutral surface and the Button backgrounds. A status surface is the same on every level.

`level-1` is the level below `level0`. It differs from `level0` only for the neutral surface in dark mode: `cobalt.900` is one step darker than `contrast_highest` (`cobalt.800`). In light mode `level-1` is the same as `level0` (white), because no lighter surface exists. The Button backgrounds are the same as in `level0`. The minus sign is part of the mode name.

## **Implementation**

### **Mode Files**

- **`01_global/mode_collection/elevation.json`** — registers the four modes and the CSS class of each mode.
- **`03_semantic/color/elevation/level_minus_1.json`, `level_0.json`, `level_1.json`, `level_2.json`** — the `surface` background tokens. One file per mode. The files keep the underscore names of the first draft: `level_minus_1` is `level-1`, `level_0` is `level0`, and so on.
- **`03_semantic/color/elevation/level_minus_1_color/`** — helper sets (`lightness/light.json`, `lightness/dark.json`) with the neutral surface of `level-1`. They follow lightness, so the mode can pick them. The dark value points to `cobalt.900`, the other values to the same primitives as `contrast_highest`.
- **`05_html/button/01_color/elevation/level_minus_1.json`, `level_0.json`, `level_1.json`, `level_2.json`** — the Button background tokens that follow the mode.
- **`05_html/button/01_color/elevation/level_2_color/`** — helper sets (`lightness/light.json`, `lightness/dark.json`, `emphasis/high.json`, `emphasis/low.json`) with the Button colors used on a `level2` surface. They follow lightness and emphasis, so the mode can pick them.

### **Surface Tokens**

The family `neutral` gets a `surface` token that follows the mode. The status families do not get one: a status surface does not change with the elevation.

```json
{
  "ob": {
    "s": {
      "color": {
        "neutral": {
          "bg": {
            "surface": {
              "inversity_normal": {
                "$value": "{ob.s.color.neutral.bg.contrast_highest.inversity_normal}"  // level0
              }
            }
          }
        }
      }
    }
  }
}
```

In `level1` the same token points to `contrast_high`, in `level2` to `contrast_medium`. In `level-1` the token points to the helper token `ob.s1.color.neutral.bg.level_minus_1.inversity_<normal|flipped>`. `inversity_flipped` points to the flipped token of the same step. The existing tokens are not changed.

### **Button Tokens**

Seven Button backgrounds change with the surface level: `primary` (rest, hover, active) and `secondary` and `tertiary` (hover, active). They exist as `ob.h.button.color.<intent>.bg.<state>.surface.inversity_<normal|flipped>`.

- `level-1`, `level0` and `level1` point to the existing Button tokens.
- `level2` points to the helper tokens `...level_2.inversity_<normal|flipped>`.

For `inversity_normal` the `level2` colors differ from `level0` only in light mode (high emphasis: `primary`, and `secondary` and `tertiary` hover and active; low emphasis: `secondary` and `tertiary` hover and active). In dark mode `level_0` and `level_2` are the same. `inversity_flipped` is the mirror image and differs only in dark mode.

The Button adapts to the context it sits on: when the elevation of the container changes, the Button backgrounds change with it. The `surface` background of the neutral family is meant for the containers the Button sits in.

## **Interactive Feedback Direction**

Hover and active change the Button background compared to the rest state. The direction of the change depends on the elevation, on lightness and on inversity. The values are set per mode in the helper sets, they are not computed.

The table shows the direction of `secondary` and `tertiary` for hover and active, measured as the luminance of the background over the surface of the mode. It is measured on the neutral surface, in high and low emphasis. `primary` gets darker in every combination.

| Elevation | Light, `inversity_normal` | Dark, `inversity_normal` | Light, `inversity_flipped` | Dark, `inversity_flipped` |
|---|---|---|---|---|
| `level2` | lighter | lighter | lighter | lighter |
| `level1` | darker | lighter | lighter | darker |
| `level0` | darker | lighter | lighter | darker |
| `level-1` | darker | lighter | lighter | darker |

On `level2` the direction is the same in every combination: hover and active get lighter. Only the Button has surface-aware hover and active backgrounds. Other components do not follow this table yet.

## **Mode Collection Registration**

The collection is registered in `01_global/mode_collection/elevation.json`. `level0` is the base mode and applies no class. `level-1` is activated by `.ob-elevation-level-minus-1`, `level1` by `.ob-elevation-level-1` and `level2` by `.ob-elevation-level-2`. The application adds the class to the container that should switch.

## **Mode Interplay**

Elevation is independent of the other mode collections. For the seven Button backgrounds the result depends on three axes: lightness, emphasis and elevation. See [09-interplay.md](09-interplay.md).
