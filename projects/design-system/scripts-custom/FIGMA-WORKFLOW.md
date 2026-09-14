# Figma workflow — from Token Studio export to a published library

How a token change on `tokens-release-16` ends up as clean, publishable Figma
variables and styles. Covers the steps between a Token Studio export and
hitting Publish — the token JSON edit itself is a separate workflow, see the
`token-change-workflow` skill.

## The pipeline

```
edit tokens (git)  →  Token Studio: Pull  →  Token Studio: push to Figma
  →  run-cosmetics.js  →  doc builders (if a doc page needs it)  →  Publish Library
```

Order matters, in both directions:

- **cosmetics before doc builders.** A doc builder's `registry.json` declares
  each table's `stylePrefix` as the *already-cosmetic* name ("~authoring/",
  "heading/", "body/") — that is what it filters `getLocalTextStylesAsync()`
  by. Run a doc builder against a fresh, uncosmeticized export and every
  table comes back empty: nothing matches yet.
- **relink before rename/delete**, inside cosmetics itself — see below.

## Steps

### 1. Edit tokens, push to `tokens-release-16`

Normal token-change-workflow: edit JSON → run the resolver → commit → push.
Not covered here.

### 2. Pull in Token Studio

GitHub sync → Pull. Brings the latest JSON from `tokens-release-16` into the
Token Studio plugin.

### 3. Push from Token Studio to Figma

Create/update Styles & Variables. Figma-side names come straight from the
token path (dots → "/", leading "ob." stripped) — this is the raw,
tier-prefixed form ("s/typography/authoring/static/xs/normal",
"h/heading/H1"), not the friendly one a designer picks from.

**Known gotcha — composite tokens recreate regardless of set status.** A
`$type: "typography"` (or other composite) token pushes as a Figma *Style*,
not a Variable. Style creation for these does not respect a token set's
Enabled/Source/Disabled status the way variable creation does — confirmed
2026-09-14 for "05_html/link/link": neither Treat as Source nor Disabled, set
on every theme including the always-on "static" one, stopped Token Studio
from recreating "h/link/enabled/hover/focus/active" on export. The only
working fix is deleting it after each export — `run-cosmetics.js`'s
`textStyles.deletePrefixes` does this.

**Known gotcha — a re-export after a token path change orphans the cosmetic
rename.** Token Studio matches styles/variables by name derived from the
current path. If the path changed since the last export, the ref map for the
old name no longer matches anything current, so Token Studio creates a fresh
object under the new path-derived name instead of renaming the existing one
in place. The old, already-cosmeticized one survives as an orphan. This is
why every rename script here only stays durable once the token path is
settled — see the CAUTION note in each script's header.

### 4. Run `figma-utils/run-cosmetics.js`

One script, five toggleable steps, in order: relink → text styles (rename +
delete) → effect styles (rename) → variables (rename) → scope variables. Scan
mode first, always — see the script header and `figma-utils/_readme.md` for
what each step does and its CONFIG shape.

If a token path just changed and the doc page still shows live usage of the
old-named style, the relink step needs `prefixPairs` filled in for that
specific transition first — check via the script's own scan report, which
lists blocked renames.

### 5. Rebuild documentation pages (only if one needs it)

`node scripts-custom/figma-doc-builders/<doc>/build-<doc>.js`.

**Known gotcha — don't `--page` the canonical page directly.** Rebuilding
straight into the canonical (un-timestamped) page has produced duplicate
table frames more than once this session, specifically for multi-column
tables (interface/prose). The reliable pattern instead:

1. Run the builder with no `--page` override — creates a fresh timestamped
   scratch page.
