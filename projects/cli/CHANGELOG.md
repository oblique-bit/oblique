# [15.0.0-rc.1](https://github.com/oblique-bit/oblique/compare/14.2.1...15.0.0-rc.1) (2026-01-23)

## Features

- **new:** remove installation of additional dependencies ([109bba61](https://github.com/oblique-bit/oblique/commit/109bba614d336192eaeab21f6e4b745a834bfe42))
- **new:** no longer add `@angular/animations` ([ced1c9b1](https://github.com/oblique-bit/oblique/commit/ced1c9b1d1deb0888d19d23b8895b95a67277273))
- **update:** update all Angular dependencies of the project ([7d8a536d](https://github.com/oblique-bit/oblique/commit/7d8a536d929c59ae202ccb9eaf4c875ce03451e4))

# [14.1.2](https://github.com/oblique-bit/oblique/compare/14.1.1...14.1.2) (2025-12-01)

## Bug Fixes

- **cli:** display help text when no command is given ([4fc44912](https://github.com/oblique-bit/oblique/commit/4fc4491285fa0c87864553908c9de4218fb7bf4a))
- **new:** force `@angular/platform-browser-dynamic` installation ([05153151](https://github.com/oblique-bit/oblique/commit/051531517cabe18a774952c4fd4b700ea50d6ffe))

# [14.1.0](https://github.com/oblique-bit/oblique/compare/14.0.2...14.1.0) (2025-11-03)

## Features

- **cli:** display meaningful error when trying to execute unknown command ([72453297](https://github.com/oblique-bit/oblique/commit/72453297d7f397aee8ad45dce2828b14d8791a21))

# [14.0.0](https://github.com/oblique-bit/oblique/compare/13.3.1...14.0.0) (2025-09-22)

## Bug Fixes

- **new:** deactivate `zoneless` and `config-ai` per default ([4ad351fc](https://github.com/oblique-bit/oblique/commit/4ad351fcb8da435415ed1f1cb182fa8dd858dc92))
- **new:** make sure that all commands are executed in the correct directory ([b7d2dee9](https://github.com/oblique-bit/oblique/commit/b7d2dee9b2f68276c33f4812e532baba56c88e6e))
- **new:** run lint format to avoid formatting issues ([50c975ea](https://github.com/oblique-bit/oblique/commit/50c975ea5921a8c17e66daf8b4319e812d93460b))
- **new:** remove sonar option from tests ([0fa094ed](https://github.com/oblique-bit/oblique/commit/0fa094edbcf5e9b5e8457ed4547d2c43c7352a82))
- **update:** use `--force` to update Angular and its related dependencies ([1e674fec](https://github.com/oblique-bit/oblique/commit/1e674fec2be06a2e911aaae4d6b8c0401681cd00))
- **utils:** make sure to use a CLI version above 20.2 ([3c9ff81b](https://github.com/oblique-bit/oblique/commit/3c9ff81bf18f4409724354a00fc3630a2001a5ee))
- **utils:** make sure the `@oblique/oblique` version matches the CLI one during installing ([fcf64712](https://github.com/oblique-bit/oblique/commit/fcf64712a1633c8bb014bc965e0015dd8e1c937e))
- **utils:** update recommended and minimum supported Node versions ([55f78ec3](https://github.com/oblique-bit/oblique/commit/55f78ec3637224f75066d2e9fdc26bd678ee8989))

## Features

- **cli:** remove protractor option ([77ac01af](https://github.com/oblique-bit/oblique/commit/77ac01afd5bc4a53362557125edc63646c0b8be6))
- **new:** add `@oblique/toolchain` dependency ([c9940142](https://github.com/oblique-bit/oblique/commit/c99401427c32a9b738faa1bc8be5024fc9c6e597))
- **new:** remove sonar step ([01e0b53d](https://github.com/oblique-bit/oblique/commit/01e0b53dba73becab8dcd6448a9ccf12871c3f5d))
- **utils:** deactivate `fund` and `audit` info on NPM commands ([4ac7401d](https://github.com/oblique-bit/oblique/commit/4ac7401dcd1ff26ee2c90c32fd26c4324b306ae1))

# [13.3.1](https://github.com/oblique-bit/oblique/compare/13.3.0...13.3.1) (2025-07-10)

## Bug Fixes

- **new:** add `@angular/animations` and `@angular/cdk` dependencies ([b0fa730a](https://github.com/oblique-bit/oblique/commit/b0fa730a3fed977c869627e29cbcb6ee75a0f34e))

# [13.3.0](https://github.com/oblique-bit/oblique/compare/13.2.3...13.3.0) (2025-06-12)

## Features

- **utils:** remove `@angular-eslint/schematics` dependency ([5bb72337](https://github.com/oblique-bit/oblique/commit/5bb723374155ef95c7424d4d07b6f2d5e1afbdf2))
- **utils:** print cli version before each ob command ([f4573baa](https://github.com/oblique-bit/oblique/commit/f4573baaa3353ad4be7e5cb692b65357c0b6f40f))

# [13.2.0](https://github.com/oblique-bit/oblique/compare/13.1.2...13.2.0) (2025-04-24)

## Features

- **utils:** add check of installed node version ([97b98569](https://github.com/oblique-bit/oblique/commit/97b985699113b3b5955b48e20a9b779d449cea24))

# [13.0.0](https://github.com/oblique-bit/oblique/compare/12.2.3...13.0.0) (2025-02-27)

## Bug Fixes

- **new:** use the correct version of dependencies ([2425328a](https://github.com/oblique-bit/oblique/commit/2425328a2f40d604b2f5edc2db0e1976cacb150a))
- **new:** fix failing linting & tests ([63b4d940](https://github.com/oblique-bit/oblique/commit/63b4d94004bf6dbcfc74e7731218a86353300150))
- **update:** make sure `@schematics/angular` is present and updated ([a2938608](https://github.com/oblique-bit/oblique/commit/a29386082eafe3c6eb89af4ca402493274a97529))

## Features

- **new:** add interactive mode ([e6232529](https://github.com/oblique-bit/oblique/commit/e62325296fb78814bfba25a86e9c5ae1eabf923d))
- **new:** call `npm dedupe` and `npm prune` after install ([8b373f12](https://github.com/oblique-bit/oblique/commit/8b373f12bb5a5d0c1d4852c7ccd378b0455f8515))
- **update:** call `npm dedupe` and `npm prune` after update ([3426e8d5](https://github.com/oblique-bit/oblique/commit/3426e8d53597627180f3e1e28f91b12b7bfc6214))
- **utils:** update the oblique version to 13 ([0aa7dc87](https://github.com/oblique-bit/oblique/commit/0aa7dc87dcc3f4fdadd4d06bea1dfdefd8144f68))

# [12.2.3](https://github.com/oblique-bit/oblique/compare/12.2.2...12.2.3) (2025-01-17)

## Bug Fixes

- **cli:** add `tslib` as a dependency to the released artifact ([612079c3](https://github.com/oblique-bit/oblique/commit/612079c318a8d3ce00372ef57271cf14c3048415))

# [12.2.2](https://github.com/oblique-bit/oblique/compare/12.2.1...12.2.2) (2025-01-10)

## Bug Fixes

- **new:** make sure there is no dependency on `tslib` ([3e83eaad](https://github.com/oblique-bit/oblique/commit/3e83eaad25229988edcff87a29001115b7095b57))

# [12.1.0](https://github.com/oblique-bit/oblique/compare/12.0.4...12.1.0) (2024-12-09)

## Features

- **new:** add `ob new` command ([b2ddd17b](https://github.com/oblique-bit/oblique/commit/b2ddd17bfa701c01058298e39b74862b4424d6e7))
- **update:** add `ob update` command ([e1ec0fdc](https://github.com/oblique-bit/oblique/commit/e1ec0fdc2b716c905e94e10eb1cf1b03c7350d6d))

# [12.0.0](https://github.com/oblique-bit/oblique/compare/11.3.4...12.0.0) (2024-10-08)

## Features

- **cli:** add library ([204b93f5](https://github.com/oblique-bit/oblique/commit/204b93f565b87f51444a850a8e8f92a5bf74e0e7))
