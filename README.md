# Oblique
An Angular front-end framework Tailored for your swiss branded business web application.

Oblique provides a standardized corporate design look and feel as well as a collection of ready-to-use Angular components. Oblique, through its fully customizable master layout, takes care of the application's structure, letting you focus on the content.

Oblique uses [npm](https://www.npmjs.com/), [AngularCLI](https://cli.angular.io/) and [Sass](http://sass-lang.com/) to fetch dependencies, compile & build assets, compose HTML and serve & watch web content.

## Documentation
The official Oblique documentation is located here: <https://oblique.bit.admin.ch/>

You will find information about how to use Oblique, code samples, FAQ and many more.

## Support
For questions and support please contact us by [email](mailto:Oblique@bit.admin.ch).

## Usage
### Embedding Oblique into your project
1. Update your project to the Angular version supported by the Oblique version you want to install. Have a look at the Angular update guide for more instructions: <https://update.angular.io>
2. Add Oblique to your project: `ng add @oblique/oblique`. This interactive command will:
    * add oblique and its dependencies
    * refactor your application to integrate Oblique
    * optionally replace jasmine with jest
    * optionally configure Sonar
    * optionally configure Jenkins & Cloud Foundry
    * optionally replace `tslint` with `eslint` and `prettier`
    * optionally add a git hook to auto format files before push

### Checking for updates
* Bump dependencies through Angular cli first: `ng update`
* Then update oblique: `ng update @oblique/oblique`
* Finally update the dependencies without build-in schematics: `npm update`
* New major versions can be discovered through `npm outdated`

## Contribute to Oblique
If you'd like to contribute, please follow our [contributing guidelines](CONTRIBUTING.md).

## Code of Conduct
Help us keep Oblique open and inclusive. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License
Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication FOITT.

Licensed under the [MIT](LICENSE) license.

## Telemetry
The Oblique front-end framework includes a telemetry feature that collects usage information about its modules and versions.
It's important that the Oblique team understands which modules are used, so it can be decided on where to invest its limited resources.
The collected data are linked to the project name and version configured in the `package.json` file. Only the Oblique team has access to the collected data.

You will find more information about the telemetry in the [documentation](https://oblique.bit.admin.ch/components/telemetry).
