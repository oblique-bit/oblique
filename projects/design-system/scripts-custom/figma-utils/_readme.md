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
   shadow effect style trim, and the `ob/s/color/` trim on the `semantic`
   variable collection, so names start with `neutral/`, `interaction/` etc.); fill in `scopeVariables` only when
   needed. The color doc builders accept both the trimmed and the untrimmed
   variable names.
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

## icon-workflow/ — one command for the icon workflow

Designers run one command. It downloads the icon SVG files from Git, validates them, reads the icon page of the open Figma file, compares both and shows what differs. With `--apply` it writes the changes into the Figma file and validates again.

```bash
# open the Figma file with the icon page first; run from the figma-cli folder or pass --cli-dir
node icon-workflow/icons.mjs            # plan: writes nothing
node icon-workflow/icons.mjs --apply    # writes into the open file
```

The command finds the library (`ds-library` or `legacy-library`) from the icon names. Optional: `--target <name>`, `--page <text>` (default `Icons`), `--only a,b` (these icons only), `--cli-dir <folder>`, `--work <folder>`, `--rules <file>`, `--force`, `--gallery <path>` (the gallery file in the repository, default from the rule file) and `--no-gallery` (skip the comparison of the texts).

**Parts behind it** in `lib/`: `fetch-icons.mjs` (downloads the SVG folder of the repository, pinned to one commit, and with `--gallery` the gallery file `icons.ts` of the same commit) and `validate-icon-set.mjs` (checks and compares) run in Node. `export-icon-set.js`, `import-icons.js` and `write-descriptions.js` run inside Figma, which cannot read files or Git; `figma-run.mjs` holds what the commands share. Designers do not open them. The validator also runs alone: `node icon-workflow/lib/validate-icon-set.mjs <folder with .svg files | export.json> [--against <folder>]`.

### What is checked

Every finding has a rule id and a severity; `lib/validate-icon-set.mjs --list-rules` prints the catalogue. Rules marked `team list` come from the icon checklist of OB legacy, the others are added checks.

| group | ids | covers |
|---|---|---|
| `N` naming | N01–N11 | lowercase name with `_` and `-`, both in one name (info), duplicates, whitespace and upper case, prefix, label (whitespace, equals the name, missing), page and section repeat the prefix word (info), icon missing in this set or in the reference set |
| `S` svg | S01–S17 | well-formed XML, root and namespace, viewBox, width and height, allowed elements, forbidden attributes, comments, path data, inside the viewBox, padding, duplicate artwork, decimals, root attributes, byte order mark, id attributes, shape equals the reference set, the required root id (git profile) |
| `C` color and line | C01–C08 | fill kind, stroke, opacity, one color per icon, set color, missing fill, line width, unpainted shape |
| `M` metadata | M01–M08 | category is one of the 12, keywords not empty and not repeated, the lines `Purpose type:` and `Description:` present (info while they are not written), purpose type single or multi, description equals the gallery entry, an entry in the gallery file for every icon and an icon for every entry, one keyword per gallery entry |
| `F` figma | F01–F12 | single component, size, one vector, layer name, fill binding, written color, stroke or effect or hidden layer, explicit mode, description, SVG color equals Figma color, every node named like an icon is a component, no styles |

Two shapes count as equal when their outlines lie within `compare.shapeTolerance` (0.05 px): Figma turns quadratic curves into cubic ones and adds or drops closing segments, so the path text of the same shape differs. The profile `git` is for SVG files as Illustrator writes them (no fill attribute, an XML declaration are tolerated, the `id="a"` on the root is required by rule S17 because `update-icons.ts` replaces it with the icon id and does not report a file without it), the profile `figma` for SVG exported from Figma, the profile `export` for the normalized files that `export-svg.mjs` writes (the Git format without the id: the build adds it).

### Metadata of the icons (`lib/compare-metadata.mjs`, `lib/metadata.mjs`)

The texts of an icon (usage, category, keywords, purpose type, description, old name, deprecated purpose) live in the Figma component description and in the SDS gallery file `icons.ts`. The Figma line `Keywords:` is the field `aliases` of the gallery file: both are search words. `compare-metadata.mjs` reads both and reports what differs. It writes nothing:

```bash
node icon-workflow/lib/compare-metadata.mjs --figma <export.json> --gallery <icons.ts> [--json <file>] [--all]
```

