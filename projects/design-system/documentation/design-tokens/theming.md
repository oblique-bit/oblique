# Theming System

## Introduction

**About this document:** This document explains the theming architecture of the Oblique Design System, including theme types, token organization, and implementation patterns.

**Scope:** Tokenized Design System only. Pre-Design System releases like Oblique R13 are not affected.

**Theme Strategy:** The system supports multiple theme dimensions that can be combined: Lightness (light/dark), Inversity (normal/flipped), and Interaction Emphasis (normal/muted). Responsive theming is handled separately (see [Responsive Tokens](./responsiveness.md)).

---

## Multi-Dimensional Theming

The semantic level supports complex theming through multiple dimensions that can be combined:

- **Lightness:** `light` (default) / `dark`
- **Inversity:** `normal` / `flipped` 
- **Interaction Emphasis:** `normal` / `muted`

**Example:** A button can simultaneously use:
- `lightness: dark` (inheriting dark theme values)
- `inversity: flipped` (switching to inverted background/foreground for visual emphasis)
- `emphasis: muted` (lowering visual emphasis within headers/footers)

### Level 2: Semantic Colors

The semantic level introduces theming through organized folders containing JSON files. In the codebase, these appear as directories with JSON files, but in Tokens Studio they are managed as Token Sets organized in folders.

**For Developers:** Each theming folder (e.g., `lightness/`, `inversity/`) contains multiple JSON files. Files within the same folder contain tokens with identical names but different values. When the design system build process runs, one JSON file can override tokens from another based on the active theme configuration.

**For Designers:** These folders correspond to Token Sets in Tokens Studio, where theme switching is managed through the plugin interface or via variable modes in Figma. See [Figma Help - Modes for Variables](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables).