2. Validate it (`0 errors, 0 warnings` in the builder's own output).
3. Rename the old canonical page to append `_deprecated` (never delete a
   Figma page outright — see the `feedback-figma-rename-not-delete` memory).
4. Rename the new scratch page to the canonical name.

The builder's own `deprecateOldScratchPages` only renames *other stray
timestamped* pages, never the canonical one — it will not do step 3/4 for
you.

### 6. Publish Library

Figma UI: Assets panel → Publish. Makes the updated variables/styles
available to files that consume this library.

## Other gotchas worth knowing

- **`figma-ds-cli eval -f <file>` sometimes returns no output at all**, with
  exit code 0, while the identical code passed inline (`eval "<code>"`)
  works. Not diagnosed. If a script produces nothing, retry as inline code
  before assuming the script itself is broken. One confirmed trigger
  (2026-09-14, `figma-utils/rewire-cover-colors.js`): a large leading JSDoc
  header comment — both `-f` and inline failed the same way with it in
  place, and stripping it (see that script's own header for the one-liner)
  fixed both immediately. Not a backtick issue and not an uncaught
  exception (a full try/catch around the body caught nothing either).
- **A specific "compute a summary object, then return/console.log it" shape
  can also produce silent empty output**, independent of the header-comment
  bug above — confirmed 2026-09-14 building `validate-all.js`'s sweep.
  Bisected down to: `findings.filter(...)` into `errors`/`warnings` arrays,
  then returning a `{ ok, errorCount, warningCount, findings, ... }` object
  built from them. A flat, unfiltered return (`{ pagesChecked, barsChecked,
  findings }`) with the exact same `findings` array worked every time, at
  every size tested down to a single finding. Root cause not identified —
  not comment size, not script length, not an uncaught exception (a
  try/catch around the whole body caught nothing). Workaround: keep the
  Figma-side script's return value flat; do any filtering/summarising in
  the Node-side caller instead.
- **`figma-ds-cli eval -f` needs to run from the `figma-cli` install
  directory** (`~/figma-cli` by default), not from this repo — otherwise it
  fails to resolve its own `src/figma-client.js` import, because the CLI
  computes that path relative to the current working directory instead of
  its own install location.
- **A tight loop of synchronous style/variable mutations can silently not
  persist.** `style.remove()` / `v.name = x` in a loop that returns
  immediately after can report success yet the change is gone on the very
  next read. Every apply step in `run-cosmetics.js` (and the standalone
  scripts it replaces) ends with a 1.5s delay before the script returns to
  give the plugin bridge time to flush — do not remove it.
- **`--validate` used to silently create a fresh empty scratch page on every
  run**, in any builder whose `ensurePage()` computes a timestamped scratch
  page name (typography, dimension — not color-pairings/color-variables/
  viewport, which resolve pages differently). It always appended the
  scratch-build timestamp to the target name, even in validate-only mode,
  so it never found the real canonical page, silently created an empty one
  named after the current minute, and then correctly reported every table
  missing from that empty page — while `--validate`'s own usage comment
  promised "no writes". Fixed 2026-09-14 in both builders: validate-only
  now always resolves the bare canonical name and throws instead of
  creating one if it's missing. If you have old `<canonical> <timestamp>`
  pages with zero content, they're likely a leftover from this — safe to
  rename `_deprecated` (never delete, see the memory note this repo
  follows on that).
- **Every token that needs to reach CSS keeps a tier letter** ("ob.s.\*" /
  "ob.h.\*") in its path. The dev build's CSS format
  (`style-dictionary-formats-token-store.mjs:24`) only emits root variables
  matching `/^--ob-[sh]/` — a bare-root token path (no tier letter) silently
  produces zero matching CSS, no build error. Trim the tier letter for panel
  readability only through `run-cosmetics.js`, never by shortening the JSON
  path below the tier letter.

## Health check: `figma-doc-builders/validate-all.js`

Read-only, safe to run anytime (never writes to Figma or a token file).
Two independent passes:

1. **Structural** — shells out to each of the 5 builders' own `--validate`
   (or `--mode validate` for color-pairings): row counts, duplicate frames,
   description mismatches, per that builder's own checks.
2. **Section-bar sweep** (the check nothing else does) — walks every
   canonical page and checks every `_docs/shared/section_bar` instance
   for: bound to the live component (not `_docs/shared/section_bar_deprecated`),
   correct tier variant, Color Bar strip hidden, the three
   maintainer/contributor/consumer badges hidden, and non-empty/non-default
   title + `$description` text. This is the check that would have caught
   every "wrong variant / stray badges" bug fixed on 2026-09-14 (dimension,
   color-pairings, viewport — see each builder's own `_readme.md` "Fixed
   bugs" section) before it ever reached a screenshot.

```bash
node scripts-custom/figma-doc-builders/validate-all.js                    # both passes
node scripts-custom/figma-doc-builders/validate-all.js --structural-only
node scripts-custom/figma-doc-builders/validate-all.js --sweep-only
```

Run this after rebuilding any doc page, and periodically even when nothing
changed — a page can drift (e.g. still bound to a component that was later
marked `_deprecated`) without anyone rebuilding it.

## Tools in this folder

- **`figma-doc-builders/`** — one subfolder per documentation page
  (typography, color-variables, color-pairings, dimension, viewport), plus
  the cross-page `validate-all.js` above. Each subfolder has its own
  `build-<doc>.js`, `registry.json`, and `_readme.md`.
- **`figma-utils/`** — standalone Figma-context maintenance scripts,
  including `run-cosmetics.js`. See `figma-utils/_readme.md` for the full
  list and what each one does.
