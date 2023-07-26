# SDS Schematics

This README contains the details to the schematics which depends on the SDS project.

SDS provides the following schematics:

- add-code-examples
- add-preview

These schematics are generate-schematics. For more information about generate-schematics
see https://angular.io/cli/generate

## Prerequisites

Make sure you have installed the schematics package: `npm install -g @angular-devkit/schematics-cli`

## How to run

You can run it

- over the scripts `add-code-example` and `add-preview` located in `./projects/sds/package.json`
- with the console commands running the scripts (see [Add code examples](#add-code-example) and [Add-preview](#add-preview))
- over the npm package called `schematics` (see [If you run with schematics package](#if-you-run-with-schematics-package))

It matters where you run the schematics from.

### Add-code-example

```
cd ./projects/sds/ && npm run add-code-example [name] && ../../
```

#### Add-code-example arguments

If you don't add the name the add-example-schematics will ask you for it.

| ARGUMENT | DESCRIPTION                 | VALUE TYPE |
| -------- | --------------------------- | ---------- |
| name     | The name of the new example | string     |

### Add-preview

```
cd ./projects/sds/ && npm run add-preview [code-example] [preview] && cd ../../
```

#### Add-preview arguments

If you don't add the name the add-example-schematics will ask you for it.

| ARGUMENT     | DESCRIPTION                                                               | VALUE TYPE |
| ------------ | ------------------------------------------------------------------------- | ---------- |
| code-example | The name of the example. If it doesn't already exist, it will be created. | string     |
| preview      | The name of the new preview. Must be unique within the code-example.      | string     |

- The **first** argument is the name of the new or existing example where the preview will be added. If the code-example
  don't exist, a new one will be created.
- The **second** argument is the name of the new preview which will be created.

### If you run with schematics package

If you want to run the schematics with the `@angular/schematics` package, you need to execute the build script first.

For example:

```
cd ./projects/sds && npm run schematics-build
```

## Options

For more information about schematic options see https://angular.io/cli/generate

## Troubleshooting

### No files written to disk

**Problem**: If you have the message `Dry run enabled by default in debug mode. No files written to disk.` in the console and no files are written to disk.

**Solution**: Add at the end of your command `--dry-run=false` .

**Reason**: If you are running the schematic locally, by default it will be running in a dry run.
