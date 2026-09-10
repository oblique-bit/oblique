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

## scope-variables.js — set scopes and hiddenFromPublishing in bulk

**The problem.** A variable appears in a picker it should not (e.g. `ob/s1/*`
in the fill / stroke picker) because its `scopes` array is empty or contains
`ALL_SCOPES`. Empty scopes is NOT "hidden" — Figma treats it as "no
restriction" and lists the variable in every applicable picker for its type.

**The fix.** Run `scope-variables.js`:

1. Open the script, edit the `CONFIG` block.
2. Run with `mode: 'scan'` first — reports every match grouped by current
   scopes and `hiddenFromPublishing`, changes nothing.
3. Re-run with `mode: 'apply'` to rewrite `scopes` and / or
   `hiddenFromPublishing` on every matched variable.

### CONFIG fields

| field | what it does |
|---|---|
| `mode` | `'scan'` (report only) or `'apply'` (write) |
| `namePrefixes` | array of name prefixes to match, e.g. `['ob/s1/color/']`; empty = all |
| `collectionNames` | array of variable-collection names, e.g. `['s1-lightness']`; empty = all |
| `resolvedTypes` | e.g. `['COLOR']`; empty = all |
| `currentScopes` | only match vars whose scopes set-equals one of these, e.g. `[['ALL_SCOPES']]` |
| `setScopes` | scopes array to write, e.g. `['EFFECT_COLOR']`; `null` = don't change |
| `setHiddenFromPublishing` | `true` / `false` / `null` (don't change) |

### Notes

- Valid color scopes: `ALL_SCOPES`, `ALL_FILLS`, `FRAME_FILL`, `SHAPE_FILL`,
  `TEXT_FILL`, `STROKE_COLOR`, `EFFECT_COLOR`. Figma rejects a scope that does
  not match the variable's `resolvedType`.
- `setScopes: []` resets to "no restriction" (shows everywhere for type).
  `setScopes: ['EFFECT_COLOR']` hides color vars from fill / stroke / text
  pickers at the cost of showing them in the shadow color picker.
- `setHiddenFromPublishing: true` removes the variable from the Libraries
  tab in consuming files, but only after the source library is re-published.
  Existing bindings on consuming files keep their last resolved value.
