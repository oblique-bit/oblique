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
