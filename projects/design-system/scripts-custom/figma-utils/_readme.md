# figma-utils

Standalone Figma-context maintenance scripts. They run against the `figma`
plugin global — not Node. Run them either via the figma-console MCP
(`figma_execute`) or by pasting into the Desktop Bridge plugin console.

**Exception: `prune-orphan-variables.js` runs from Node**, not the plugin
sandbox — it has to read the token JSON off disk, which nothing running
inside Figma can do. See its own section below.

**Start with `run-cosmetics.js`.** It runs the relink/rename/delete/scope
scripts below together, in the right order, from one CONFIG block — the
single step to run after every Token Studio export. The scripts below still
work standalone (debugging one step, or a one-off task these don't cover),
but for the normal after-export routine, use `run-cosmetics.js`. See
`../FIGMA-WORKFLOW.md` for where this step fits in the full pipeline, from a
token edit to a published library.

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

**Known issue — `figma-ds-cli eval` can silently return nothing for a file
with a large leading JSDoc header.** Confirmed 2026-09-14 on
`rewire-cover-colors.js`: both `eval -f` and inline `eval "$(cat ...)"`
returned empty output (exit 0, no error) with the file's ~55-line header
comment in place — even wrapping the whole body in try/catch caught nothing,
so it is not an uncaught JS exception. Stripping the leading `/** ... */`
block before running fixed it immediately; the code itself was never at
fault. Not the same bug as the backtick-in-comment issue noted elsewhere (this
file had none) and not fully diagnosed — root cause presumed to be somewhere
in the CLI's own script-embedding/escaping, unrelated to what the script
does. Workaround, and a one-liner to apply it, is documented in
`rewire-cover-colors.js`'s own header. Pasting into the Desktop Bridge plugin
console directly (skipping the CLI) does not hit this.

## run-cosmetics.js — the one script to run after every export

**The problem.** Trim, scoping, and text/effect-style rename+relink used to
be separate scripts run by hand, in an order that had to be remembered every
time — relink before rename whenever a rename target is already occupied by
a leftover with live usage. Forgetting a step, or the order, is how the
library drifts out of its cosmetic state between exports.

**The fix.** Run `run-cosmetics.js`:

1. Edit the CONFIG block — one section per step (`relink`, `textStyles`,
   `effectStyles`, `variables`, `scopeVariables`), each independently
   toggleable via its own `enabled` flag. Defaults are today's known-good
   rules (heading/body/authoring text style trim, "h/link/\*" deletion,
   shadow effect style trim); fill in `variables`/`scopeVariables` only when
   needed.
2. Run with `mode: 'scan'` first — every step reports its plan, changes
   nothing.
3. Re-run with `mode: 'apply'` to run every enabled step for real, in order.

Same collision handling (`autoResolveCollisions`), same flush-delay-before-
return, same scan-then-apply discipline as the standalone scripts it wraps.
See `../FIGMA-WORKFLOW.md` for the full pipeline this step fits into, and the
gotchas that motivated each step's defaults (composite tokens recreating
regardless of set status, re-export orphaning a cosmetic rename, …).

## prune-orphan-variables.js — find (and delete) Figma variables with no JSON token

**The problem.** Every Figma variable in this library is supposed to have a
matching token in `src/lib/themes/`, no exceptions — variables come into
existence only through a Token Studio push, never by hand directly in Figma.
In practice they drift apart: a token path rename pushes a new variable
under the new name without
removing the old one (same cause as the text-style rename gotcha above), or —
not allowed, but it happens — someone creates a variable by hand directly in
Figma. Either way the variable has no JSON backing and should not be there.
The first audit of this file (2026-09-22) found 869 such variables out of
1882, 859 of them sitting in 19 collections literally named after old JSON
file paths from a prior naming migration.

**The fix.** Run `prune-orphan-variables.js` **from a terminal, not Figma**:

1. `node prune-orphan-variables.js` — scan mode (the only mode without
   flags). Reads every token JSON file fresh off disk, reads every local
   Figma variable via `figma-ds-cli`, and reports two things: collections
   that are 100% orphaned (every variable inside failed both the key and
   name check — safe delete candidates) and stray orphans inside otherwise-
   healthy collections (need a human to look at each one, never auto-
   deleted by this script).
2. Read the report. A fully-orphaned collection with a name that still looks
   like a real live token family (not an obvious old file path) deserves a
   second look before deleting — check whether its variables really have no
   current JSON equivalent under a new name.
3. `node prune-orphan-variables.js --apply --confirm <ids.json>` — the scan
   run writes this file for you and prints the exact command; `ids.json` is
   just the array of `VariableCollectionId`s from `fullyOrphanedCollections`
   you're confirming. Deletes only those collections, only if their variable
   count still matches what the scan saw.

