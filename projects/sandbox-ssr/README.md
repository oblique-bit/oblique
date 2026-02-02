# Sandbox SSR

The Sandbox SSR is an internal playground application built with Oblique, supporting server-side rendering (SSR).
It provides an environment for testing Oblique libraries and components in an SSR context. Unlike the standard
Sandbox, Oblique’s master layout is unavailable due to current SSR limitations. This project is intended to
evolve into the official documentation site for the Oblique ecosystem.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Getting Started

### Standard Development Server

From the monorepo root, start the development server as a regular Angular app:

```shell
npm start -w @oblique/sandbox-ssr
```

The application will be available at `http://localhost:3002`

### SSR Development Server

From the monorepo root, start the development server with server-side rendering:

```shell
npm start-ssr -w @oblique/sandbox-ssr
```

The application will be available at `http://localhost:3004`

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