**Reference:** For detailed information about Token Sets, see [Tokens Studio Documentation - Token Sets](https://docs.tokens.studio/manage-tokens/token-sets).

#### Level 2.1: Lightness Theming

```
src/lib/themes/semantic/color/s1-lightness/
|-- light.json    # Default theme
+-- dark.json     # Dark theme override
```

**Purpose:** System-wide light/dark theme switching. Users set the variable mode in Figma from `lightness: light` (default) or `lightness: dark`.

**Token Structure:** Generic-purpose tokens with contrast levels:
- `bg-base` - For various backgrounds across different interaction states
- `fg-visited` - Reserved for foreground color of visited text links
- `contrast-high`, `contrast-medium`, `contrast-low` - Various contrast levels within semantic subgroups

**Token Format:**
```json
{
  "ob": {
    "s": {
      "color": {
        "neutral": {
          "bg": {
            "contrast-highest": {
              "inversity-normal": "{ob.p.color.basic.white}",
              "inversity-flipped": "{ob.p.color.cobalt.700}"
            }
          }
        },
        "interaction": {
          "emphasis-high": {
            "bg-base": {
              "contrast-high": {
                "inversity-normal": "{ob.p.color.steelblue.800}",
                "inversity-flipped": "{ob.p.color.basic.white}"
              }
            }
          }
        }
      }
    }
  }
}
```

#### Level 2.2: Inversity Theming

```
src/lib/themes/semantic/color/s2-inversity/
|-- normal.json  # Normal contrast
+-- flipped.json  # Inverted contrast
```

**Purpose:** Component-scoped theming for inversity override. Available in Figma variable mode but should not be altered by designers in projects.

**Use Cases:**
- Setting complete inversity on components: Badge needs inverted appearance (dark bg, light fg)
- One-time inversity on component variants: `button.primary`, `infobox.fatal`, `tag.active` to make them stick out for UX reasons

**Token Structure:** References lightness tokens without theme suffixes:
```json
{
  "ob": {
    "s": {
      "color": {
        "neutral": {
          "bg": {
            "contrast-highest": "{ob.s.color.neutral.bg.contrast-highest.inversity-normal}"
          }
        }
      }
    }
  }
}
```

#### Level 2.3: Interaction Emphasis Theming

```
src/lib/themes/semantic/color/s3-emphasis/
|-- normal.json  # Full saturation (standard blue)
+-- muted.json    # Desaturated (monochromatic)
```

**Purpose:** Component-scoped theming for interaction emphasis. Used when design system maintainers set interaction emphasis to "muted" in host components (header, footer, infobox) where text links and buttons must be visually less aggressive.

**Use Cases:**
- **Standard Context:** Buttons in forms use `emphasis: normal` with high-saturated blue for background fill
- **Muted Context:** Same components in headers/footers use `emphasis: muted` appearing monochromatic to avoid drawing excessive attention

**Scope:** Only for interactive elements (buttons, text links, tabs). Non-interactive components can skip this level.

**Token Structure:** References inversity tokens:
```json
{
  "ob": {
    "s": {
      "color": {
        "interaction": {
          "state": {
            "fg": {
              "enabled": {
                "inversity-normal": "{ob.s.color.status.fatal.fg.contrast-low}",
                "inversity-flipped": "{ob.s.color.status.fatal.fg.contrast-low}"
              },
              "hover": {
                "inversity-normal": "{ob.s.color.status.fatal.fg.contrast-medium}",
                "inversity-flipped": "{ob.s.color.status.fatal.fg.contrast-medium}"
              }
            }
          }
        }
      }
    }
  }
}
```

### Reference Chain Validation

The correct reference chain ensures proper theme inheritance:

1. **Components** -> **Emphasis** -> **Inversity** -> **Lightness** -> **Primitives**

**Exception:** Global tokens (`ob.g.*`) can be referenced from any level in the hierarchy and are exempt from these chain rules. See [global-tokens.md](./global-tokens.md) for details.
2. **Components** -> **Inversity** -> **Lightness** -> **Primitives** (for non-interactive elements)

**Validation Rules:**
- Semantic layers should never directly reference primitives (except for lightness layer)
- Component layers should never reference lightness or primitive layers directly
- Each layer should only reference the layer immediately below it in the hierarchy

### L1/L2 Redundancy Analysis

**Finding:** Analysis of the token architecture reveals 99.2% redundancy between L1 (lightness) and L2 (inversity) token layers.

**Current State:**
- **L1 lightness/light.json:** 273 tokens
- **L2 inversity/normal.json:** 271 tokens  
- **Redundant tokens:** 269 (99.2% overlap)
- **L2-unique tokens:** Only 2 tokens exist exclusively in L2

**Architectural Assessment:**

The L2 inversity layer was designed to provide component-scoped theming for contrast inversion (e.g., badges with dark backgrounds, light text). However, the current implementation shows that L2 tokens are nearly identical copies of L1 tokens, indicating potential over-engineering.

**Impact Analysis:**
- **Maintenance Overhead:** Dual maintenance of nearly identical token sets
- **Consistency Risk:** Manual synchronization between L1 and L2 creates drift potential
- **Reference Complexity:** Additional layer without meaningful semantic differentiation

**Recommendation:**

Consider generating L2 tokens programmatically from L1 during the build process rather than maintaining separate files. This would:

1. **Eliminate redundancy** - Single source of truth for base semantic tokens
2. **Reduce maintenance** - Automatic synchronization between layers  
3. **Preserve architecture** - Maintain the semantic hierarchy and reference chain
4. **Enable customization** - Allow selective overrides for true inversity cases

**Validation:** Run `python scripts-custom/validate-s1-s2-redundancy.py` to verify current redundancy levels and identify the specific tokens that require manual definition in S2.

### Folder Structure vs. Token References

**Important:** Changing folder structures does not necessarily break token references. Token resolution depends on the token paths and names, not the folder organization.

**What Breaks References:**
- Changing token paths (e.g., `{ob.s.color.bg.default}` -> `{ob.s.color.background.default}`)
- Renaming tokens (e.g., `primary` -> `accent`)
- Removing tokens that are referenced elsewhere

**What Doesn't Break References:**
- Moving files between folders (as long as token paths remain the same)
- Reorganizing folder structure for better organization
- Renaming folders (token paths are independent of folder names)

**Theme Resolution ("Last Wins"):**

**For Developers:** When multiple JSON files define the same token path, the build process applies a "last wins" strategy. The file loaded last in the build order takes precedence. This allows for a cascading system similar to CSS specificity.

**For Designers:** In Tokens Studio, when multiple Token Sets are enabled and contain tokens with identical names, the Token Set positioned lowest in the list overrides the values from sets higher in the list.

**Example:**
```json
// File A (light.json): ob.s.color.bg.primary = "blue"
// File B (dark.json): ob.s.color.bg.primary = "red"  
// Result: If dark theme is active, token resolves to "red"
```

This behavior enables flexible theme switching and customization without requiring reference updates.
