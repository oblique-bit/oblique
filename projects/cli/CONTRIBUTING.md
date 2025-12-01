# Contributing to CLI

## <a name="commit"></a> Commit Message Guidelines

`docs`, `feat`, `fix`, `test`, and `refactor` commits affecting the Service Navigation Web Component package
must use the **service-navigation** package and one of the following scopes:

### <a name="scope"></a> Scope

| Scope      | Description                          |
| ---------- | ------------------------------------ |
| **utils**  | For changes to the utility functions |
| **new**    | For changes to the `new` command     |
| **update** | For changes to the `update` command  |

## <a name="scripts"></a> Scripts

| Script          | Description                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------- |
| **start**       | Executes the `ob` command without parameters                                                    |
| **link**        | Builds the CLI and call `npm link` on the artifact to allow the CLI to be called globally       |
| **lint**        | Lints the project with EsLint and Prettier; Automatically run on the CI pipeline                |
| **format**      | Same as lint, but tries to fix the code with EsLInt/Prettier/StyleLint                          |
| **test**        | Runs all tests and collects coverage                                                            |
| **test-ci**     | Same as test, but an additional Sonar report is generated; Automatically run on the CI pipeline |
| **build**       | Builds CLI; Automatically run on the CI pipeline                                                |
| **release**     | Creates a new release, i.e. bump version number and updates the changelog                       |
| **npm-publish** | Publishes the package on NPM; automatically run on the CI pipeline                              |

## <a name="test"></a> How to test locally

Tests must be run with the `test` script and not through the IDE because the IDE can't properly execute `ts-node`.

To test that the CLI is globally executable, you need to execute the following commands from the monorepo root:

```shell
npm run build -w projects/cli
```

```shell
cd dist/cli
```

```shell
npm link
```

You can now call the CLI directly with `ob <command>`.
