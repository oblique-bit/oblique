# Contrast Mode (low / medium / high)

**Mode collection that sets the contrast between the content and its surface**

---

## **Overview**

The **contrast** mode collection has three modes:

| Mode | For | What changes |
|---|---|---|
| `low` | applications used for many hours | every surface moves one elevation level toward the text |
| `medium` | the base, the colors as they are | nothing |
| `high` | people with low vision | every surface moves one elevation level away from the text |

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

### **Not Built Yet**

- `high`: neutral text in black (white in dark mode, `ob.p.color.basic.black` exists), link, error text and borders mixed toward black or white.
- The Button on a moved surface keeps the colors of its own elevation level.

## **Known Limits**

- In `low`, `level_1` and `level_2` have the same color.
- The CSS build writes one block per mode. A container with dark mode and `high` gets the `high` values of light mode. The same limit exists for dark mode and `low` emphasis.
