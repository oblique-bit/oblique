# Style Dictionary tooling

Deterministic resolution of the Oblique design tokens — values computed from
the source JSON in `../../src/lib/themes/`, never guessed.

Style Dictionary `5.4.0` + `@tokens-studio/sd-transforms` `2.0.3` — the system
developer's pinned versions.

## Two tools

### `oblique-resolver/` — the real build  ←  use this

Runs the developer's official build on your local `tokens-dev` tokens.
`oblique-resolver/` holds only the one file that differs from his — the
overlay (`themes.mjs`) — plus a driver, `resolve.mjs`, that applies the
overlay in the `oblique-build` worktree and runs his real, unmodified
`extract-tokens.mjs` there. Output is his exact format — layered `tokens.css`
(`:root` plus `.ob-lightness-dark`, `.ob-density-*`, … mode blocks).

```sh
npm run resolve
```

First run needs a one-time worktree setup — see `WORKFLOW.md`. Detail on the
overlay is in `oblique-resolver/README.md`.

### `build.js` — quick flat-value lookup

Builds each `$themes.json` theme on its own to `build/<theme>.json` — a flat
`token path → resolved value` map. Useful for "what does `ob.s.color…`
actually resolve to" checks. The `package.json` here is `build.js`'s — run
`npm install` here once.

```sh
npm run build
```

Secondary tool: the `$themes.json` themes are mode-slices, so non-colour
themes resolve only partially here. For proper mode-combination use
`oblique-resolver/`.

## Which to use

- Need the CSS artifact, or anything authoritative → **`oblique-resolver/`**.
- Need a fast flat lookup of one token's value → `build.js`.

Both are kept on purpose — they produce different things (a CSS file vs a
flat JSON map).
