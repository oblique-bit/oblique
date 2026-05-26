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
  lookup (`ui_scale` and `viewport` both carry `sm`/`md`/`lg`). Uses a uniform
  `default` rule: every group — including `static` and `semantic` — has a
  `mode_collection/<axis>.json` file with exactly one mode whose
  `selector.$value === "default"`. That default mode contributes to the
  always-on base; non-default modes produce per-mode builds. Single-mode
  base groups (`static`, `semantic`) contribute their tokens to every build's
  default set and generate no per-mode build of their own. This is also
  the file a structural change is PR'd from — see `../WORKFLOW.md`.

The developer's other build files — `style-dictionary.mjs`, formats,
transforms, preprocessors — are used unedited from the worktree; they are not
copied here.

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
