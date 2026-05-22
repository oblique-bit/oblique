# Style Dictionary tooling

Deterministic resolution of the Oblique design tokens — values computed from
the source JSON in `../../src/lib/themes/`, never guessed.

Style Dictionary `5.4.1` + `@tokens-studio/sd-transforms` `2.0.3`. Run
`npm install` once here; both tools below share this one `node_modules/`.

## Two tools

### `oblique-resolver/` — the real build  ←  use this

A copy of the dev's official resolver (`projects/design-system/scripts/` on
`master`), adapted to run on the `tokens-dev` branch. Produces the layered
`tokens.css` — `:root` plus mode blocks (`.ob-lightness-dark`,
`.ob-viewport-*`, `.ob-density-*`, …) — in the dev's exact output format, and
reads your local tokens non-destructively.

```sh
cd oblique-resolver && node extract-tokens.adapted.mjs
```

Full detail — what's copied verbatim, what's adapted, the BK-geometry caveat —
in `oblique-resolver/README.md`.

Why a local copy: the dev's `scripts/` resolver is written for `tokens-main`
and crashes on `tokens-dev` (renamed `modes.json` → `mode_collections.json`,
restructured viewport modes). The copy rewrites only the mode-discovery file
and skips the destructive remote-checkout step.

### `build.js` — quick flat-value lookup

Builds each `$themes.json` theme on its own to `build/<theme>.json` — a flat
`token path → resolved value` map. Useful for "what does `ob.s.color…`
actually resolve to" checks.

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
