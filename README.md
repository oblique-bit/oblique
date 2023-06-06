# Oblique

An Angular front-end framework tailored for your swiss branded business web application.

Oblique provides a standardized corporate design look and feel as well as a collection of ready-to-use Angular components. Oblique, through its fully customizable master layout, takes care of the application's structure, letting you focus on the content.

Oblique uses [npm](https://www.npmjs.com/), [AngularCLI](https://cli.angular.io/) and [Sass](http://sass-lang.com/) to fetch dependencies, compile & build assets, compose HTML and serve & watch web content.

## Documentation

The official Oblique documentation is located here: <https://oblique.bit.admin.ch/>

You will find information about how to use Oblique, code samples, FAQ and many more.

## Support

For questions and support please contact us by [email](<mailto:Oblique@bit.admin.ch?subject=%5BSupport%7C%20Question%7C%20Request%7C%20Feedback%5D&body=Hello%20Oblique%0D%0A%5BYour%20message%5D%0D%0A%0D%0A%0D%0AHere%20is%20my%20context%0D%0A%0D%0A-%20Names%20of%20the%20features%3A%0D%0A%0D%0A-%20Detailed%20description%20and%20screenshots%3A%0D%0A%0D%0A-%20npm%20version%3A%0D%0A%0D%0A-%20Node%20version%3A%0D%0A%0D%0A-%20Used%20Angular%20version%3A%0D%0A%0D%0A-%20Used%20Oblique%20version%3A%0D%0A%0D%0A-%20Other%20dependencies%20(if%20they%20play%20a%20role%20in%20your%20request)%3A%0D%0A%0D%0A-%20Link%20to%20reproduce%20the%20required%20steps%3A%0D%0A%0D%0AKind%20regards%0D%0A%5BYour%20signature%5D%0D%0A%0D%0A%0D%0A%0D%0A>).

Please write your message as precisely as possible so that we can answer you more quickly.

Helpful context could be:

- Names of the features
- Detailed description with screenshots
- Used npm version
- Used Node version
- Used Angular version
- Used Oblique version
- Other dependencies (if they play a role in your request)
- Link to reproduce the required steps

## Usage

### Embedding Oblique into your project

1. Update your project to the Angular version supported by the Oblique version you want to install. Have a look at the Angular update guide for more instructions: <https://update.angular.io>
2. Add Oblique to your project: `ng add @oblique/oblique`. This interactive command will:
   - add oblique and its dependencies
   - refactor your application to integrate Oblique
   - optionally replace jasmine with jest
   - optionally configure Sonar
   - optionally configure Jenkins & Cloud Foundry
   - optionally replace `tslint` with `eslint` and `prettier`
   - optionally add a git hook to auto format files before push

### Checking for updates

- Bump dependencies through Angular cli first: `ng update`
- Then update oblique: `ng update @oblique/oblique`
- Finally update the dependencies without build-in schematics: `npm update`
- New major versions can be discovered through `npm outdated`

## Contribute to Oblique

If you'd like to contribute, please follow our [contributing guidelines](CONTRIBUTING.md).

## Code of Conduct

Help us keep Oblique open and inclusive. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Copyright (c) The Swiss Confederation, represented by the Federal Office of Information Technology, Systems and Telecommunication FOITT.

Licensed under the [MIT](LICENSE) license.