- `--figma`: the export of `export-icon-set.js` or a list of `[name, description]` pairs (the prefix `icon/` is ignored).
- `--gallery`: `projects/sds/src/app/code-examples/code-examples/icons/previews/icons-gallery/icons.ts`.
- Checks: names missing on one side, usage, category, keywords (as a set), purpose type, description, old name and deprecated purpose when the Figma description has them; the category is one of the 12; keywords are not empty and have no duplicates; the gallery keeps one keyword per entry. Exit code 1 when something is found.
- Format of the Figma description: the usage text, then `Category:`, `Keywords:` and the new lines `Purpose type:` (single or multi), `Description:`, `Old name:` (only for renamed icons) and `Deprecated purpose:` (only where the gallery has one: `headphones` and `id-card`). Decided on 2026-11-10 and 2026-11-11; written into the 284 descriptions of "OUI-4828 add icon set" on 2026-11-11.
- State on 2026-11-10 (Figma file "OUI-4828 add icon set" against the gallery file of `master`): 284 icons on both sides; usage and category equal in 284, keywords in 282 (`show-more_horizontal` and `show-more_vertical` differ in notation); 31 Figma descriptions repeat a keyword; 6 gallery entries keep several keywords in one text (`arrow_left`, `badge`, `branch`, `chevron_left`, `chevron_left_small`, `file_pdf`).
- **As rules in the validator.** `validate-icon-set.mjs` checks the same things as rules M01 to M08 (`--list-rules`). M01 to M05 read the Figma description, M06 to M08 need `--gallery <icons.ts>`: `node icon-workflow/lib/validate-icon-set.mjs <export.json> --gallery <icons.ts>`. M07 and M08 also work on a folder of SVG files. M03 and M05 are `info` until the new lines are written; then they can be raised to `error` in the rule file. The category list and the path of the gallery file are in the rule file (`metadata`).
- **In the `icons` command.** Step 1 downloads the gallery file of the same commit as the SVG files (`<work>/icons-gallery.ts`); steps 4 and 6 compare the Figma descriptions with it, the plan prints one `Texts:` line. Nothing is written for the texts.
- To build: the export of the gallery file and the changelog per release. The script that writes the new lines is `write-metadata.mjs` (next section).

### Writing the new lines (`write-metadata.mjs`)

The Figma description gets the lines `Purpose type:`, `Description:`, `Old name:` and `Deprecated purpose:` (decided on 2026-11-10 and 2026-11-11). The texts exist in the gallery file; this command copies them into the descriptions of the open Figma file once:

```bash
node icon-workflow/write-metadata.mjs --cli-dir <figma-cli folder>           # plan: writes nothing
node icon-workflow/write-metadata.mjs --cli-dir <figma-cli folder> --apply   # writes into the open file
```

- It adds only lines that are missing and keeps the existing text as it is; it never deletes. A second run changes nothing. An icon without a gallery entry, or where the gallery cannot give a line (purpose type neither single nor multi, no description), is listed and left alone.
- Steps: read the gallery file (downloaded from the repository, or `--gallery <icons.ts>`), export the descriptions (no SVG, a few seconds), plan, check in Figma (every component found, description unchanged since the export), and with `--apply` save the restore point "Before icon metadata" in the version history, write, export again and compare with the gallery file. `--figma <export.json>` plans from an export without touching Figma.
- State on 2026-11-11: written into "OUI-4828 add icon set" (restore point "Before icon metadata"): 284 descriptions got lines (Purpose type 284, Description 284, Old name 149, Deprecated purpose 2). Afterwards the old text is unchanged at the start of all 284 descriptions, no other property of any icon changed, and the validator finds 2 texts that differ from the gallery file (the keyword notation of `show-more_horizontal` and `show-more_vertical`).
- `Deprecated purpose:` exists only for `headphones` and `id-card`, the two gallery entries that carry a `deprecatedPurpose` text (what the icon showed before and which icon shows it now).

### Exporting the SVG files (`export-svg.mjs`)

The export step of the pipeline (board "Icons Workflows", Case 0 and the cases after it). It writes the icons of the open Figma file as SVG files in the format of the Git set, so that the DS Developers can take them into a pull request. Decided on 2026-11-11: the build (`update-icons.ts`) adds the id of an icon, so the files carry no id. The build changes only the id, the XML declaration and the line breaks, so the export itself removes what the build would keep: `width` and `height`, `fill="none"` on the root and the fixed fill of the path (see `lib/normalize-svg.mjs`).

```bash
node icon-workflow/export-svg.mjs --cli-dir <figma-cli folder> --target ds-library                       # only the changed and the new icons
node icon-workflow/export-svg.mjs --cli-dir <figma-cli folder> --target ds-library --all --zip --out ./icon-export   # the whole set and a zip
```