### Two matching methods, because one alone has a gap

A variable counts as backed by JSON if either is true:
- its Figma `key` (the REST API stable id) appears in `$themes.json` ->
  `$figmaVariableReferences`, unioned across every theme entry, or
- its Figma `name` (slashes) matches some token's own JSON path (dots ->
  slashes, no prefix stripped).

The first method alone produces false positives: `TIMING` and `EASING`
variables (`ob/s/motion/duration/*`, `ob/s/motion/easing/*`) never appear in
`$figmaVariableReferences` even though the tokens exist and the variables are
live — confirmed during the first audit, where 5 such variables were
initially flagged and then ruled out by hand. The name fallback catches
those. Trust the report's `strayOrphans` less than `fullyOrphanedCollections`
for exactly this reason — a stray is far more likely to be a fresh gap in
the matching logic than an actual defect.

### Safety model

Stricter than every other script here on purpose, because this one deletes
collections, not just renames things:
- scan never writes, ever.
- apply only deletes a collection that is 100% orphaned AND explicitly
  listed in `--confirm`'s file. It never touches a stray orphan automatically.
- re-checks each collection's variable count right before deleting it.
- same as any destructive Figma write in this repo: if the apply run gets
  denied by the auto-mode classifier even after you've confirmed it, run the
  printed command yourself in your own terminal.

Run this alongside `run-cosmetics.js` after every Token Studio push — see
`../FIGMA-WORKFLOW.md` step 4. Scan every time; apply only when it actually
finds something.

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

## relink-variable-aliases.js — repoint local variable values off a dead library

**The problem.** `unbind-variables.js` clears one channel that keeps a ghost
collection alive in the variable-mode picker: a *node* consuming a remote
variable. This script clears the other channel, where no node is involved at
all — a **local variable's own value** aliases a variable in a remote
collection. Figma keeps that collection subscribed and caches its last
published values inside the file, so it survives even unpublishing or
deleting the source library. Nothing on the canvas shows it; only the mode
picker does.

**The fix.** For every local variable value that aliases a remote variable,
find the local variable with the identical name and repoint the alias there.
It never drops a reference it cannot replace — a repoint is blocked (and
reported, not guessed around) when there is no local variable of that exact
name, the name is ambiguous (more than one local variable shares it), or the
two variables' `resolvedType` don't match.

1. Run with `mode: 'scan'` first — reports the full plan, every blocked case
   and why, and (with `reportValueImpact: true`, the default) which relinks
   would actually change the resolved value versus the frozen remote
   snapshot.
2. Re-run with `mode: 'relink'` to apply. The report's `remoteAliasesRemaining`
   tells you whether any local-variable-value channel is still open; **the
   ghost collection itself stays cached in the file until it is reopened**,
   even at 0 remaining references — reopen before judging the picker.

### CONFIG fields

| field | what it does |
|---|---|
| `mode` | `'scan'` (report only) or `'relink'` (repoint the matched aliases) |
| `fileKeyGuard` | refuse to run unless the open file has this key; `null` = any file |
| `collectionFilter` | array of remote collection names to target; `null` = any |
| `reportValueImpact` | `true` = also report every relink that would change the resolved value (costs a second pass) |

### Notes

- Covers only channel #2 of three. The report's `otherGhostChannels` tallies
  the other two (node bindings, node `explicitVariableModes` overrides) so a
  partial fix here is never mistaken for a fully closed picker — run
  `unbind-variables.js` for the node-binding channel.
- A relinked value can visibly change: the remote alias is a frozen snapshot
  from whenever the library was last published into this file, and the local
  twin may have since diverged. Always check `valueChanges` in the scan report
  before relinking.
- Local variable ids never contain `/`; remote ones do (`VariableID:<40hex>/<node:id>`).
  That is the pre-filter used to find alias targets worth checking at all.

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

## relink-text-style-usage.js — repoint nodes off a renamed text style onto its twin

**The problem.** A token path rename makes Token Studio push a NEW Figma text
style under the new path-derived name — it does not rename the old style in
place, because it matches styles by name on push. The old style survives,
orphaned, and every node still using it (typically the typography
documentation page, which applies each style to a sample text node on the
"Specimen" cell) stays bound to the dead one. Deleting the old style before
relinking would strip those nodes down to a plain, unlinked local text style.

**The fix.** Run `relink-text-style-usage.js`:

1. Edit `CONFIG.prefixPairs` — `{oldPrefix, newPrefix}` rules. A style's
   remainder after the old prefix must match a real style under the new
   prefix, or it is reported as blocked, not guessed.
2. Set `CONFIG.pageName` to scope the walk to one page — recommended, since
   the file has more than one page and others may use the same styles for
   unrelated reasons. `null` walks every page.
