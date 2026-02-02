# SDS Schematics

SDS proposes Schematics to help documenting Oblique features efficiently

## Getting Started

### Add a New Code Example

From the monorepo root, generate a new code example:

```shell
npm run add-code-example <code-example-name> -w projects/sds
```

This will create a new folder in `projects/sds/src/app/code-examples/code-examples/<code-example-name>` that contains
the wrapper component for documenting the feature.

If `<code-example-name>` is not provided, the Schematics will prompt for it.

### Add a Preview

From the monorepo root, add a preview to an existing code example:

```shell
npm run add-preview <code-example-name> <preview-name> -w projects/sds
```

This will create a new folder in `projects/sds/src/app/code-examples/code-examples/<example-name>/<preview-name>`
that contains the component to demonstrate the preview

If `<code-example-name>` and `<preview-name>` are not provided, the Schematics will prompt for them. If only one
argument is provided, it is assumed to be `<code-example-name>`.

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.

# SDS Schematics

SDS proposes some Schematics to help documenting Oblique features.

## Getting Started

### Add a New Code Example

From the monorepo root, generate a new code example:

```shell
npm run add-code-example <code-example-name> -w projects/sds
```

This will create a new folder in `projects/sds/src/app/code-examples/code-examples/<code-example-name>` that contains
the wrapper component to document the feature.

If `<code-example-name>` is not provided, the Schematics will prompt for it.

### Add a Preview

From the monorepo root, add a preview to an existing code example:

```shell
npm run add-preview <code-example-name> <preview-name> -w projects/sds
```

This will create a new folder in `projects/sds/src/app/code-examples/code-examples/<example-name>/<preview-name>`
that contains the component to demonstrate the preview

If `<code-example-name>` and `<preview-name>` aren't provided, the Schematics will prompt for them. If only one
argument is provided, it will be assumed to be `<code-example-name>`

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
