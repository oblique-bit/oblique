# Styles Builder

The Styles Builder is an internal tool within the Oblique monorepo that compiles SCSS source files into final
CSS assets. It is used exclusively by the Oblique build process and is not intended for external use.
Styles Builder ensures that all Oblique component styles and global styles are correctly transpiled and
aggregated for distribution.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Getting Started

The Styles Builder is **always** invoked by the `@oblique/oblique` build script and should never be run manually.  
From the monorepo root, build the Oblique library:

```shell
npm run build -w @oblique/oblique
```

The Styles Builder itself only transpiles the following SCSS files into CSS

- `projects/oblique/src/styles/scss/oblique-core.scss`
- `projects/oblique/src/styles/scss/oblique-alert.scss`
- `projects/oblique/src/styles/scss/oblique-icons.scss`
- `projects/stylesBuilder/oblique-components.scss`

The build script of the Oblique library handles:

- Aggregating all component SCSS files into `projects/stylesBuilder/oblique-components.scss`
- Copying all generated CSS files into `dist/oblique/styles/css`

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
