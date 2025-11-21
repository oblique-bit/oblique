# Oblique

Oblique is the unified frontend ecosystem of the Swiss Confederation — encompassing all libraries, tools,
guidelines and services that shape how we design, build, and maintain user interfaces.

It provides a cohesive foundation for consistent, maintainable and high-quality frontend development across all
projects.

## Documentation

The official Oblique documentation is located here: <https://oblique.bit.admin.ch/>

It includes information about the entire ecosystem, usage instructions, code samples, FAQs, and more.

## Getting Started

To set up the monorepo locally, install dependencies:

```shell
npm ci
```

Then run the sandbox

```shell
npm start -w @oblique/sandbox
```

## Content

This monorepo contains the following packages and applications:

| Project                                                                                 | Description                                           |
| --------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [CLI](projects/cli/README.md)                                                           | Command-line interface for managing frontend projects |
| [Design System](projects/design-system/README.md)                                       | Core visual and interaction design foundations        |
| [Oblique](projects/oblique/README.md)                                                   | The historical all-in-one Angular library             |
| [Sandbox](projects/sandbox/README.md)                                                   | Development playground for testing Oblique features   |
| [Sandbox SSR](projects/sandbox-ssr/README.md)                                           | Server-side rendered sandbox setup                    |
| [SDS](projects/sds/README.md)                                                           | The documentation for the Oblique ecosystem           |
| [Service Navigation Web Component](projects/service-navigation-web-component/README.md) | The Service Navigation implemented as a Web Component |
| [Styles Builder](projects/stylesBuilder/README.md)                                      | Internal tool to transpile SCSS files                 |
| [Toolchain](projects/toolchain/README.md)                                               | Shared build and development tooling                  |

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](LICENSE) license.
