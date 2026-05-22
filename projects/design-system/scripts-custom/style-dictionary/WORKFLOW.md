# Style Dictionary — token build workflow

How design tokens become CSS, and who does what. Written for the
non-developer side of this work — kept deliberately simple.

## Branches

```
tokens-dev   ──►   tokens-main   ──►   master
(you work         (handoff — you      (the dev moves
 here, always)     push your JSON      it here manually)
                   for the dev)
```

- **tokens-dev** — your working branch. All token editing happens here.
- **tokens-main** — the meeting point. You push your token JSON here so the
  dev can build from it.
- **master** — the dev's. His official Style Dictionary build lives here. It
  reads the JSON from `tokens-main` and extracts the CSS the components use.

## Two builds — same engine, different jobs

|                | Whose                | Reads tokens from        | Job                                      |
| -------------- | -------------------- | ------------------------ | ---------------------------------------- |
| Official build | Dev's, on `master`   | `tokens-main`            | Produces the real CSS for the components |
| Your resolver  | Yours, this folder   | your local `tokens-dev`  | Pre-validate + see real resolved values  |

Your resolver (`oblique-resolver/`) is a copy of the dev's build, adapted
only so it runs on `tokens-dev`. The output format is identical — what you
see is what the dev will get.

## Day to day — run your resolver whenever you need a real value

```sh
cd oblique-resolver && node extract-tokens.adapted.mjs
```

Use it instead of guessing a resolved token value — Figma work, writing
`.md` docs, running validator scripts, building prototypes later.

## Before handing tokens to the dev

1. **Run the resolver as a check.** If it reports broken references or
   errors, fix them on `tokens-dev` first. This catches problems before they
   reach the dev.
2. **Push your JSON to `tokens-main`.** That is the handoff — the dev builds
   from there.

## When you change token STRUCTURE (not just values)

Renaming token files or restructuring global settings breaks the dev's
build, because his script expects the old structure.

When that happens:

1. **Adapt your resolver** — normally just `themes.mjs` (the mode-discovery
   file). You know what changed in the JSON; the dev does not.
2. **Send the dev a Pull Request** against `master` with that change, so his
   script learns the new structure. (Claude prepares the PR for you.)
3. **Land them together** — the structural JSON on `tokens-main` and the
   script update on `master` must arrive together, or the dev's build breaks.

## Rules that keep this from getting complicated

- **Never edit the 5 verbatim files** — `style-dictionary-formats.mjs`,
  `style-dictionary-formats-token-store.mjs`, `style-dictionary-transforms.mjs`,
  `style-dictionary-preprocessors.mjs`, `style-dictionary-preprocessors-typography.mjs`.
  They are the dev's, copied as-is.
- **The file you adapt is `themes.mjs`** — and only when token structure
  changes. That is normally the only one.
- **`extract-tokens.adapted.mjs` is your entry script** — it stays different
  from the dev's on purpose (his fetches from `tokens-main` and deletes the
  folder after; yours reads local files and keeps them). Never PR it.
- **Keep dependencies matching the dev's** — the Style Dictionary and
  sd-transforms versions in `package.json` should track his. When he bumps,
  you bump. You are aligned today.
- **Generated folders are never committed** — `node_modules/`, `build/` and
  `oblique-resolver/output/` are git-ignored.

## The two tools here

- **`oblique-resolver/`** — the real build. CSS + pre-validation. Use this.
- **`build.js`** — quick flat "token → resolved value" lookup. Secondary.

Tool detail: see `README.md`.
