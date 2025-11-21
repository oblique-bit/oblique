# Service Navigation Web Component

The Oblique Service Navigation Web Component provides a framework-agnostic implementation of
Oblique’s Service Navigation based on [Angular Elements](https://angular.dev/guide/elements). It enables
non-Angular applications to integrate seamlessly with [ePortal](https://eportal.admin.ch/) while adhering to the
federal Web Guidelines. This component ensures a consistent and compliant navigation experience across projects,
even in non-Angular environments.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Documentation

The official Oblique Service Navigation Web Component documentation is located here:
<https://oblique.bit.admin.ch/guidelines/service-navigation-web-component-14>

## Getting Started

From the monorepo root, start the development server:

```shell
npm start -w @oblique/service-navigation-web-component
```

The application will be available at `http://localhost:3003`

For the Service Navigation to actually connect to [ePortal](https://www.eportal.admin.ch), `pams-proxy-library` must be running before
starting the Sandbox.
This library is only available inside the federal network and is necessary for local development.

## Content

This package includes:

- A Web Component that wraps the Service Navigation component from `@oblique/oblique`

## Tips & Best Practices

- Use the Service Navigation Web Component as a regular NPM dependency that is installed locally
- Install the Service Navigation Web Component locally, do not use it directly from the web
- If the application is build with Angular, consider using the standard Service Navigation component from `@oblique/oblique` instead

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
