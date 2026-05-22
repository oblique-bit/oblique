# Style Dictionary — token build workflow

How design tokens become CSS, and the responsibilities of the system designer
and the system developer across the handoff.

## Roles

- **System designer** — owns the token JSON. Works on `tokens-dev`, edits and
  validates the tokens, and adapts the overlay when the token structure
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

The resolver is not a copy of the official build — it *is* the official build.
`oblique-resolver/resolve.mjs` runs the developer's real, unmodified
`extract-tokens.mjs` in the `oblique-build` worktree (a checkout of `master`),
with a two-file overlay applied for the `tokens-dev` token structure. Same
script, same engine — the output is the developer's exact format.

## Setup (once)

`resolve.mjs` needs the `oblique-build` worktree — a second working directory
beside this repo, checked out to `master`, sharing the same `.git` (no second
clone) — and the developer's build dependencies installed in it:

```sh
git fetch origin
git worktree add -b tokens-pr-staging ../oblique-build origin/master
npm --prefix ../oblique-build/projects/design-system install --no-save \
    style-dictionary@5.4.0 @tokens-studio/sd-transforms@2.0.3
```

The worktree is both the build environment for `resolve.mjs` and the staging
area for the Pull Request below. If it or its dependencies are missing,
`resolve.mjs` prints these commands.

## Daily workflow

The system designer runs the resolver whenever a real resolved value is
needed — Figma work, `.md` documentation, validator scripts, prototypes:

```sh
node oblique-resolver/resolve.mjs
```

It writes `src/lib/css/layers/tokens.css`.

## Before the handoff

1. **Run the resolver as a check.** Broken references or errors are fixed on
   `tokens-dev` first, before they reach the system developer.
2. **Push the token JSON to `tokens-main`.** This is the handoff; the official
   build runs from there.

## When the token structure changes

Renaming token files or restructuring global settings breaks the official
build, because the developer's script expects the previous structure.

In that case:

1. **The system designer adapts the overlay** — normally only `themes.mjs`,
   the mode-discovery file. The designer knows what changed in the JSON; the
   developer does not.
2. **The change reaches the developer as a Pull Request** against `master`, so
   the official script learns the new structure.
3. **The structural JSON and the script update land together** — the JSON on
   `tokens-main` and the script update on `master` — or the official build
   breaks.

## How the PR is made

The Pull Request in step 2 above is a change to `themes.mjs` on `master` — the
build code the system developer owns. `tokens-dev` never merges into `master`,
so the PR is staged from the `oblique-build` worktree (set up above).

Per structural change, in `../oblique-build`:

1. `git fetch origin`, then branch off the latest master —
   `git checkout -b tokens-feature/OUI-XXXX-… origin/master`.
2. Copy the adapted `oblique-resolver/themes.mjs` over the worktree's
   `scripts/tokens/themes.mjs`. `git diff` now shows exactly the adaptation,
   nothing else.
3. Commit, push, open the PR against `master`. It lands together with the
   token JSON pushed to `tokens-main`.

The PR branch keeps the `tokens-` prefix, like every branch here. Only
`themes.mjs` crosses over — `style-dictionary.mjs`, `resolve.mjs` and the rest
of `oblique-resolver/` stay on `tokens-dev`, never part of the PR.

## Rules

- **The developer's build is used, not copied.** `extract-tokens.mjs` and
  every file in `scripts/tokens/` run unedited from the worktree — except the
  two the overlay replaces.
- **The overlay is two files.** `themes.mjs` — the structural adaptation, the
  one file PR'd to `master`. `style-dictionary.mjs` — a temporary tweak (broken
  references warn instead of aborting), never PR'd, gone once `tokens-dev`'s
  dangling `ob.s.shadow.*` references are defined.
- **`resolve.mjs` drives, never adapts.** It applies the overlay and runs the
  developer's script; it is never part of a Pull Request.
- **Dependencies track the developer's** — Style Dictionary `5.4.0` and
  sd-transforms `2.0.3`, his pinned versions, installed in the worktree.
- **Generated folders are never committed** — `node_modules/` and `build/` are
  git-ignored.

## Tools in this folder

- **`oblique-resolver/`** — the resolver: the overlay plus `resolve.mjs`, which
  runs the developer's real build. CSS output and pre-validation.
- **`build.js`** — a flat "token → resolved value" lookup. Secondary.

Tool detail: see `README.md`.
