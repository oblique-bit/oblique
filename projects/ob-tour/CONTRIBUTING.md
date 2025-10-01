# Contributing to Obliques' Ob-Tour

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details about how to contribute.

All commits related to the Toolchain package must use the **ob-tour** package and 1 of the following scopes if any:

## <a name="scope"></a> Scope

- **utils**

## Scripts

The scripts in this project are only for internal usage.

- **lint**: lints the project with EsLint, StyleLint and Prettier; automatically run on the CI pipeline
- **format**: same as lint, but with autofix parameter
- **test**: run all Jest unit tests and collect coverage
- **test-ci**: same as test, but generates a Sonar report; automatically run on the CI pipeline
- **build**: build the library; automatically run on the CI pipeline
- **release**: create a new release, bump version number and update the changelog
- **tarball**: build and package the library as `.tgz` for installation into other projects

---
