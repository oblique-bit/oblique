# figma-utils

Standalone Figma-context maintenance scripts. They run against the `figma`
plugin global — not Node. Run them either via the figma-console MCP
(`figma_execute`) or by pasting into the Desktop Bridge plugin console.

## unbind-variables.js — kill "ghost" variable-mode pickers

**The problem.** A node, frame or text layer keeps showing variable-mode
pickers for collections you no longer want (e.g. `typography_context`,
`ui_scale` from an old `DesignSystem@Tokens` library). Re-applying or
resetting modes by hand does nothing — they always come back.

**The cause — deterministic, no guessing.** Figma lists a collection in the
"Apply variable mode" panel for as long as **any node in the file still
consumes a variable from it**. It is never stale node data and never an
`explicitVariableModes` leftover. `figma.variables.getLocalVariableCollections`
returns nothing and `getAvailableLibraryVariableCollectionsAsync` returns
nothing because the collections are *remote variables already imported by
reference* — pulled in purely by the bindings. Remove the bindings, the
picker entry disappears.

**The fix.** Run `unbind-variables.js`:

1. Open the script, edit the `CONFIG` block.
2. Run with `mode: 'scan'` first — it reports every binding grouped by
   collection, changes nothing.
3. Re-run with `mode: 'detach'` to remove them. Detached properties keep
   their last resolved value as a literal, so there is no visual change.

### CONFIG fields

| field | what it does |
|---|---|
| `mode` | `'scan'` (report only) or `'detach'` (remove bindings) |
| `propertyFilter` | array of bound fields to target, e.g. `['paragraphSpacing']`; `null` = all |
| `collectionFilter` | array of collection names to target; `null` = any |
| `remoteOnly` | `true` = only detach library bindings, never local ones (safety net) |
| `scope` | `'file'` (all pages — needed to clear a picker), `'page'`, or `'selection'` |

### Notes

- **Instance-internal nodes** (ids containing `;`) are skipped on purpose —
  they inherit from their main component, so detaching the main component
  node clears every instance automatically. The report counts these as
  `skippedInstanceInternal`.
- Always `scan` before `detach`. The scan report's `byCollection` block tells
  you exactly which collections and how many bindings you are about to touch.
- To clear a ghost picker, `scope` must be `'file'` — one binding on any page
  is enough to keep the collection alive.
- **`fills` / `strokes`** detach via `setBoundVariableForPaint` (a plain
  `setBoundVariable` throws for paints). Per-range text fills (`figma.mixed`)
  can't be cleared this way — the report counts them as `skippedMixedPaint`.
