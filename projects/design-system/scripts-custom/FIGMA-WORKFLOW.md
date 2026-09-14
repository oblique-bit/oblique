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
  before assuming the script itself is broken.
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
- **Every token that needs to reach CSS keeps a tier letter** ("ob.s.\*" /
  "ob.h.\*") in its path. The dev build's CSS format
  (`style-dictionary-formats-token-store.mjs:24`) only emits root variables
  matching `/^--ob-[sh]/` — a bare-root token path (no tier letter) silently
  produces zero matching CSS, no build error. Trim the tier letter for panel
  readability only through `run-cosmetics.js`, never by shortening the JSON
  path below the tier letter.

## Tools in this folder

- **`figma-doc-builders/`** — one subfolder per documentation page
  (typography, color-variables, color-pairings, dimension, viewport). Each
  has its own `build-<doc>.js` and `registry.json`.
- **`figma-utils/`** — standalone Figma-context maintenance scripts,
  including `run-cosmetics.js`. See `figma-utils/_readme.md` for the full
  list and what each one does.