3. Run with `mode: 'scan'` first — reports every node that would move, and
   which old styles have no matching twin. Changes nothing.
4. Re-run with `mode: 'relink'` to apply.

Never deletes a style — that stays a separate step (`rename-text-styles.js`
with `autoResolveCollisions: true`, or by hand) once every node has moved off
it. Run this before that rename whenever its target name is already occupied
by a leftover style with live usage.

## rename-variables.js — cosmetic prefix rename for local variables

**The problem.** Same problem as `rename-text-styles.js`, one Figma primitive
over: a variable's name comes straight from its token path, and the tier
letter that has to stay in the JSON is still noise in the variables panel.
This is the one already done once by hand — the "ob/s/" trim on compiled-tier
(S3) color variables that `build-color-variables.js` / `build-color-pairings.js`
already expect and reconstruct the real token path around — but it was never
captured as a script until now.

**The fix.** Run `rename-variables.js`:

1. Edit `CONFIG.renames` — same `{from, to}` prefix-rule shape as
   `rename-text-styles.js`. Set `CONFIG.collectionName` to scope the rename to
   one variable collection, recommended so an accidental prefix match in
   another collection is not renamed too.
2. Run with `mode: 'scan'` first — reports every planned rename and any
   collisions, changes nothing.
3. Re-run with `mode: 'rename'` to apply.

Unlike text styles, a variable rename **never needs a relink pass first**:
Figma bindings reference a variable by id, not name, so renaming in place
(same id) never orphans an existing fill/stroke/sizing binding. A blocked
collision here means a second variable object genuinely still in use under
that target name, not something `relink-text-style-usage.js`'s pattern would
fix — resolve it by hand. Never touches the token JSON or the CSS build.
Same tier-letter and re-export-stability caveats as `rename-text-styles.js`
apply — see the script header.

## rename-effect-styles.js — cosmetic prefix rename for local effect styles

**The problem.** Same problem as `rename-text-styles.js`, one Figma primitive
over: an effect style's name (shadow, blur) comes straight from its token
path — "ob.s.shadow.sm" pushes as "s/shadow/sm" — and the tier letter that
has to stay in the JSON is still noise in the effect styles panel.

**The fix.** Run `rename-effect-styles.js`: same `{from, to}` prefix-rule
CONFIG, scan-then-rename flow, and collision handling as
`rename-text-styles.js`. Unlike text styles, checking a collision's usage
only needs `node.effectStyleId` (no per-range mixed-effect case to worry
about the way text has `figma.mixed` fills).

Same tier-letter and re-export-stability caveats as `rename-text-styles.js`
apply — see the script header.

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

## rewire-cover-colors.js — rebind a detached cover's colors to local variables

For cover/thumbnail artwork pulled from an older library file into an
isolated buffer, fully detached (instances + variable bindings), then pasted
into the current library. After detach the colors are plain literals with no
usable variable name to fall back on (the old names, e.g. "Background/white",
don't correspond to current Oblique naming) — the only way back to live
variables is matching each literal's resolved color value against this
library's own local variables. This script does that matching + binding, one
cover frame at a time.

Run scan first, always. Review `plan` (what would bind) and `unmatched`
(colors with no entry in `colorMap`/`nodeOverrides` — left as-is, on purpose)
before switching to `rewire`. See the script's own header for the full
CONFIG shape, what it deliberately leaves literal (flag red/white, a
Presentation-mode chrome replica, a "safe area" guide, a WIP badge helper —
see the "Known issue" block above this section for the header itself needing
to be stripped when running through the CLI), and a worked example from the
first two covers rewired this way (2026-09-14, "Oblique Design System R16
Prep": internal-library cover at `364:13`, Figma Community cover at `372:2`,
both bound to `03_semantic/color/compiled`'s
`color/neutral/{bg,fg,border}/...` variables, zero remote bindings left on
either).

## sort-deprecated-pages.js — keep every "_deprecated" page below the separator

This library keeps a literal `_________________________________`
(underscores) page as a visual divider — everything named `*_deprecated`
belongs below it, so the top of the page list stays just the real, current
pages. Renaming a page to `_deprecated` (by hand, or via a doc-builder's own
`deprecateOldScratchPages()`) never repositions it, so a page created near
the top of the list stays there even once deprecated, unless something
moves it.

Run scan first, always. `apply` moves every `*_deprecated` page found above
the separator to sit directly below it (in the order found), and leaves
pages already below it untouched. Never touches page content, only
position.

As of 2026-09-14, every doc-builder's own `deprecateOldScratchPages()`
(typography, dimension, color-variables, color-pairings) also does this
move inline, right after renaming — so this script is now mainly for
ad-hoc cleanup (e.g. after a manual rename) rather than something you need
to remember to run after every build.
