# Automated Token Documentation in Figma

**Version:** 1.1  
**Date:** March 16, 2026  
**Status:** Active  
**Audience:** Design system maintainers  
**Purpose:** Generate and maintain visual token documentation pages in Figma using AI-assisted automation from VS Code.

---

## Overview

Instead of relying on Token Studio's built-in "Generate documentation" feature (which lacks template control and custom grouping), we generate token documentation directly in Figma via the `figma-console-mcp` bridge — controlled from VS Code with Copilot.

This gives full control over:
- Typography, colors, padding, and layout of the documentation
- Custom grouping and hierarchy of tokens
- Consistent visual templates across all token categories
- Batch updates when tokens change

---

## Prerequisites

| Requirement | Details |
|-------------|---------|
| **Figma Desktop** | Must be running with the **Figma Desktop Bridge** plugin active |
| **VS Code** | MCP server `figma-console-mcp` configured in `.vscode/mcp.json` |
| **Resolved tokens** | Run `npm run resolve-tokens` for single-combo or `npm run resolve-tokens -- --multi` for all 4 mode combos |
| **Connection check** | Ask Copilot: "figma get status" — must show ✅ Connected |

---

## Workflow: Update Token Documentation

### Step 1: Resolve tokens (multi-mode)

```bash
npm run resolve-tokens -- --multi
```

This reads all token JSON files + `$themes.json` + `$metadata.json` and produces `_private/resolved-tokens-multi.json` with every token resolved across all 4 lightness × emphasis combinations:

| Mode Label | s1-lightness | s2-emphasis |
|------------|-------------|-------------|
| `light-high` | light | high |
| `light-low` | light | low |
| `dark-high` | dark | high |
| `dark-low` | dark | low |

**Base combo (fixed):** md, desktop, standard, interface, enabled, static, semantic  
**Single combo:** `npm run resolve-tokens` → `_private/resolved-tokens.json`  
**Custom combo:** `npm run resolve-tokens -- --combo "dark,low,sm,mobile,compact,prose,disabled"`

Output format:
```json
{
  "_meta": { "modes": { "light-high": { "combo": [...], "tokenCount": 1768 }, ... } },
  "tokens": {
    "ob.s3.color.neutral.fg.contrast_highest.inversity_normal": {
      "type": "color",
      "modes": {
        "light-high": "#131b22",
        "light-low": "#131b22",
        "dark-high": "#ffffff",
        "dark-low": "#ffffff"
      }
    }
  }
}
```

### Step 2: Open the target Figma file

Open the Figma file designated for token documentation. Ensure the Desktop Bridge plugin is running (green indicator).

### Step 3: Prompt Copilot to generate documentation

Use prompts like:

```
Create a color documentation page in Figma for all ob.s3.color.neutral tokens.
Use the resolved tokens from _private/resolved-tokens.json.
Template: swatch (24x24) + token path + hex value, grouped by sub-category.
```

Or for a full batch:

```
Generate documentation pages for all color token groups in Figma.
Use the resolved tokens. One section per group. Include group headers.
```

### Step 4: Review and iterate

After generation, review in Figma. Adjust the template by telling Copilot:

```
Make swatches 32x32, increase font size to 14px, add more vertical spacing.
```

### Step 5: Re-generate on token changes

When tokens are updated (via Token Studio or directly in JSON files):

1. `npm run resolve-tokens` — regenerate resolved values
2. Prompt Copilot to update the documentation in Figma
3. Copilot reads the fresh `_private/resolved-tokens.json` and regenerates

---

## Template Specifications

Define your preferred template settings here. Update these as the template evolves.

### Color Token Documentation (Implemented)

All values below use Figma variable bindings — no hardcoded values.

#### Frame Structure

```
Living Documentation (FRAME, vertical auto-layout)
 └─ Token Set: ob.s3.color.neutral (FRAME, vertical auto-layout)
     ├─ Set Heading (FRAME, horizontal)
     │   ├─ __setName (TEXT, lgStrong style, fgHighest color)
     │   └─ __tokenCount (TEXT, smNormal style, fgMedium color)
     └─ Token Table (FRAME, vertical auto-layout)
         ├─ Header Row (FRAME, horizontal)
         │   ├─ Token Name (280px, xsStrong, fgHighest)
         │   ├─ Reference (320px, xsStrong, fgHighest)
         │   ├─ Light / High (120px)
         │   ├─ Light / Low (120px)
         │   ├─ Dark / High (120px)
         │   └─ Dark / Low (120px)
         ├─ Token Row × N (FRAME, horizontal, FILL width)
         │   ├─ Cell: Name (280px, xsStrong, fgHighest, padding 8px)
         │   ├─ Cell: Reference (320px, xsNormal, fgLow, padding 8px)
         │   ├─ Cell: Light/High (120px, vertical, centered)
         │   │   ├─ Swatch (24×24 rect, cornerRadius 4, borderMedium stroke)
         │   │   └─ Hex text (xsNormal, fgMedium)
         │   ├─ Cell: Light/Low ...
         │   ├─ Cell: Dark/High ...
         │   └─ Cell: Dark/Low ...
         └─ ...
```

