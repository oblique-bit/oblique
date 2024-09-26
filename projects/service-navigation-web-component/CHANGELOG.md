# [12.0.0-rc.1](https://github.com/oblique-bit/oblique/compare/11.3.3...12.0.0-rc.1) (2024-09-26)

## Bug Fixes

- **service-navigation:** adjust styling of application popover content ([54d3f1d0](https://github.com/oblique-bit/oblique/commit/54d3f1d00bc93375c74659cbf8574cb2496ff15d))

## Features

- **sample:** add language input property ([d4ceed3b](https://github.com/oblique-bit/oblique/commit/d4ceed3bab1d49b50d0e38e7b60a31a84dc31464))
- **service-navigation:** don't show the authentication widget until `loginState` is known ([8c92513a](https://github.com/oblique-bit/oblique/commit/8c92513ac2e969261dc11cfd4173f417df42a01a))
- **service-navigation:** `loginState` only emits once the server responded ([be6af27f](https://github.com/oblique-bit/oblique/commit/be6af27fc201b8e34b512562a8f364c94995b21a))
- **service-navigation:** throw error in case of missing `pamsAppId` ([5fde17ff](https://github.com/oblique-bit/oblique/commit/5fde17ffc6ee0c782d8660de3756ed1eec2b284c))
- **web-component:** add language input property ([71169cd2](https://github.com/oblique-bit/oblique/commit/71169cd2b181329a476211a22322ecfb87a178c4))

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
