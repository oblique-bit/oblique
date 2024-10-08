# CLI

The Oblique CLI is a command line interface tool that you use to create and maintain Oblique applications directly form a command shell.

This package is the `@oblique/cli` library distributed on NPM.

See [README.md](../../README.md) for information about the other packages.

## Documentation

The official Oblique documentation is located here: <https://oblique.bit.admin.ch/>

You will find information about how to use Oblique, its CLI, code samples, FAQ and many more.

## Scripts

- **lint**: lints the project with EsLint and Prettier; Automatically run on the CI pipeline
- **format**: same as lint, but with autofix parameter
- **test**: run all tests and collects coverage
- **test-ci**: same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline
- **build**: build CLI; Automatically run on the CI pipeline
- **release**: create a new release, i.e. bump version number and updates the changelog

## Usage

Install the Oblique CLI globally:

`npm install -g @oblique/cli`

### Options

- **ob -v**: Shows the current version of @oblique/cli.
- **ob -h**: Shows a help message for the selected command in the console.

## How to test locally

Tests must be run with the `test` script and not through the IDE because the IDE can't properly execute `ts-node` commands.
To test that the CLI is globally executable, you need to execute the following commands:

- `npm run build -w projects/cli`
- `cd dist/cli`
- `npm link`

You can now call the CLI directly with `ob <command>`.

## Contribute to Oblique CLI

If you'd like to contribute, please follow our [contributing guidelines](../../CONTRIBUTING.md).

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication FOITT.

Licensed under the [MIT](../../LICENSE) license.
