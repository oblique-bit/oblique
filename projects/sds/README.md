# Swiss Design System (SDS)

SDS is the documentation site for the entire Oblique ecosystem, and it is deployed at https://oblique.bit.admin.ch.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Getting Started

From the monorepo root, start the development server:

```shell
npm start -w @oblique/sds
```

The application will be available at `http://localhost:4200`

### Data source

All data except from the code examples are stored in a headless CMS. There is only one CMS instance, meaning that even in development, production data
are used.

There are 3 types of pages: text, tabbed and component pages.

#### Text pages

The most basic page type - it simply displays the content of the _description_ field from the CMS. It is used for pages that mostly contains text.
Each page can be versioned, meaning that its presence and content depend on the selected version.

#### Tabbed pages

The core page type used to document features. It contains 3 tabs: Examples, UI/UX and API.

- The **UI/UX** and **API** tabs, like text pages, display the content of a field in the CMS. These tabs can also be versioned, so their content
  depends on the selected version.
- The **Examples** tab, on the other hand, shows working code examples. These examples are not stored on the CMS but are loaded from the application
  itself. While different examples can be loaded depending on the selected version, they always use the latest version of Oblique. They demonstrate
- what the selected version could do, but are implemented with the most recent version.

#### Component page

A special page type that displays an Angular component, which may or may not load data from the CMS. It is used for specific pages that include logic
or to avoid code duplication in the CMS.

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
