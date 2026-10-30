# Brand Mode (CH_app / CH_marketing / ZH / FR)

**Proof of concept: a mode collection that switches the brand ramp of the high emphasis interaction colors and the brand accent**

---

## **Overview**

The **brand** mode collection lets one set of tokens carry several brands. It has four modes:

| Mode | Brand | Ramp (`ob.p.color.brand.50`–`900`) | Accent (`ob.p.color.brand.accent`) |
|---|---|---|---|
| `CH_app` | Oblique today (base mode) | `steelblue` | `basic.federal_red` |
| `CH_marketing` | Swiss Confederation (BK, Swiss DS) | `red` (the Swiss DS primary ramp) | `basic.federal_red` |
| `ZH` | Canton of Zurich | blue ramp, step 600 = ZH Blau `#0070B4` | `#0070B4` |
| `FR` | Canton of Fribourg | teal ramp, step 600 = fr.ch primary `#008094` | `#008094` |

`CH_app` is the base mode and the first-paint default. Its values are the same as before the collection existed.

The mode changes only the colors that took `steelblue` before: the high emphasis interaction colors (`ob.s1.color.interaction.emphasis_high.*`) and the Button colors that use `steelblue` directly. Low emphasis uses `cobalt` and is the same for every brand. The status colors do not change.

## **The ZH and FR ramps**

ZH and FR have no official 50–900 ramp. The ramps are built around the brand color at step 600, the step of the primary Button background. Every other step has the same contrast against white as the `steelblue` step of the same number: the brand color is mixed toward white for the lighter steps and toward black for the darker steps. So the existing tokens keep their contrast when the brand changes. The `ZH` step 50 is the ZH Softblau `#EDF5FA`.

White label on step 600: `steelblue` 4.84:1, `red` 5.01:1, `ZH` 5.28:1, `FR` 4.65:1.

## **Implementation**

### **Mode Files**

- **`01_global/mode_collection/brand.json`**: registers the four modes and the CSS class of each mode.
- **`02_primitive/brand/CH_app.json`, `CH_marketing.json`, `ZH.json`, `FR.json`**: the brand ramp `ob.p.color.brand.50`–`900` and `ob.p.color.brand.accent`. One file per mode. `CH_app` and `CH_marketing` point to existing primitives, `ZH` and `FR` hold the ramp values.
- **`05_html/button/01_color/brand/CH_app.json`, `CH_marketing.json`, `ZH.json`, `FR.json`**: the Button colors of the brand, high emphasis: `ob.h.button.color.brand.primary.bg.*` and `ob.h.button.color.brand.secondary.{bg,fg,border}.*` (rest, hover, active) for light surfaces, and `ob.h.button.color.brand.secondary.{fg,border}.*_inverse` for dark surfaces. `CH_app` and `FR` keep the colors of the brand ramp, `CH_marketing` follows the Swiss DS (filled `cobalt.500`, hover `cobalt.600`, active `cobalt.700`; outline `red.600`, hover and active `red.700`; on dark surfaces the outline is `red.400`, hover and active `red.300`, as `red.600` has only 2.99:1 there), `ZH` follows zh.ch (primary black `#000000`, hover and active `#333333`; secondary black 10 %, hover 20 %, active black, label `#666666`, hover black, active white, no border). Hover and active are plain values per brand, so they follow the brand in Figma too. `secondary.bg.hover_level_2` and `active_level_2` hold the secondary hover and active backgrounds on `level_2`: a white overlay for `CH_app`, `CH_marketing` and `FR`, the zh.ch values for `ZH` (the white label of the active state needs the black background).
- **`04_component/molecule/header/brand/CH_app.json`, `CH_marketing.json`, `ZH.json`, `FR.json`**: `ob.c.header.logo_figma`, a Figma-only text token (`CH`, `CH`, `ZH`, `FR`). It is bound to the `logo` variant property of the `_pseudo/header` component, so the header shows the logo of the brand.

### **Tokens that follow the mode**

- The plain (not `_inverse`) high emphasis Button tokens in `05_html/button/01_color/color_scheme/light.json` (primary background, secondary background, label and border; rest, hover, active), the `level_2` primary backgrounds and the `level_2` secondary hover and active backgrounds point to `ob.h.button.color.brand.*`. The secondary label and border for dark surfaces (the plain tokens in `color_scheme/dark.json`, the `_inverse` tokens in `color_scheme/light.json`) point to `ob.h.button.color.brand.secondary.{fg,border}.*_inverse`.
- `ob.s.typography.scale.static.font_family.body` and `heading` point to `ob.p.font_family.brand.sans` (Noto Sans; ZH: Inter). The static and dynamic `font_weight` tokens point to `ob.p.font_weight.brand.*`. ZH uses two weights only: `regular` and `medium` are 400, `semi_bold`, `bold` and `extra_bold` are Black 900, as zh.ch uses Inter Regular and Inter Black.
- `ob.s1.color.interaction.emphasis_high.*` (light and dark) point to `ob.p.color.brand.*`.
- `ob.h.button.color.emphasis_high.*` in `05_html/button/01_color/color_scheme/` and `05_html/button/01_color/elevation/level_2_color/color_scheme/` point to `ob.p.color.brand.*`.
- `ob.s.color.brand.1` and `ob.s1.color.navigation.border.brand` point to `ob.p.color.brand.accent`.

The brand mode files are primitives. They stay in the primitive tier, so the semantic tokens keep their tier chain.

## **Mode Collection Registration**

The collection is registered in `01_global/mode_collection/brand.json`. `CH_app` is the base mode and applies no class. `CH_marketing` is activated by `.ob-brand-ch-marketing`, `ZH` by `.ob-brand-zh` and `FR` by `.ob-brand-fr`. The application adds the class to the container that should switch.

## **Limits of the proof of concept**

- On dark surfaces only the secondary label and border have brand values. The other dark surface Button colors and the `_inverse` tokens of `color_scheme/dark.json` still use the brand ramp.
- Links still use the brand ramp: Swiss DS links are `red.600`, zh.ch links are grey `#666666` with a cyan `#009EE0` underline.
- The logo switches only in Figma (`ob.c.header.logo_figma`). The logos are the official files of the brands: the federal logo, the Canton of Zurich lion with the arms (zh.ch) and the coat of arms of Fribourg (Wikimedia Commons, public domain) with the official name of fr.ch.

## **Mode Interplay**

Brand is independent of the other mode collections. The colors it changes also follow color scheme, emphasis and elevation. See [09-interplay.md](09-interplay.md).
