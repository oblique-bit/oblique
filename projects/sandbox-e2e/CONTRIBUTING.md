# Contributing to Sandbox E2E

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Sandbox E2E
package must use the **sandbox-e2e** package and one of the following scopes:

### <a name="scope"></a> Scope

| Scope     | Description                                                                  |
| --------- | ---------------------------------------------------------------------------- |
| **setup** | For changes to the e2e testing setup and tooling (config, scripts, CI, docs) |
| **specs** | For changes to the e2e test specs                                            |

## <a name="scripts"></a> Scripts

| Script | Description
|
| ------------------ | --------------------------------------------------------------
--------------------------------- |
| **test** | Runs the Playwright e2e tests against a locally served sandbox
|
| **test-ci** | No-op placeholder; e2e is disabled in CI until a supported browser image is available |
|
| **build** | No-op placeholder; the e2e package has nothing to build |
|
| **test:headed** | Runs the e2e tests in a visible browser
|
| **test:debug** | Runs a single e2e test with the Playwright inspector
|
| **install:browsers** | Installs the Chromium browser required by Playwright
|
| **display:report** | Opens the last Playwright HTML report
|
| **lint** | Lints the project with ESLint and Prettier; automatically run on the CI pipeline |
| **format** | Same as lint, but tries to fix the code with ESLint/Prettier
|
