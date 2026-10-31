# Contrast Mode (low / medium / high)

**Mode collection that sets the contrast between the content and its surface**

---

## **Overview**

The **contrast** mode collection has three modes:

| Mode | For | What changes |
|---|---|---|
| `low` | applications used for many hours | every surface moves one elevation level toward the text |
| `medium` | the base, the colors as they are | nothing |
| `high` | people with low vision | every surface moves one elevation level away from the text, neutral text is black (white in dark mode) |

`medium` is the base mode and the first-paint default. It is the first theme of the group in `$themes.json`, so it is also the first and default mode of the collection in Figma.

The modes move whole elevation levels. They do not add new surface colors. `low` must not go below WCAG 2.1 AA, which eCH-0059 requires.

## **Implementation**

### **Mode Files**

- **`01_global/mode_collection/contrast.json`** — registers the three modes and the CSS class of each mode (`.ob-contrast-low`, `.ob-contrast-high`; `medium` has no class).
- **`03_semantic/color/s3_contrast/low.json`, `medium.json`, `high.json`** — the S3 tier: one neutral surface per elevation level. One file per mode, the same token names in each file.

### **S3 Tier**

S3 is the third semantic color tier. It sits between `ob.s` and the lower tiers:

```
ob.s.color.neutral.bg.surface        (elevation, one value per level)
  → ob.s3.color.neutral.bg.level_0   (contrast, one value per mode)
    → ob.s1.color.neutral.bg.contrast_highest   (color scheme)
      → primitive
```

The S3 token names repeat the elevation levels: `level_minus_1`, `level_0`, `level_1`, `level_2`, each with `_inverse`. The `surface` token of each elevation mode points to the S3 token of its level.

| S3 token | `low` | `medium` | `high` |
|---|---|---|---|
| `level_minus_1` | `contrast_highest` (the `level0` color) | `level_minus_1` | `level_minus_1` (no lower level) |
| `level_0` | `contrast_high` | `contrast_highest` | `level_minus_1` |
| `level_1` | `contrast_medium` | `contrast_high` | `contrast_highest` |
| `level_2` | `contrast_medium` (no higher level) | `contrast_medium` | `contrast_high` |

All values point to `ob.s1.color.neutral.bg.*`. The `_inverse` tokens point to the `_inverse` token of the same step.

In light mode `level_0` in `high` stays white, because `level_minus_1` is white in light mode. In dark mode it is `cobalt.900`.

### **Neutral Text**

S3 also holds the neutral foreground levels `contrast_low`, `contrast_medium`, `contrast_high` and `contrast_highest`, each with `_inverse`. The `ob.s.color.neutral.fg.*` tokens of these levels point to S3.

| S3 token | `low` | `medium` | `high` |
|---|---|---|---|
| `contrast_low` … `contrast_highest` | the same level of S1 | the same level of S1 | `ob.s1.color.neutral.fg.contrast_max` |
| the same names with `_inverse` | the same level of S1 | the same level of S1 | `ob.s1.color.neutral.fg.contrast_max_inverse` |

`contrast_max` is black (`ob.p.color.basic.black`) in light mode and white in dark mode; `contrast_max_inverse` is the opposite. `contrast_lowest` is not in S3 and does not change, so disabled text does not turn black. In `high` all neutral text has the same color: the difference between primary and secondary text remains only in size and weight.

### **Borders and Status Text**

S3 also holds the neutral borders `subtle`, `medium` and `strong` and the status foreground `contrast_medium` of all five status families (`info`, `resolved`, `attention`, `critical`, `fatal`), each with `_inverse`. The `ob.s` tokens of the same names point to S3. In `low` and `medium` they point to the same S1 token as before. In `high` they point to S1 tokens with the suffix `_max`:

| S3 token | `high` points to | light mode | dark mode |
|---|---|---|---|
| `neutral.border.subtle` | `ob.s1.color.neutral.border.subtle_max` | `neutral.100` mixed 50 % with black | white at 55 % (instead of 10 %) |
| `neutral.border.medium` | `ob.s1.color.neutral.border.medium_max` | `neutral.200` mixed 50 % with black | white at 60 % (instead of 20 %) |
| `neutral.border.strong` | `ob.s1.color.neutral.border.strong_max` | `neutral.300` mixed 50 % with black | `neutral_dark.300` mixed 50 % with white |
| `status.<status>.fg.contrast_medium` | `ob.s1.color.status.<status>.fg.contrast_medium_max` | the status step mixed 50 % with black | the status step mixed 50 % with white |

In dark mode `subtle` and `medium` are white with 10 % and 20 % opacity. White with opacity mixed 50 % toward white is white with a higher opacity: 10 % becomes 55 %, 20 % becomes 60 %.

The `_inverse` tokens mix in the other direction. The mixed colors are primitives of the brand files (`ob.p.color.brand.neutral.300_black_50`, `ob.p.color.brand.status.critical.700_black_50`, …), so each brand gets its own mixed color. `fatal` uses the `critical` steps.

