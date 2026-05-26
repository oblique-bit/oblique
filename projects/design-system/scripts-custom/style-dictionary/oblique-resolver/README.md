# Oblique token resolver — overlay for the official build

The official Style Dictionary build is the system developer's. It lives on
`master` at `projects/design-system/scripts/`, and the `tokens-dev` branch
deliberately does not carry it.

This folder lets the system designer run that exact build on the local
`tokens-dev` tokens — without copying it. It is two things: an overlay, and a
driver.

## The overlay

The only file that differs from the developer's:

- **`themes.mjs`** — mode discovery, rewritten for the `tokens-dev` token
  structure: per-axis `01_global/mode_collection/<axis>.json` (not the original
  `modes.json`), local working copy (no remote git-checkout), group-aware
  lookup (`ui_scale` and `viewport` both carry `sm`/`md`/`lg`). Identifies
  the always-on base themes (`static`, `semantic`) as the set-difference:
  `$themes.json` groups that have no matching `mode_collection/<axis>.json`
  file. Token Studio's single-mode-group semantics already encode this — the
  set-difference reads it back out for the build. Real axes contribute their
  default mode (the one with `selector.$value === "default"`); every other
  mode of an axis produces a per-mode build. This is also the file a
  structural change is PR'd from — see `../WORKFLOW.md`.

The developer's other build files — `style-dictionary.mjs`, formats,
transforms, preprocessors — are used unedited from the worktree; they are not
copied here.

## The dev proposal — separate branch

The canonical proposal of `scripts/tokens/themes.mjs` for the developer's
build lives on its own branch off `master`:

- Branch: `tokens-pr-themes-mjs`
- Path on that branch: `projects/design-system/scripts/tokens/themes.mjs`
- Open the PR: https://github.com/oblique-bit/oblique/pull/new/tokens-pr-themes-mjs

Same parser as `themes.mjs` here, plus the `checkoutThemeFiles(themesPath)`
wrapper so the developer's existing remote-checkout build workflow is
preserved. Branched off `master` so a normal PR diff lands exactly where his
file lives and can be reverted cleanly.

## `resolve.mjs` — the driver

Copies the overlay and the local tokens into the `oblique-build` worktree, then
runs the developer's real, unmodified `extract-tokens.mjs` there. The output is
his build's actual output — same script, same format.

```sh
npm run resolve
```

Resolved CSS is written to `src/lib/css/layers/tokens.css`.

## Setup (once)

`resolve.mjs` needs the `oblique-build` worktree and its build dependencies —
see `../WORKFLOW.md`. If either is missing, `resolve.mjs` prints the exact
command to run.
