# Figma Color Table Builders

Scripts that generate and rebuild the **DS-Token-Colors** living documentation tables in Figma.

## How it works

Two-phase pipeline:

1. **Phase 1** — `split-setup.js` is executed inside Figma (via MCP) to install the builder on `globalThis.__B`
2. **Phase 2** — `split-data-*.js` files are executed one by one; each calls `globalThis.__B.buildTable()` to populate a specific table

## Quick start

Ask the AI assistant:

> rebuild color docs

or for a specific table:

> rebuild color docs for s3-brand

## Files

```
color-tokens/
  split-setup.js          Core builder (Phase 1)
  generate-table-data.js  Extracts JSON from per-table-scripts/ → extracted-json/
  mcp-executor.js         CLI to run the full pipeline via Figma MCP
  inspect-components.js   Diagnostic — dumps Figma component tree
  per-table-scripts/      Figma build scripts, one per table (Phase 2)
    split-data-*.js       14 files, each builds one table in Figma
  extracted-json/          JSON table data extracted by generate-table-data.js
    _compact-*.json       9 semantic table data files
```

## CLI usage (optional)

If the Figma Desktop Bridge MCP server is running on `http://127.0.0.1:3845/mcp`:

```bash
node mcp-executor.js --all            # rebuild all 14 tables
node mcp-executor.js --tier s3        # rebuild one tier (s1|s2|s3|p)
node mcp-executor.js split-data-s3-brand.js  # rebuild one table
```

## Tables

14 tables across 4 tiers:

- **Primitive** (4): p-set1-left, p-set1-right, p-set2-left, p-set2-right
- **S1 Semantic** (4): s1-neutral, s1-interaction, s1-status-left, s1-status-right
- **S2 Semantic** (1): s2-interaction
- **S3 Semantic** (5): s3-brand, s3-neutral, s3-interaction, s3-status-left, s3-status-right
