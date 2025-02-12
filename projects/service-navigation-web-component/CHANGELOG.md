# [13.0.0-rc.1](https://github.com/oblique-bit/oblique/compare/12.2.3...13.0.0-rc.1) (2025-02-12)

## Features

- **service-navigation:** adapt profile avatar height ([03cad93b](https://github.com/oblique-bit/oblique/commit/03cad93b331730a314c1f61bc386065f640365e4))
- **service-navigation:** enable all widgets per default ([46eb93b5](https://github.com/oblique-bit/oblique/commit/46eb93b58926a773325a6233d6fa9f9b665ca051))
- **web-component:** replace Frutiger font with Noto Sans ([4418f49d](https://github.com/oblique-bit/oblique/commit/4418f49d688e54e42f0f61503095bc18f6094cd3))

## BREAKING CHANGES

- **service-navigation:** All widgets are now enabled per default. Before, they were disabled.

# [12.2.3](https://github.com/oblique-bit/oblique/compare/12.2.2...12.2.3) (2025-01-17)

## Bug Fixes

- **service-navigation:** remove `bypassSecurityTrustResourceUrl` ([e51d5f4c](https://github.com/oblique-bit/oblique/commit/e51d5f4c2ca96cc6458797eb86230be262ca72e6))

# [12.2.0](https://github.com/oblique-bit/oblique/compare/12.1.0...12.2.0) (2024-12-16)

## Features

- **service-navigation:** remove profile links when in guest mode ([0ef1c72f](https://github.com/oblique-bit/oblique/commit/0ef1c72fa001b880b151f60ebb494a79a3a07dcb))
- **service-navigation:** add id's to the profile links and my-notification button ([ccc05102](https://github.com/oblique-bit/oblique/commit/ccc05102206bcb33e6e99c7ae06775a11a9eb0be))
- **service-navigation:** change settings link to 4 profile links ([3056decb](https://github.com/oblique-bit/oblique/commit/3056decb54e99b8e36a24dfd9ade2cf52c6ef5ca))

# [12.1.0](https://github.com/oblique-bit/oblique/compare/12.0.4...12.1.0) (2024-12-09)

## Bug Fixes

- **service-navigation:** make language dropdown keyboard accessible ([df2f38ef](https://github.com/oblique-bit/oblique/commit/df2f38efbf0d75396758cecd999ab919ae8b3cab))
- **web-component:** show focus on language dropdown ([8f8580cd](https://github.com/oblique-bit/oblique/commit/8f8580cdb0afd7f5f356a8468a9c027cb05a06b6))

# [12.0.4](https://github.com/oblique-bit/oblique/compare/12.0.3...12.0.4) (2024-11-29)

## Bug Fixes

- **service-navigation:** change `flex` to `inline-flex` for authentication widget ([e7c5e361](https://github.com/oblique-bit/oblique/commit/e7c5e361b077a756d17145459838e213d1ac5685))
- **web-component:** add missing styles ([f88ddec9](https://github.com/oblique-bit/oblique/commit/f88ddec90198727b6dfefe7b1cb079a93d7ca3d1))
- **web-component:** add missing default values ([90d9209e](https://github.com/oblique-bit/oblique/commit/90d9209ee6de9b0aa1dc444eb17ec512572d7138))

# [12.0.2](https://github.com/oblique-bit/oblique/compare/12.0.1...12.0.2) (2024-11-15)

## Bug Fixes

- **service-navigation:** increase the padding around the profile & authentication widgets ([1853ee4e](https://github.com/oblique-bit/oblique/commit/1853ee4e279688567e1936f60f261af2a7665abc))
- **web-component:** only import needed styles ([81a38d1a](https://github.com/oblique-bit/oblique/commit/81a38d1a9291eab822e7a13a31d88ef16003b731))

# [12.0.1](https://github.com/oblique-bit/oblique/compare/12.0.0...12.0.1) (2024-11-01)

## Bug Fixes

- **service-navigation:** make sure the language selection's height is consistent ([506c5f1a](https://github.com/oblique-bit/oblique/commit/506c5f1a7a4c7743867e9d3dcd22cb0c77f2ee5d))

# [12.0.0](https://github.com/oblique-bit/oblique/compare/11.3.4...12.0.0) (2024-10-08)

## Bug Fixes

- **service-navigation:** adjust styling of application popover content ([da51c286](https://github.com/oblique-bit/oblique/commit/da51c28613575d613abd3dc83519392d3e6aab22))

## Features

- **sample:** add language input property ([89685610](https://github.com/oblique-bit/oblique/commit/89685610d338caf5ff7b42313d2059617bd5387e))
- **service-navigation:** don't show the authentication widget until `loginState` is known ([7e3f9ce6](https://github.com/oblique-bit/oblique/commit/7e3f9ce606e511e0a101f7c6f7a9362e9f54fdaa))
- **service-navigation:** `loginState` only emits once the server responded ([0a194f36](https://github.com/oblique-bit/oblique/commit/0a194f36694d0f6ac744676bb2f9370842193ac0))
- **service-navigation:** throw error in case of missing `pamsAppId` ([848f71a6](https://github.com/oblique-bit/oblique/commit/848f71a6eb4cf2d961aaaf110167e9b97f8d8d2f))
- **web-component:** add language input property ([cff248dc](https://github.com/oblique-bit/oblique/commit/cff248dc11e5019ba188ca0a42178ba4540e53da))

## BREAKING CHANGES

- **service-navigation:** `loginState` doesn't emit `SA` on startup anymore. Instead, it only emits once it's value is known
- **service-navigation:** The application now throws an error if no `pamsAppId` is provided

# [11.3.2](https://github.com/oblique-bit/oblique/compare/11.3.1...11.3.2) (2024-07-19)

## Bug Fixes

- **service-navigation:** increase icon size ([83f5b171](https://github.com/oblique-bit/oblique/commit/83f5b171b3dfecda14873a090bbe5e1b718444ff))
- **service-navigation:** ensure the status icon are tied to their applications ([a9f8b640](https://github.com/oblique-bit/oblique/commit/a9f8b64071f578adab52c2c0b75ad3d430c755e1))

# [11.3.1](https://github.com/oblique-bit/oblique/compare/11.3.0...11.3.1) (2024-07-12)

## Bug Fixes

- **web-component:** ensure the service-navigation component is embedded in PROD ([4155b147](https://github.com/oblique-bit/oblique/commit/4155b147e2d19f71e197c08249de58f1559d0d39))

# [11.2.0](https://github.com/oblique-bit/oblique/compare/11.1.3...11.2.0) (2024-05-31)

## Bug Fixes

- **toolchain:** list `@angular/elements` as a `devDependency` ([0d827aee](https://github.com/oblique-bit/oblique/commit/0d827aeeea8b8418acafec141f9b3b98871b871a))

## Features

- **toolchain:** remove `@angular/elements` from the distributed `package.json` ([d6ca432f](https://github.com/oblique-bit/oblique/commit/d6ca432f1453ef0d520cda6903fd0c3feac55ad3))

# [11.0.0](https://github.com/oblique-bit/oblique/compare/10.3.1...11.0.0) (2024-02-22)

## Features

- **web-component:** add `handleLogout` and `logoutTriggered` ([525bd8a6](https://github.com/oblique-bit/oblique/commit/525bd8a6fe9f4257aa88ad4a29387c855525d788))
- **web-component:** add `pamsAppId` ([ba5f4d74](https://github.com/oblique-bit/oblique/commit/ba5f4d7423855ff4f78fe2cf790ec12c3af72a8c))
- **web-component:** add basic content projection ([f1b796b9](https://github.com/oblique-bit/oblique/commit/f1b796b95338bbe3e515d39252f449c1edab9e14))
- **web-component:** add `loginState` event ([490185b1](https://github.com/oblique-bit/oblique/commit/490185b125a8120fa2a0a068fbc55d1530a616dc))
- **web-component:** add `languageChange` event ([4845e64d](https://github.com/oblique-bit/oblique/commit/4845e64d16220a770895f917e7a5c4bf716a6f7c))
- **web-component:** add `infoLinks` and `profileLinks` ([da6c39ab](https://github.com/oblique-bit/oblique/commit/da6c39ab9091587417e52d4d2cc47ffc1bc16bbc))
- **web-component:** add `infoContact` ([9797f1fe](https://github.com/oblique-bit/oblique/commit/9797f1feebdd560ca421f362af05ee0fe3328d6a))
- **web-component:** add display inputs ([54d355ad](https://github.com/oblique-bit/oblique/commit/54d355adc50e7b96dd0e48f1a7cade7780321e96))
- **web-component:** add languages management ([6c8dac85](https://github.com/oblique-bit/oblique/commit/6c8dac8510ea246114f1629763cc40f70fd13f0a))
- **web-component:** add environment and basic inputs ([0d89e2b7](https://github.com/oblique-bit/oblique/commit/0d89e2b7bfe425395e5e7026805e3033a3ba587c))
- **web-component:** provide the service navigation as a web-component ([ecebb231](https://github.com/oblique-bit/oblique/commit/ecebb231e1be084eaba484432af18f7da2f96d5c))
