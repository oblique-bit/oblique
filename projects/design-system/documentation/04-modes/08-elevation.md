# Elevation Mode (level_0 / level_1 / level_2)

**Surface level mode collection that switches the background of a surface and the Button backgrounds that depend on it**

---

## **Overview**

The **elevation** mode collection describes the level of the surface a component sits on. It has three modes: `level_0` (the base surface, such as the page), `level_1` and `level_2`. Switching the mode on a container changes the background of that container and the Button backgrounds on it.

The mode does not add new colors. It picks a step of the existing contrast ladder of the background tokens:

| Mode | Background step |
|---|---|
| `level_0` | `contrast_highest` |
| `level_1` | `contrast_high` |
| `level_2` | `contrast_medium` |

`level_0` is the base mode and the first-paint default. The names carry a number only. For the neutral surface (`inversity_normal`) a higher level is a darker surface in light mode and a lighter one in dark mode, so the names do not promise "above" or "below". The status surfaces follow the steps of their own families.

## **Implementation**

### **Mode Files**

- **`01_global/mode_collection/elevation.json`** — registers the three modes and the CSS class of each mode.
- **`03_semantic/color/elevation/level_0.json`, `level_1.json`, `level_2.json`** — the `surface` background tokens. One file per mode.
- **`05_html/button/01_color/elevation/level_0.json`, `level_1.json`, `level_2.json`** — the Button background tokens that follow the mode.
- **`05_html/button/01_color/elevation/level_2_color/`** — helper sets (`lightness/light.json`, `lightness/dark.json`, `emphasis/high.json`, `emphasis/low.json`) with the Button colors used on a `level_2` surface. They follow lightness and emphasis, so the mode can pick them.

### **Surface Tokens**

The families `neutral` and the five statuses (`info`, `attention`, `critical`, `fatal`, `resolved`) get a `surface` token that follows the mode. Each of them has the steps `contrast_highest`, `contrast_high`, `contrast_medium` and `contrast_low`.

```json
{
  "ob": {
    "s": {
      "color": {
        "neutral": {
          "bg": {
            "surface": {
              "inversity_normal": {
                "$value": "{ob.s.color.neutral.bg.contrast_highest.inversity_normal}"  // level_0
              }
            }
          }
        }
      }
    }
  }
}
```

In `level_1` the same token points to `contrast_high`, in `level_2` to `contrast_medium`. `inversity_flipped` points to the flipped token of the same step. The existing tokens are not changed.

### **Button Tokens**

Seven Button backgrounds change with the surface level: `primary` (rest, hover, active) and `secondary` and `tertiary` (hover, active). They exist as `ob.h.button.color.<intent>.bg.<state>.surface.inversity_<normal|flipped>`.

- `level_0` and `level_1` point to the existing Button tokens.
- `level_2` points to the helper tokens `...level_2.inversity_<normal|flipped>`.

For `inversity_normal` the `level_2` colors differ from `level_0` only in light mode (high emphasis: `primary`, and `secondary` and `tertiary` hover and active; low emphasis: `secondary` and `tertiary` hover and active). In dark mode `level_0` and `level_2` are the same. `inversity_flipped` is the mirror image and differs only in dark mode.

The families `interaction` and `free` do not have a `surface` token. The `interaction` steps are not the Button colors, and the `free` colors are not surfaces.

## **Mode Collection Registration**

The collection is registered in `01_global/mode_collection/elevation.json`. `level_0` is the base mode and applies no class. `level_1` is activated by `.ob-elevation-level-1` and `level_2` by `.ob-elevation-level-2`. The application adds the class to the container that should switch.

## **Mode Interplay**

Elevation is independent of the other mode collections. For the seven Button backgrounds the result depends on three axes: lightness, emphasis and elevation. See [09-interplay.md](09-interplay.md).
