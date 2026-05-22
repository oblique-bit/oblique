# Oblique token resolver — local copy for `tokens-dev`

The dev's official resolver lives on `master` at `projects/design-system/scripts/`.
It is written for the `tokens-main` branch and **cannot run on `tokens-dev`**.
This is a local copy adapted so you can run it on the `tokens-dev` tokens
yourself.

## Run

```sh
node extract-tokens.adapted.mjs                     # → output/lib/css/layers/tokens.css
node extract-tokens.adapted.mjs ../../../src/lib    # → writes the real artifact into src/lib
```

No install needed — it reuses `../node_modules` (Style Dictionary 5.4.1 +
`@tokens-studio/sd-transforms` 2.0.3).

## What is unchanged vs the dev's original

Copied verbatim from `master:scripts/tokens/`, no edits:

- `style-dictionary-formats.mjs`, `style-dictionary-formats-token-store.mjs`
- `style-dictionary-transforms.mjs`
- `style-dictionary-preprocessors.mjs`, `style-dictionary-preprocessors-typography.mjs`

So the **output format is the dev's exact format** — `:root` base block plus
`.ob-lightness-dark`, `.ob-viewport-*`, `.ob-density-*` … mode blocks.

## What is adapted

- **`themes.mjs`** — rewritten. The original reads `01_global/modes.json`
  (`ob.g.modes`); `tokens-dev` has `01_global/mode_collections.json`
  (`ob.g.mode_collections`), nests viewport selectors at `<mode>.name.$value`,
  and renames groups. The lookup is also group-aware (`ui_scale` and `viewport`
  both have `sm`/`md`/`lg`).
- **`extract-tokens.adapted.mjs`** — replaces `extract-tokens.mjs`. Reads the **local**
  `src/lib/themes` working copy; does **not** check tokens out from a remote
  branch and does **not** delete `src/lib/themes` afterwards.
- **`style-dictionary.mjs`** — one line: broken references log as warnings
  (`brokenReferences: 'console'`) instead of aborting the build.

## Known: dangling references on `tokens-dev`

`tokens-dev` has 29 unresolved references — mainly `ob.s.shadow.*`, referenced
by `05_html/button/03_shadows.json` but defined nowhere (shadow/elevation work
in progress). Those tokens are skipped in the output; everything else resolves.
This is a token-data gap on the branch, not a resolver problem.
