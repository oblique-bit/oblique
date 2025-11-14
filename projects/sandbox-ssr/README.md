# Sandbox SSR

The Sandbox SSR is an internal playground application built with Oblique and supporting server-side rendering (SSR).
It is used for the development, testing, and experimentation of Oblique libraries and components in an SSR context.

Unlike the standard Sandbox, `@oblique/oblique` cannot be used because it is not yet compatible with SSR. As a
result, Oblique's master layout is unavailable.

This application is intended to become the official documentation site for the Oblique ecosystem once development
is complete.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Getting Started

### Standard Development Server

From the monorepo root, start the development server as a regular Angular app:

```
npm start -w @oblique/sandbox-ssr
```

The application will be available at `http://localhost:3002`

### SSR Development Server

From the monorepo root, start the development server with server-side rendering:

```
npm start-ssr -w @oblique/sandbox-ssr
```

The application will be available at `http://localhost:3004`

## Contributing

We welcome contributions from federal teams and the open-source community.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
