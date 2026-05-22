# Style Dictionary — token build workflow

How design tokens become CSS, and the responsibilities of the system designer
and the system developer across the handoff.

## Roles

- **System designer** — owns the token JSON. Works on `tokens-dev`, edits and
  validates the tokens, and adapts the local resolver when the token structure
  changes.
- **System developer** — owns the official Style Dictionary build on `master`.
  Consumes the tokens from `tokens-main` and produces the CSS the components
  use.

## Branches

```
tokens-dev   ──►   tokens-main   ──►   master
```

- **tokens-dev** — the system designer's working branch. All token editing
  happens here.
- **tokens-main** — the handoff point. The system designer pushes the token
  JSON here for the system developer to build from.
- **master** — the system developer's branch. The official Style Dictionary
  build lives here. It reads the JSON from `tokens-main` and extracts the CSS
  the components use.

## Two builds — same engine, different roles

|                | Owner            | Reads tokens from   | Purpose                                 |
| -------------- | ---------------- | ------------------- | --------------------------------------- |
| Official build | System developer | `tokens-main`       | Produces the CSS the components use     |
| Local resolver | System designer  | local `tokens-dev`  | Pre-validation and real resolved values |

The resolver (`oblique-resolver/`) is a copy of the official build, adapted
only so it runs on `tokens-dev`. The output format is identical — resolver
output matches what the official build produces.

## Daily workflow

The system designer runs the resolver whenever a real resolved value is
needed — Figma work, `.md` documentation, validator scripts, prototypes:

```sh
cd oblique-resolver && node extract-tokens.adapted.mjs
```

## Before the handoff

1. **Run the resolver as a check.** Broken references or errors are fixed on
   `tokens-dev` first, before they reach the system developer.
2. **Push the token JSON to `tokens-main`.** This is the handoff; the official
   build runs from there.

## When the token structure changes

Renaming token files or restructuring global settings breaks the official
build, because the developer's script expects the previous structure.

In that case:

1. **The system designer adapts the resolver** — normally only `themes.mjs`,
   the mode-discovery file. The designer knows what changed in the JSON; the
   developer does not.
2. **The change reaches the developer as a Pull Request** against `master`, so
   the official script learns the new structure.
3. **The structural JSON and the script update land together** — the JSON on
   `tokens-main` and the script update on `master` — or the official build
   breaks.

## Rules

- **The five verbatim files are never edited** — `style-dictionary-formats.mjs`,
  `style-dictionary-formats-token-store.mjs`, `style-dictionary-transforms.mjs`,
  `style-dictionary-preprocessors.mjs`, `style-dictionary-preprocessors-typography.mjs`.
  They are the developer's, copied as-is.
- **Only `themes.mjs` is adapted** — and only when the token structure changes.
- **`extract-tokens.adapted.mjs` is the designer's entry script** — it stays
  different from the developer's on purpose (the developer's fetches from
  `tokens-main` and deletes the folder afterwards; the designer's reads local
  files and keeps them). It is never part of a Pull Request.
- **Dependencies track the developer's** — the Style Dictionary and
  sd-transforms versions in `package.json` match the official build.
- **Generated folders are never committed** — `node_modules/`, `build/` and
  `oblique-resolver/output/` are git-ignored.

## Tools in this folder

- **`oblique-resolver/`** — the resolver: CSS output and pre-validation.
- **`build.js`** — a flat "token → resolved value" lookup. Secondary.

Tool detail: see `README.md`.
