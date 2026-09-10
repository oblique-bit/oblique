# figma-utils

Standalone Figma-context maintenance scripts. They run against the `figma`
plugin global — not Node. Run them either via the figma-console MCP
(`figma_execute`) or by pasting into the Desktop Bridge plugin console.

**Known issue — silent non-persist on a tight synchronous bulk loop.**
Confirmed via `figma-ds-cli eval -f` (2026-09-10): a loop of purely
synchronous style mutations (`style.remove()`, `style.name = x`) that returns
immediately after the loop reports success in its own output, but the change
does not actually persist — a fresh eval right after shows the pre-mutation
state. A single mutation with no delay persists fine; loops of `await`-ed
async calls (`setBoundVariable`, `setTextStyleIdAsync`, …) also seem fine on
their own, since each `await` yields. It is specifically a same-tick batch of
sync calls that gets lost before the bridge flushes it. Fix: `await new
Promise(r => setTimeout(r, 1500))` right before the script returns, after any
apply loop. `rename-text-styles.js` and `relink-text-style-usage.js` already
do this — `unbind-variables.js` and `scope-variables.js` do not yet.

**Known issue — a token path cannot drop its tier letter.** The dev CSS
build (`style-dictionary-formats-token-store.mjs:24`) only emits root-level
CSS variables matching `/^--ob-[sh]/` — anything else is silently absent from
the actual CSS, no build error. Confirmed (2026-09-10): a token moved to a
bare root (`ob.body.*`, `ob.authoring.*`, no tier letter) built without error
but produced zero matching `--ob-*` lines in the output. A token whose first
path segment happens to start with the letter "s" or "h" — "heading" was
tried and looked fine — passes by pure coincidence, not because it is
actually tier-tagged; do not treat that as proof the bare-root approach
works. Every token that needs to reach CSS keeps `ob.s.*` or `ob.h.*`. Trim
that prefix for Figma-panel readability only through a script here, never by
shortening the JSON path below the tier letter.

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

## rename-text-styles.js — cosmetic prefix rename for local text styles

**The problem.** A Figma text style's name comes straight from the token
path it was pushed under, dots turned into "/". The tier letter in that path
("s/", "h/") has to stay in the JSON — see the tier-letter known issue above
— but it is still noise for a designer picking a style in the panel.

**The fix.** Run `rename-text-styles.js`:

1. Edit the `CONFIG.renames` array — each rule is `{from, to}`, a literal
   prefix replacement. Verify the `from` prefix against the real style name
   in the Figma panel first; this is a string match, not a token-path guess.
2. Run with `mode: 'scan'` first — reports every planned rename, any
   collisions with a leftover style (split into `collisions`, blocked because
   the leftover still has live node usage, and `autoDeletableCollisions`,
   zero usage), changes nothing.
3. Re-run with `mode: 'rename'` to apply. Set `autoResolveCollisions: true`
   first if you want zero-usage leftovers deleted automatically as part of
   the run; otherwise clear `collisions` by relinking with
   `relink-text-style-usage.js` first, or leave them and re-run once cleared.

Never touches the token JSON, the CSS build, or variables — text style names
only. A style already on its target name is a no-op, so it is safe to re-run.
Only stays durable if the token path itself does not change again — see the
CAUTION note in the script header.

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
