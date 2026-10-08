# Oblique Local Registry

Local Verdaccio-based npm proxy for developing and testing the Oblique CLI.

## Setup

Install the monorepo dependencies from the repository root:

```sh
npm install
```

Then, from `tools/cli-registry`, make the command available as `obreg`:

```sh
npm run setup
```

## Run the registry

1. Start the registry in a terminal and leave it running:

   ```sh
   obreg start
   ```

2. In a second terminal, activate the registry. cmd.exe is not supported for this.

   Bash:

   ```sh
   eval "$(obreg env)"
   ```

   PowerShell:

   ```powershell
   obreg env | Invoke-Expression
   ```

   This sets environment variables that override npm configurations such as .npmrc in the current terminal session.
   For the local registry to be used, run all npm and ob commands from this terminal session.

## Publish local packages

From the repository root:

```sh
npm run build --workspace @oblique/oblique
npm run build --workspace @oblique/toolchain
npm publish ./dist/oblique --tag local
npm publish ./dist/toolchain --tag local
```

The `./` prefix matters. Without it npm reads `dist/oblique` as a GitHub
repository shorthand and hangs trying to reach it over SSH. On Windows the
same commands work in PowerShell with backslash paths
(`npm publish .\dist\oblique --tag local`).

The registry refuses to overwrite a published version. To replace one,
unpublish it first and publish again:

```sh
npm unpublish @oblique/oblique@<version> --force
npm publish ./dist/oblique --tag local
```

The published version must match the version `ob new` installs. Compare
`currentVersions` in `projects/cli/src/utils/cli-utils.ts` with the `version`
field in `dist/<package>/package.json`. If they differ, bump the package
version or update `currentVersions`, rebuild, and republish.

For local versions under active development, use an explicit tag such as
`local`. This keeps them separate from the registry's default `latest` version.

## Test the CLI

With the registry activated:

```sh
ob new <project-name>
```

`ob new` installs `@oblique/toolchain` and `@oblique/oblique` from the local
registry. Confirm what the registry serves with:

```sh
npm view @oblique/toolchain@local version
```

Without the `@local` tag this shows the `latest` version instead of the one
published for local testing.

## Troubleshooting

- `E404` on `@oblique/*`: the registry does not hold the pinned version and
  does not fall back to npmjs for these packages. Publish it (see above).
- Stale versions after republishing: stop the registry, delete
  `runtime/storage`, and start it again.
- `npm publish` fails with an auth error: re-run `eval "$(obreg env)"` in the
  current terminal.
- `npm publish` fails with "You cannot publish over the previously published
  versions": the version is already published. Unpublish it first (see above).
