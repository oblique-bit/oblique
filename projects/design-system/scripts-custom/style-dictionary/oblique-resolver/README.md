# Oblique token resolver — overlay for the official build

The official Style Dictionary build is the system developer's. It lives on
`master` at `projects/design-system/scripts/`, and the `tokens-dev` branch
deliberately does not carry it.

This folder lets the system designer run that exact build on the local
`tokens-dev` tokens — without copying it. It is two things: an overlay, and a
driver.

## The overlay

The only two files that differ from the developer's:

- **`themes.mjs`** — mode discovery, rewritten for the `tokens-dev` token
  structure: `mode_collections.json` (not `modes.json`), viewport selectors
  nested at `<mode>.name.$value`, group-aware lookup (`ui_scale` and `viewport`
  both carry `sm`/`md`/`lg`). This is also the file a structural change is PR'd
  from — see `../WORKFLOW.md`.
- **`style-dictionary.mjs`** — one change: broken references log as warnings
  (`brokenReferences: 'console'`) instead of aborting the build. Temporary,
  only while `tokens-dev` has undefined `ob.s.shadow.*` references. Never PR'd.

The developer's other five files — formats, transforms, preprocessors — are
used unedited from the worktree; they are not copied here.

## `resolve.mjs` — the driver

Copies the overlay and the local tokens into the `oblique-build` worktree, then
runs the developer's real, unmodified `extract-tokens.mjs` there. The output is
his build's actual output — same script, same format.

```sh
node resolve.mjs
```

Resolved CSS is written to `src/lib/css/layers/tokens.css`.

## Setup (once)

`resolve.mjs` needs the `oblique-build` worktree and its build dependencies —
see `../WORKFLOW.md`. If either is missing, `resolve.mjs` prints the exact
command to run.

## Known: dangling references on `tokens-dev`

`tokens-dev` references undefined `ob.s.shadow.*` tokens (shadow / elevation
work in progress) from `05_html/button/03_shadows.json`. Those tokens are
skipped; everything else resolves. A token-data gap on the branch, not a build
problem — and the reason `style-dictionary.mjs` is in the overlay.