- Steps: download the SVG files of the repository as the reference (pinned to one commit, or `--git <folder>`), export the icon page with the SVG of every icon, normalize, run the SVG file check (profile `export`) and the comparison with Git, choose, write. The Figma tab must be in front.
- Normalizing: `<svg xmlns viewBox><path d/></svg>` with the XML declaration, on one line, without a line break at the end. Figma wraps three icons (`star`, `star_filled`, `exclamation_diamond`) in a `<g clip-path>` with a clipPath rectangle of the whole 24 x 24 area: that clip is removed when the vector lies inside the area (checked with its bounding box), so it cuts nothing. An icon that cannot be normalized (another viewBox, more than one path, other elements or attributes) is reported and never guessed.
- By default only icons that differ from Git (shape outside `compare.shapeTolerance`) or are new are written, so that Git sees a small difference. `--all` writes every icon (Case 0: the whole set), `--only a,b` limits the icons, `--no-git` skips the comparison.
- The SVG file check stops the export on errors (`--force` goes on). Differences from Git are the content of the export, not errors.
- State on 2026-11-11 ("OUI-4828 add icon set" against Git master 16.0.4): 284 icons normalized, 0 not normalizable, fill `#1C2834` removed from all 284, 0 errors in the check, 266 identical and 18 same shape in another notation, 0 changed, so the default run writes nothing. `--all --zip` writes 284 files. A test with a changed and a missing file in the reference wrote exactly those two.
- Open: the build must add the id when it is missing (today it only replaces `id="a"`), and once the exported files are in Git the `git` profile must stop requiring the root id (`profiles.git.svg.rootId` to `null`).

### Rule file (`icon-set-rules.json`)

| field | what it does |
|---|---|
| `namePrefix` | group of the component name, case included; `icon/` for the design system |
| `naming.pattern` | regular expression for the name after the prefix; default: lowercase, `_` or `-` between words |
| `svg.viewBox`, `svg.size` | expected viewBox and width/height in px |
| `svg.allowedElements`, `svg.forbiddenAttributes`, `svg.forbiddenAttributePrefixes` | what may appear in the SVG (`on` matches event handlers) |
| `svg.minPadding`, `svg.maxDecimals` | `null` = measured and reported only, a number switches the rule on |
| `colors.allowedKinds`, `colors.expected`, `colors.allowOpacity` | fill kinds (`hex`, `currentColor`, `none`, ...), the set color (`null` = the color most icons use), opacity |
| `stroke.allowed` | allow lines; when `true`, width, cap and join must match the rest of the set |
| `metadata.categories`, `metadata.galleryPath` | the 12 categories a description may name; the path of the gallery file `icons.ts` in the repository |
| `figma.expectedVariable`, `figma.childName`, `figma.descriptionPattern` | variable the vector fill must be bound to, vector layer name (`null` = not checked), description pattern |
| `targets` | one block per library with its own `namePrefix` and `figma.expectedVariable`: `ds-library` (`icon/`, `neutral/fg/contrast_high/inversity_normal`) and `legacy-library` (`Icon/`, `Text/High Emphasis`) |
| `profiles` | overrides for `git`, `export` and `figma` |
| `severity` | per rule id: `error`, `warn`, `info` or `off`, e.g. `{ "N01": "warn" }` |

### Notes

- **Safety.** The plan writes nothing. `--apply` writes only into the file that is open and was exported in the same run, saves a restore point "Before icon sync" first and never deletes. Git files with validation errors stop the run (`--force` goes on).
- **Any file.** File, branch and page names are not in the scripts, so the command runs on the legacy library and on the design system library alike. A renamed icon shows up as "only in Figma" plus "to create".
- **The Figma tab must be in front.** Figma does not draw a tab that is in the background, and the SVG export waits for the drawing. The export stops with a message when the tab is hidden: click the tab and run the command again. The page is the only thing that is loaded (`loadAllPagesAsync` takes minutes on the design system file).
- **New icons** get no description, Git has none. Rule F09 reports them.
- **Where the defaults come from.** The 24 px size is the documented `md` icon size (`documentation/06-components/icon/02-architecture.md`). Fill only, one path per icon and one color are what the current set of 284 icons does. The official icon guidelines are not readable as text, so no value is taken from them.
- **Limits of the SVG reader.** It reads elements and attributes, not CSS stylesheets; `<style>` is a forbidden element by default. Shapes inside `defs`, `clipPath` or `mask` do not count for colors. The bounding box is skipped when a `transform` is present.
- **Reports** of every step go to the working folder (`--work`, default `./icon-sync`).
- The Figma parts keep their header inside the IIFE, so `eval -f` returns the output (see the known issue at the top).
