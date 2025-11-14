# CLI

The Oblique CLI is a command line interface tool that helps you create and maintain Oblique applications directly
from a command shell.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Documentation

The official Oblique CLI documentation is located here: <https://oblique.bit.admin.ch/introcudtions/cli>

It includes information about the entire ecosystem, usage instructions, code samples, FAQs, and more.

## Getting Started

The recommended way to use `@oblique/cli` is through npx, which gives you control over the version used. This
means no global installation is needed.

```
npx @oblique/cli@latest
```

This ensures you always use the latest version of the CLI.

If you need a specific version, replace `latest` with the desired version, for instance:

```
npx @oblique/cli@13
```

or

```
npx @oblique/cli@13.1.1
```

## Content

This package includes a few commands that call other tools as needed.

### Commands

| Command                                     | Parameter                         | Description                                                |
| ------------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| `npx @oblique/cli@latest new <projectName>` | The name of the project to create | Creates a new Oblique project                              |
| `npx @oblique/cli@latest update`            | N/A                               | Updates the Oblique project in which the command is called |

### Options

| Option            | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `-v`, `--version` | Prints the current version of `@oblique/cli`                    |
| `-h`, `--help`    | Prints the documentation for the command it has been applied to |

## Tips & Best Practices

- Always use the latest version to create new projects to avoid using outdated features
- Use the CLI version corresponding to the version you want to upgrade to for existing projects. For example, to go from Oblique 12 to 13:
- Update major versions one step at the time. For example, to go from Oblique 12 to 14, first update to 13, then to 14:
- Keep your project dependencies up-to-date. This helps fix bugs, improve performance, maintain security, ensure compatibility, and reduce technical debt.

## Contributing

We welcome contributions from federal teams and the open-source community.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