#### Concrete Values

| Property | Value | Figma Binding |
|----------|-------|---------------|
| Swatch size | 24×24 | Fixed |
| Swatch corner radius | 4px | Fixed |
| Swatch border | 0.5px | `ob/s3/color/neutral/border/medium` |
| Token name style | xs/strong | Text Style `S:69cff5a0...` |
| Reference style | xs/normal | Text Style `S:bcfb9064...` |
| Hex value style | xs/normal | Text Style `S:bcfb9064...` |
| Token name color | fgHighest | `VariableID:48:460` |
| Reference color | fgLow | `VariableID:48:456` |
| Hex text color | fgMedium | `VariableID:48:454` |
| Row border (bottom) | 1px subtle | `VariableID:48:476` + `VariableID:8269:3478` |
| Cell padding | 8px | `VariableID:4054:3834` |
| Mode cell spacing | 4px | `VariableID:4054:3830` |
| Mode cell padding | 4px top/bottom | `VariableID:4054:3830` |
| Column widths | 280 / 320 / 120×4 = 1080px total | Fixed |
| Row height | HUG (auto) | — |
| Background | None (transparent) | — |

---

## Token Groups for Documentation

### Color tokens (899 total)

| Group | Count | Priority |
|-------|-------|----------|
| `ob.p.color.*` | ~130 | Primitives — base palette |
| `ob.s1.color.*` | ~273 | S1 — lightness variants |
| `ob.s2.color.*` | ~28 | S2 — emphasis variants |
| `ob.s3.color.*` | ~255 | S3 — semantic colors |
| `ob.h.*.color.*` | ~85 | HTML element colors |
| `ob.c.*.color.*` | ~111 | Component colors |

### Future: Other token types

- Dimension tokens
- Typography tokens
- Motion tokens
- Shadow/effect tokens

---

## File Locations

| File | Purpose |
|------|---------|
| `scripts-custom/resolve-tokens.js` | Token resolver script (supports `--multi`, `--list`, `--combo`) |
| `_private/resolved-tokens.json` | Single-combo resolved output (generated, not versioned) |
| `_private/resolved-tokens-multi.json` | 4-combo resolved output: light/dark × high/low (generated) |
| `_private/extract-neutral-tokens.js` | Helper: extracts neutral tokens with refs + multi-mode values |
| `.vscode/mcp.json` | MCP server configuration including Figma Console |
| This document | Process documentation |

---

## Figma Plugin API Notes

Key constraints discovered during implementation — essential for anyone modifying the generation scripts.

| Constraint | Details |
|------------|---------|
| **Paint variable binding** | Cannot use `setBoundVariable("fills", 0, v)`. Must use `figma.variables.setBoundVariableForPaint(paint, "color", variable)` and assign the result to `node.fills = [boundPaint]` |
| **Dimension binding** | Works directly: `node.setBoundVariable("paddingLeft", variable)` |
| **Text font loading** | Must call `figma.loadFontAsync()` for every font family+style before setting `characters`. Default is Inter Regular — always load it |
| **Text style assignment** | Use `await node.setTextStyleIdAsync(style.id)` — must be called before setting characters if overriding fills |
| **Layout sizing** | `layoutSizingHorizontal = "FILL"` can only be set AFTER the node is appended to an auto-layout parent |
| **Async API** | Use `figma.getNodeByIdAsync()`, `figma.getStyleByIdAsync()`, `figma.getLocalTextStylesAsync()` — sync variants throw with dynamic-page access |
| **Batch size** | Figma execute has a 30s timeout. Process ~10 rows per batch to stay within limits |
| **Individual strokes** | Set `strokeBottomWeight`, `strokeTopWeight`, etc. separately. Set `strokesIncludedInLayout = false` for border-only styling |

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `figma get status` shows no connection | Open Desktop Bridge plugin in Figma |
| Port 9223 taken | Kill stale node process: `lsof -i :9223` then `kill <PID>` |
| Tokens show `⚠ UNRESOLVED` | Check if the token set is included in the active combo |
| Wrong colors in Figma | Re-run `npm run resolve-tokens -- --multi` to regenerate all combos |
| `setBoundVariable` fails on fills | Use `setBoundVariableForPaint` instead (see API notes above) |
| Text appears as "undefined" | Ensure font is loaded with `loadFontAsync` before setting `characters` |
| `FILL` layout throws error | appendChild the node to its parent first, then set `layoutSizingHorizontal = "FILL"` |
