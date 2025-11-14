# Service Navigation Web Component

The Oblique Service Navigation Web Component provides Oblique’s Service Navigation as a framework-agnostic
[Web Component](https://angular.dev/guide/elements). Its primary goal is to enable non-Angular applications
to seamlessly connect to [ePortal](https://eportal.admin.ch/) while adhering to the federal Web Guidelines,
ensuring a consistent and compliant navigation experience across projects.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Documentation

The official Oblique Service Navigation Web Component documentation is located here:
<https://oblique.bit.admin.ch/guidelines/service-navigation-web-component-14>

It includes information about the entire ecosystem, usage instructions, code samples, FAQs, and more.

## Getting Started

From the monorepo root, start the development server:

```
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

- Use the Service Navigation Web Component as a regular NPM dependency that is installed locally.
- Do not use NPM as a CDN to embed the Service Navigation Web Component .
- If your application is build with Angular, consider using the standard Service Navigation component from `@oblique/oblique` instead.

## Contributing

We welcome contributions from federal teams and the open-source community.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
