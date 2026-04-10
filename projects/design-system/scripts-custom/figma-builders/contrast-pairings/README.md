# Figma Contrast Pairings Builder

Scripts to rebuild the **🎨 Colors – Contrast Pairings** living documentation page in Figma. Generates 284 `_ContrastSwatch` instances across three S3 semantic color categories.

## How it works

Two-phase pipeline (same pattern as `../color-tokens/`):

1. **Phase 1** — `contrast-setup.js` is executed inside Figma (via MCP) to install the builder on `globalThis.__CP`
2. **Phase 2** — Data from `extracted-json/*.json` is injected into build calls to `__CP.buildCategory()`

### Communication

Uses **stdio transport** to talk to `figma-console-mcp` (JSON-RPC 2.0 over stdin/stdout). This is different from the official Figma Dev Mode MCP on port 3845 — the Console MCP has `figma_execute`.

## Quick start

Ask the AI assistant:

> rebuild contrast docs

or for a specific category:

> rebuild contrast docs for neutral

### CLI usage

```bash
# Rebuild all 3 categories (neutral + interaction + status)
node mcp-executor.js --all

# Rebuild specific category
node mcp-executor.js neutral        # 30 swatches
node mcp-executor.js interaction    # 14 swatches
node mcp-executor.js status         # 240 swatches

# Extract current state from Figma to JSON
node mcp-executor.js --extract
```

### Prerequisites

1. Figma Desktop open with **DesignSystem@Tokens V9.6** (`51tJjbxBSBmjAmKjQmhsz3`)
2. **Desktop Bridge plugin** running (Plugins → Development → Figma Desktop Bridge)
3. `FIGMA_ACCESS_TOKEN` env var set (or use the default in mcp-executor.js for dev)

## Files

```
contrast-pairings/
  contrast-setup.js         Core builder (Phase 1) — installs globalThis.__CP
  mcp-executor.js           CLI orchestrator — spawns figma-console-mcp via stdio
  extracted-json/           Swatch data extracted from live Figma
    all.json                All 284 entries
    neutral.json            30 entries
    interaction.json        14 entries
    status.json             240 entries
```

## Categories

| Category    | Swatches | Structure |
|-------------|----------|-----------|
| Neutral     | 30       | 5 fg-level rows × 5 bg-level swatches + text-link row |
| Interaction | 14       | States row (7 swatches) + text-link row (7 swatches) |
| Status      | 240      | 4 columns × 3 status types × (4 bg-level rows × 4 fg-level + text-link row) |

## Figma IDs

| Entity | ID |
|---|---|
| Page: 🎨 Colors – Contrast Pairings | `9559:21413` |
| Section: Contrast Pairings — S3 Semantic Colors | `9564:1006818` |
| Component: _ContrastSwatch | `9564:773985` |
| Component: Section Bar | `9544:35238` |
| Component: Group Header | `9544:35265` |
| Badge: resolved (PASS) | `9117:25540` |
| Badge: critical (FAIL) | `9117:25544` |
| Category frame: Neutral | `9561:410202` |
| Category frame: Interaction | `9561:410210` |
| Category frame: Status | `9561:410218` |

## Data schema

Each swatch entry in the JSON files:

```json
{
  "id": "9564:...",
  "fg": "ob.s3.color.neutral.fg.contrast_highest.inversity_normal",
  "bg": "ob.s3.color.neutral.bg.contrast_highest.inversity_normal",
  "r": "17.4 : 1",
  "cs": "AA large + AA normal + AAA",
  "cmps": "component-spec-string",
  "aa": 1,
  "aaa": 1,
  "fv": "VariableID:...",
  "bv": "VariableID:...",
  "emph": "emphasis_low required on saturated status bg"
}
```

- `fg`/`bg`: Full S3 token paths
- `r`: Contrast ratio string
- `cs`/`cmps`: Content and component specifications
- `aa`/`aaa`: WCAG pass (1) or fail (0)
- `fv`/`bv`: Figma VariableIDs for foreground/background
- `emph`: Optional — emphasis-low annotation (36 status swatches)

## Architecture notes

- The builder clears and recreates all children of each category frame, preserving the frame itself
- Section `9564:1006818` is NOT deleted — only its internal contents are rebuilt
- pluginData (`swatchDataEnhanced`) is re-stored on the section after building
- WCAG ratios are computed live from resolved variable colors at build time
- 20px circular badges are applied to component headings for visual hierarchy
