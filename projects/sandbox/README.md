# Sandbox

The Sandbox is an internal playground application built with Oblique.
It is used for the development, testing, and experimentation of Oblique libraries and components. This is not
intended as documentation or a production application.

This project does not fully comply with Oblique’s quality guidelines and should not be used as an example for
production applications.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Getting Started

### Standard Development Server

From the monorepo root, start the development server:

```
npm start -w @oblique/sandbox
```

The application will be available at `http://localhost:3001`

### PAMS Development Server

PAMS is the authentication system used by applications linked to [ePortal](https://www.eportal.admin.ch).
To enable authentication on ePortal, `pams-proxy-library` must be running before starting the Sandbox.
This library is only available inside the federal network and is necessary for local development.

From the monorepo root, start the development server with pams:

```
npm start-pams -w @oblique/sandbox
```

The application will be available at `http://localhost:3000`

## Contributing

We welcome contributions from federal teams and the open-source community.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
