# Contributing to Toolchain

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for details about how to contribute.

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Toolchain package must use the
**toolchain** package and one of the following scopes:

### <a name="scope"></a> Scope

| Scope          | Description                                 |
| -------------- | ------------------------------------------- |
| **linting**    | For changes to any of the linting solutions |
| **schematics** | For changes to any Schematics               |

## <a name="scripts"></a> Scripts

| Script          | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| **link**        | Builds the Toolchain package and links it locally                                |
| **build**       | Builds the Toolchain package; automatically run on the CI pipeline               |
| **lint**        | Lints the project with ESLint and Prettier; automatically run on the CI pipeline |
| **format**      | Same as lint, but tries to fix the code with EsLInt/Prettier                     |
| **test**        | Runs all tests and collects coverage                                             |
| **test-ci**     | Same as test, but also generates SonarQube reports for CI                        |
| **release**     | Creates a new release (bumps version number and updates changelog)               |
| **npm-publish** | Publishes the package on NPM; automatically run on the CI pipeline               |

## <a name="test"></a> How to test the Schematics locally

From the monorepo root

- Build the library:
  ```shell
  npm run build -w @oblique/toolchain
  ```
- Create a tarball:
  ```shell
  cd projects/toolchain && npm pack
  ```
- Copy the tarball into a test project
- Run the `ng-add` Schematics manually to simulate installation:
  ```shell
  npx @angular-devkit/schematics-cli dist/toolchain/:ng-add
  ```
  st the path if your project structure differs.
