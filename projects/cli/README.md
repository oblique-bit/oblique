# CLI

The Oblique CLI is a command-line interface tool designed to create and maintain Oblique applications directly from
a shell environment. It automates project setup, dependency management, and routine maintenance tasks,
providing a streamlined workflow for both new and existing Oblique applications.

See [README.md](../../README.md) for information about the other packages and projects in the Oblique ecosystem.

## Documentation

The official Oblique CLI documentation is located here: <https://oblique.bit.admin.ch/introductions/cli>

It includes information about the entire ecosystem, usage instructions, code samples, FAQs, and more.

## Getting Started

The recommended way to use `@oblique/cli` is via `npx`, allowing explicit control over the version to use. This
means no global installation is needed.

```shell
npx @oblique/cli@latest
```

This ensures the latest version of the CLI is used.

If a specific version is needed, replace `latest` with the desired version, for instance:

```shell
npx @oblique/cli@13
```

or

```shell
npx @oblique/cli@13.1.1
```

## Content

This package includes a few commands that call other tools as needed.

### Commands

If the project is behind by more than one major version, run the command step by step through each major version until
the latest is reached

| Command                                     | Parameter                         | Description                                                |
| ------------------------------------------- | --------------------------------- | ---------------------------------------------------------- |
| `npx @oblique/cli@latest new <projectName>` | The name of the project to create | Creates a new Oblique project                              |
| `npx @oblique/cli@latest update`            | N/A                               | Updates the Oblique project in which the command is called |

The `update` command performs the following actions:

- Migrate all Angular packages and their dependencies to the versions compatible with the latest Oblique version
- Migrate all Oblique packages and their dependencies to the latest version
- Update all other dependencies to their latest compatible versions
- Clean up the dependency tree

### Options

| Option            | Description                                                     |
| ----------------- | --------------------------------------------------------------- |
| `-v`, `--version` | Prints the current version of `@oblique/cli`                    |
| `-h`, `--help`    | Prints the documentation for the command it has been applied to |

## Tips & Best Practices

- Always use the latest version to create new projects to avoid using outdated features
- Use the CLI version corresponding to the target upgrade version for existing projects
- Update major versions one step at the time. For example, to go from Oblique 12 to 14, first update to 13, then to 14
- Keep the project dependencies up-to-date. This helps fix bugs, improve performance, maintain security, ensure compatibility, and reduce technical debt

## Contributing

Contributions from federal teams and the open-source community are welcome.
Please refer to our [contributing guidelines](../../CONTRIBUTING.md) while contributing to the Oblique ecosystem.

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication (FOITT).

Licensed under the [MIT](../../LICENSE) license.
