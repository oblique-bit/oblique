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
- **`05_html/button/01_color/brand/CH_app.json`, `CH_marketing.json`, `ZH.json`, `FR.json`**: the Button colors of the brand, high emphasis: `ob.h.button.color.brand.primary.{bg,fg}.*` and `ob.h.button.color.brand.secondary.{bg,fg,border}.*` (rest, hover, active) for light surfaces, and the same names with `_inverse` for dark surfaces. `ob.h.button.color.brand.tertiary.{bg,fg}.*` follow the names of the tertiary Button tokens (`_inverse` = inverted surface): for `CH_app`, `CH_marketing` and `FR` they point to the secondary Button colors, so the tertiary Button reuses the secondary one as before; for `ZH` the tertiary Button is the zh.ch plain text button (no background, label `#666666`, hover and active black). `CH_app` keeps the colors of the brand ramp. `FR` follows fr.ch: primary `#008094` with a white label (hover and active with the Oblique state layer, fr.ch turns the Button into an outline Button, which needs a primary border the Button does not have), outline `#008094`, filled `#008094` with a white label on hover and active; on dark surfaces fr.ch dark mode: primary `#57B3C2` with a black label, outline `#57B3C2`, filled with a black label on hover and active. `CH_marketing` follows the Swiss DS (filled `cobalt.500`, hover `cobalt.600`, active `cobalt.700`, on light and dark surfaces; outline `red.600`, hover and active `red.700`; on dark surfaces the outline is `red.400`, hover and active `red.300`, as `red.600` has only 2.99:1 there). The Swiss DS has no dark mode: its Buttons for dark sections keep the slate background, none of them is red. `ZH` follows zh.ch (primary black `#000000`, hover and active `#333333`; secondary black 10 %, hover 20 %, active black, label `#666666`, hover black, active white, no border). Hover and active are plain values per brand, so they follow the brand in Figma too (Tokens Studio bakes a color modifier into a fixed value of the base mode). `secondary.bg.hover_level_2` and `active_level_2` hold the secondary hover and active backgrounds on `level_2`: a white overlay for `CH_app`, `CH_marketing` and `FR`, the zh.ch values for `ZH` (the white label of the active state needs the black background).
- **`05_html/link/brand/CH_app.json`, `CH_marketing.json`, `ZH.json`, `FR.json`**: the link colors of the brand, `ob.h.link.color.brand.{default,hover,active}` for light surfaces and the same names with `_inverse` for dark surfaces. `CH_app` and `ZH` point to the interaction colors as before, `CH_marketing` follows the Swiss DS (`red.600`, hover and active `red.700`; on dark surfaces `red.400`, hover and active `red.300`), `FR` follows fr.ch (`#008094`; on dark surfaces `#57B3C2`).
- **`05_html/link/color_scheme/light.json`, `dark.json`**: `ob.h.link.color.color_scheme.{default,hover,active}` takes the brand link color for light surfaces in light mode and for dark surfaces in dark mode.
- **`04_component/molecule/header/brand/CH_app.json`, `CH_marketing.json`, `ZH.json`, `FR.json`**: `ob.c.header.logo_figma`, a Figma-only text token (`CH`, `CH`, `ZH`, `FR`). It is bound to the `logo` variant property of the `_pseudo/header` component, so the header shows the logo of the brand.

### **Tokens that follow the mode**

- All high emphasis Button colors of `05_html/button/01_color/color_scheme/{light,dark}.json` and `05_html/button/01_color/elevation/level_2_color/color_scheme/{light,dark}.json` that took the brand ramp point to `ob.h.button.color.brand.*`: colors for light surfaces (plain names in `light.json`, `_inverse` names in `dark.json`) to the plain brand names, colors for dark surfaces (plain names in `dark.json`, `_inverse` names in `light.json`) to the brand names with `_inverse`.
- The high emphasis tertiary Button colors in `05_html/button/01_color/emphasis/high.json` (background and label; rest, hover, active, with `_inverse`) and the `level_2` tertiary backgrounds point to `ob.h.button.color.brand.tertiary.*`. The disabled colors do not change with the brand.
- `ob.h.link.color.default`, `hover` and `active` point to `ob.h.link.color.color_scheme.*`. `visited` does not change with the brand.
- `ob.s.typography.scale.static.font_family.body` and `heading` point to `ob.p.font_family.brand.sans` (Noto Sans; ZH: Inter). The static and dynamic `font_weight` tokens point to `ob.p.font_weight.brand.*`. ZH uses two weights only: `regular` and `medium` are 400, `semi_bold`, `bold` and `extra_bold` are Black 900, as zh.ch uses Inter Regular and Inter Black.
- `ob.s1.color.interaction.emphasis_high.*` (light and dark) point to `ob.p.color.brand.*`.
- `ob.s.color.brand.1` and `ob.s1.color.navigation.border.brand` point to `ob.p.color.brand.accent`.

The brand mode files are primitives. They stay in the primitive tier, so the semantic tokens keep their tier chain.

## **Mode Collection Registration**

The collection is registered in `01_global/mode_collection/brand.json`. `CH_app` is the base mode and applies no class. `CH_marketing` is activated by `.ob-brand-ch-marketing`, `ZH` by `.ob-brand-zh` and `FR` by `.ob-brand-fr`. The application adds the class to the container that should switch.

## **Limits of the proof of concept**

- `ZH` has no dark mode values of its own (zh.ch has no dark mode): on dark surfaces its Buttons and links use the brand ramp.
- fr.ch shows the link underline only on hover. The underline is the same for every brand.
- `ZH` links use the interaction colors of the brand ramp. zh.ch links are grey `#666666` with a cyan `#009EE0` underline.
- The logo switches only in Figma (`ob.c.header.logo_figma`). The logos are the official files of the brands: the federal logo, the Canton of Zurich lion with the arms (zh.ch) and the coat of arms of the Canton of Fribourg, black over white (Wikimedia Commons, public domain), with the official name of fr.ch.

## **Mode Interplay**

Brand is independent of the other mode collections. The colors it changes also follow color scheme, emphasis and elevation. See [09-interplay.md](09-interplay.md).
