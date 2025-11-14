# Contributing to Design System

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details about how to contribute.

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Design System package must use the
**design-system** package and one of the following scopes:

### <a name="scope"></a> Scope

| Scope      | Description                      |
| ---------- | -------------------------------- |
| **styles** | For changes in the global styles |

## <a name="scripts"></a> Scripts

| Script             | Description                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **lint**           | Lints the projects with EsLint, StyleLint and Prettier; Automatically run on the CI pipeline    |
| **format**         | Same as lint, but tries to fix the code with EsLInt/Prettier/StyleLint                          |
| **test**           | Runs all tests and collects coverage                                                            |
| **test-ci**        | Same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline |
| **build**          | Builds the library; Automatically run on the CI pipeline                                        |
| **release**        | Creates a new release, i.e. bump version number and updates the changelog                       |
| **extract-tokens** | Extracts design tokens from GitHub and generates CSS variables                                  |