Border contrast on white in light mode (`CH_app`), `medium` → `high`: `subtle` 1.28 → 4.82, `medium` 2.10 → 6.95, `strong` 3.34 → 9.40. In dark mode on `level0`: `subtle` 1.37 → 6.00, `medium` 1.91 → 6.94. In `high`, `subtle` is darker than `strong` in `medium`.

### **Link**

The link handles the contrast mode in its own files, not in S3: `ob.h.link.color.{default,hover,active,visited}` point to `ob.h.link.color.contrast.*` (`05_html/link/contrast/low.json`, `medium.json`, `high.json`). `low` and `medium` take the link color of the color scheme as before, `high` takes the `_max` color of the brand files:

| Brand | `high` |
|---|---|
| `CH_app` | one interaction step stronger (default and active `contrast_high`, hover `contrast_medium`, visited `visited.fg.contrast_medium`); keeps following the emphasis mode |
| `ZH`, `CH_marketing`, `FR` | the brand link color mixed 50 % with black on light surfaces, with white on dark surfaces, as fixed values |

Contrast on white, `medium` → `high`: `ZH` 5.74 → 12.63, `CH_marketing` 5.01 → 12.10, `FR` 4.65 → 11.46, `CH_app` 6.47 → 8.64. See [Link](../06-components/link/02-architecture.md).

### **Button**

The Button also handles the contrast mode in its own files. Only the primary background follows the mode. `ob.h.button.color.primary.bg.{rest,hover,active}` (with `_inverse`) point to `ob.h.button.color.contrast.emphasis_high.primary.bg.*` in `emphasis/high.json` and to `ob.h.button.color.contrast.emphasis_low.primary.bg.*` in `emphasis/low.json` (`05_html/button/01_color/contrast/low.json`, `medium.json`, `high.json`). The `level_2` helper tokens do the same through `elevation/level_2_color/contrast/`. `low` and `medium` take the color of the color scheme as before. `high` takes the `_max` color: one ramp step away from the label, darker under a white label, lighter under a dark label. Hover and active move by the same step.

| Button | `medium` | `high` |
|---|---|---|
| `CH_app`, `FR` (white label) | brand `600` | brand `700` |
| `CH_marketing` (white label) | `cobalt.500`, hover `600`, active `700` | `cobalt.600`, hover `700`, active `800` |
| `FR` on dark surfaces (black label) | `#57B3C2` | brand `300` |
| `ZH` | black, white on dark surfaces | the same: black and white are the maximum |
| Low emphasis, white label | `neutral.600` (dark mode, inverted surface: `neutral_dark.600`) | `neutral.700` (`neutral_dark.700`) |
| Low emphasis, dark label | `neutral_dark.50` (light mode, inverted surface: `neutral.50`) | white: `50` is the lightest step |

The `_max` colors of high emphasis are in the brand files (`ob.h.button.color.brand.primary.bg.<state>_max`, `<state>_max_inverse`), the ones of low emphasis in the color scheme files. Hover and active of `CH_app` and `FR` are fixed values: the `high` step mixed 35 % and 50 % with `cobalt.900`, on dark surfaces of `FR` with white, the same state layer as in `medium`. Low emphasis keeps the hover and active modifiers of `medium` on the new rest color.

Contrast of the white label, `medium` → `high`: `CH_app` 4.84 → 6.47, `FR` 4.65 → 6.46, `CH_marketing` 7.24 → 10.20, low emphasis 10.20 → 12.38. `FR` on dark surfaces (black label): 8.63 → 9.69. The labels, the disabled colors and the secondary and tertiary Buttons do not change.

### **Not Built Yet**

- The other status foreground steps (`contrast_high` for Pill, `contrast_highest` for Badge).
- The header takes its colors from the primitives and does not follow the contrast mode yet. Of the Button, only the primary background follows.
- The interaction text colors (`ob.s.color.interaction.fg.*`) are not in S3. Components that use them, other than the link, do not follow the contrast mode yet.
- The Button on a moved surface keeps the colors of its own elevation level.

## **Known Limits**

- In `low`, `level_1` and `level_2` have the same color.
- The Card uses `border.subtle` also for its disabled border, so in `high` the disabled border gets darker too. Disabled text (`contrast_lowest`) does not change.
- The hover and active colors of the low emphasis Button are Tokens Studio modifiers in the color scheme files. Figma gets the `CH_app` value in every brand, and the CSS build writes them as the rest color. The same is true in `medium`.
- The CSS build writes one block per mode. A container with dark mode and `high` gets the `high` values of light mode. The same limit exists for dark mode and `low` emphasis.
- In CSS, a token that points to another token (for example the heading colors, which point to `ob.s.color.neutral.fg.*`) is computed where it is declared. With the class on a container inside the page, these tokens keep the `medium` value; with the class on the root element they follow.
