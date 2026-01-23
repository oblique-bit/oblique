# [15.0.0-rc.1](https://github.com/oblique-bit/oblique/compare/14.2.1...15.0.0-rc.1) (2026-01-23)

## Features

- **service-navigation:** remove deprecated `maxLastUsedApplications` property ([9470fcd5](https://github.com/oblique-bit/oblique/commit/9470fcd583d0898e76dc908d0fbc4cc0a1769937))
- **service-navigation:** remove my-business-partnerships link in profile widget ([60eb5332](https://github.com/oblique-bit/oblique/commit/60eb53328ce1e36957f109768817035eeb634512))
- **service-navigation:** return `undefined` in case of error while getting the login state ([3e12e2ac](https://github.com/oblique-bit/oblique/commit/3e12e2ac143239034c63d732c40bbd73d974a0eb))
- **web-component:** remove deprecated `maxLastUsedApplications` ([aac03272](https://github.com/oblique-bit/oblique/commit/aac032724c863111d691e7027a2c56812e1782b2))

## BREAKING CHANGES

- **service-navigation:** `maxLastUsedApplications` input has been removed without replacement
- **service-navigation:** `loginState` now emits `undefined` if the config is unreachable. Before nothing was emitted.
- **web-component:** `maxLastUsedApplications` input has been removed without replacement

# [14.2.0](https://github.com/oblique-bit/oblique/compare/14.1.3...14.2.0) (2026-01-08)

## Features

- **service-navigation:** use language code in state endpoint ([ebbcac0a](https://github.com/oblique-bit/oblique/commit/ebbcac0ad3768061edcc6ca256c7de8534880efa))
- **service-navigation:** add language synchronization with PAMS ([91665799](https://github.com/oblique-bit/oblique/commit/91665799e5f5ab7157a71d14e90aada1f17dcf26))
- **web-component:** bind eportalLanguageSynchronization input with Oblique ([4eb77381](https://github.com/oblique-bit/oblique/commit/4eb773811e47be1bdbf42a648750f50db3f11119))

# [14.1.1](https://github.com/oblique-bit/oblique/compare/14.1.0...14.1.1) (2025-11-06)

## Bug Fixes

- **service-navigation:** fix message last used / favorite applications are empty TPEFD-9925 ([4761e140](https://github.com/oblique-bit/oblique/commit/4761e14002d021f278bd82b81ae57f618902b4a7))

# [14.1.0](https://github.com/oblique-bit/oblique/compare/14.0.2...14.1.0) (2025-11-03)

## Bug Fixes

- **service-navigation:** the use `pollingInterval` from the backend ([d571b871](https://github.com/oblique-bit/oblique/commit/d571b871c783099fd944ce6040c50161d388aaf5))
- **service-navigation:** timeout service do not regularly trigger change detection anymore ([7a123947](https://github.com/oblique-bit/oblique/commit/7a12394770dfb4b0c4c770507300da042ab9cbc4))

## Features

- **service-navigation:** add message when favorites applications are empty ([5d501f1f](https://github.com/oblique-bit/oblique/commit/5d501f1f04b77a96db1c4c661edd66a5766e474e))
- **service-navigation:** add message when last used applications are empty ([d36f0efa](https://github.com/oblique-bit/oblique/commit/d36f0efac2411ea7255d8d130f317439dadd198e))
- **service-navigation:** show a meaningful notification when the `state` api call fails ([f449d466](https://github.com/oblique-bit/oblique/commit/f449d466b1c726e325e575228b626f1c01a781f8))
- **service-navigation:** disable the login button when the config api call fails ([74d052ac](https://github.com/oblique-bit/oblique/commit/74d052ac6de3da00b2658553b6e037fb0e07e5fb))
- **service-navigation:** show a meaningful notification when the `config` api call fails ([9a841099](https://github.com/oblique-bit/oblique/commit/9a8410990359f0645b2ad2f713f0172d5d5645ca))

# [14.0.1](https://github.com/oblique-bit/oblique/compare/14.0.0...14.0.1) (2025-10-23)

## Features

- **web-component:** display meaningful errors for invalid attributes ([02d02502](https://github.com/oblique-bit/oblique/commit/02d02502d0389e208fb2f70103198076a5c2ba86))

# [14.0.0](https://github.com/oblique-bit/oblique/compare/13.3.3...14.0.0) (2025-09-22)

## Bug Fixes

- **service-navigation:** fix wrap issue with applications popover ([742fc861](https://github.com/oblique-bit/oblique/commit/742fc8612e3549c32a7c7f7b9bcbfe52a7bae3b4))

## Features

- **sample:** add extra text for contacts ([bb3e7489](https://github.com/oblique-bit/oblique/commit/bb3e748917c8f7211eee26188ef3f0a368be97e7))
- **service-navigation:** add extra text for contacts ([711047f6](https://github.com/oblique-bit/oblique/commit/711047f6b41fd465ff8fecb6416282af1e9711ba))
- **service-navigation:** change order of info popover ([686054a8](https://github.com/oblique-bit/oblique/commit/686054a81c4da1e24d507d383486e9a54be12fa8))
- **service-navigation:** increase icon size and realign them ([46399f23](https://github.com/oblique-bit/oblique/commit/46399f232104305c0ed08fa426cd9c73db91b631))
- **service-navigation:** rename property `tel` to `phone` on `ObIServiceNavigationContact` ([f3790c7f](https://github.com/oblique-bit/oblique/commit/f3790c7f3ae19a247cda55678bc09a7ce93c54a7))
- **service-navigation:** remove avatar images ([ce068685](https://github.com/oblique-bit/oblique/commit/ce068685adcbd4b78ceaadcfba085ca9309a93b8))
- **web-component:** add extra text for contacts ([54eeda6c](https://github.com/oblique-bit/oblique/commit/54eeda6c524da07ef85234436711d191d664a9e4))

## BREAKING CHANGES

- **service-navigation:** `ObIServiceNavigationContact.tel` has been renamed to `ObIServiceNavigationContact.phone`

# [13.3.3](https://github.com/oblique-bit/oblique/compare/13.3.2...13.3.3) (2025-08-25)

## Bug Fixes

- **service-navigation:** sanitize url redirection ([ed86dfbc](https://github.com/oblique-bit/oblique/commit/ed86dfbc132b180ef9d8b5e612c3462254756ea5))

# [13.3.2](https://github.com/oblique-bit/oblique/compare/sds-13.3.1_release-patch_13.3.2__plbk6_2025-07-21T073817...13.3.2) (2025-07-22)

## Bug Fixes

- **service-navigation:** correct french last-used translation ([7dac1350](https://github.com/oblique-bit/oblique/commit/7dac13501798cbbcbd0ae1c5803a37e8ee58796f))

## Features

- **service-navigation:** add `cdkTrapFocus` on applications popover ([6ed499d3](https://github.com/oblique-bit/oblique/commit/6ed499d3f3e9699661295075ae02e9575e1440e8))
- **service-navigation:** change application disabled look ([62d07609](https://github.com/oblique-bit/oblique/commit/62d076097bc114ac47644d25d73b9024624426ba))
- **service-navigation:** change default value `maxFavoriteApplications` to 8 ([97bf7e4c](https://github.com/oblique-bit/oblique/commit/97bf7e4c896c43cf326386d8440f11d4e6480b3a))
- **service-navigation:** deprecate input `maxLastUsedApplications` ([ce205abf](https://github.com/oblique-bit/oblique/commit/ce205abf7fdbd2b2b35cb5ac60bf536224530438))
- **service-navigation:** update UI to allow 4 applications on the same row ([6370b2c3](https://github.com/oblique-bit/oblique/commit/6370b2c3f2c788a6e656fa5b8671cfb8ac81376b))
- **service-navigation:** use 1 "all services" button per application section ([226db628](https://github.com/oblique-bit/oblique/commit/226db628ce74e8eeaec95b12cd345bb345f2897e))
- **service-navigation:** add `MatTooltip` on applications icon ([5b9b46d1](https://github.com/oblique-bit/oblique/commit/5b9b46d1283019fc6c2a26281e1aefa771014408))
- **service-navigation:** add `service-navigation-appliations-name-status` pipe ([00c5aacc](https://github.com/oblique-bit/oblique/commit/00c5aacc780e88503272bdf6987ff62b58469dde))
- **web-component:** change default value `maxFavoriteApplications` to 8 ([57e49626](https://github.com/oblique-bit/oblique/commit/57e496262d0a6b10637d8a9339fbdcd4cd6e92a6))
- **web-component:** deprecate `maxLastUsedApplications` ([79eae1ea](https://github.com/oblique-bit/oblique/commit/79eae1eaf7af49c9ac789fa077f452c461c10599))

# [13.3.1](https://github.com/oblique-bit/oblique/compare/13.3.0...13.3.1) (2025-07-10)

## Bug Fixes

- **service-navigation:** add `lang` attribute to language options ([56a3aed3](https://github.com/oblique-bit/oblique/commit/56a3aed3a2b4464b187b5541b016215082c1c489))

# [13.3.0](https://github.com/oblique-bit/oblique/compare/13.2.3...13.3.0) (2025-06-12)

## Features

- **service-navigation:** add AX title in services panel ([b5c7be98](https://github.com/oblique-bit/oblique/commit/b5c7be98edbaec46da7238d1361a29bc7d1cb0fc))
- **service-navigation:** add AX title in profile panel ([3ee0b12d](https://github.com/oblique-bit/oblique/commit/3ee0b12d688254c2a7c7700275b14507002eaa69))
- **service-navigation:** add focus trap in profile popover ([f1cb6062](https://github.com/oblique-bit/oblique/commit/f1cb60625d68e7783f0bca53a9421da95b38bf10))
- **service-navigation:** add redeem page in profile popover ([b0ab3520](https://github.com/oblique-bit/oblique/commit/b0ab3520eaab5597127688bc1ed3aa9b3519c5f8))
- **service-navigation:** add active style to links in a popover ([3acd847b](https://github.com/oblique-bit/oblique/commit/3acd847bac28dce0cc89cd8af4bb0a7d5dfd6515))
- **service-navigation:** add h4 for popover-section ([27d91365](https://github.com/oblique-bit/oblique/commit/27d91365b97047d5f4cc99008f0453571d097a69))
- **service-navigation:** add contact form possibility in info panel ([7ff34c2c](https://github.com/oblique-bit/oblique/commit/7ff34c2cae3f3cca48337361d92417bc1b6a4273))
- **service-navigation:** add contact text in info panel ([ed34a24e](https://github.com/oblique-bit/oblique/commit/ed34a24eadaad3d2c9259a09f88500abd79c9397))
- **service-navigation:** add help text in info panel ([5d9ad563](https://github.com/oblique-bit/oblique/commit/5d9ad563d975e51a7b0e7f377f16a1931d632414))
- **service-navigation:** add description in info panel ([0c6b044f](https://github.com/oblique-bit/oblique/commit/0c6b044fb430d61983f6b8a6c24232a2b7e0a890))
- **service-navigation:** add AX title in info panel ([ab26bad7](https://github.com/oblique-bit/oblique/commit/ab26bad79ddf065cb6ef5707009f6314324cfb4f))
- **service-navigation:** add focus trap in info panel ([b63280ef](https://github.com/oblique-bit/oblique/commit/b63280ef2358f1b76cacc244e8780b9a52a256b0))
- **web-component:** add inputs in info panel ([1636fcb5](https://github.com/oblique-bit/oblique/commit/1636fcb51e6a29abbe4a17b9b6622866503254e8))

# [13.2.0](https://github.com/oblique-bit/oblique/compare/13.1.2...13.2.0) (2025-04-24)

## Features

- **service-navigation:** unify tooltips and translations ([60be9c69](https://github.com/oblique-bit/oblique/commit/60be9c698db7d2e0ae4ffe6502042fc8a2eef0b7))
- **service-navigation:** move alignement to the right in mobile view ([a8e9b853](https://github.com/oblique-bit/oblique/commit/a8e9b853a1e463fe8d056b2db4bf5b47e42213e8))
- **web-component:** add `accessibilityText` input for custom-buttons ([81a0139a](https://github.com/oblique-bit/oblique/commit/81a0139a64840957a63fba21dcc8ae0c974feee4))
- **web-component:** add `tooltip` input for custom-buttons ([6fcddad4](https://github.com/oblique-bit/oblique/commit/6fcddad4b7bbfca3a46faeba3fef5e6140fd05ff))

# [13.1.1](https://github.com/oblique-bit/oblique/compare/13.1.0...13.1.1) (2025-04-07)

## Bug Fixes

- **service-navigation:** add missing part in French translation key ([fae8434c](https://github.com/oblique-bit/oblique/commit/fae8434c34a0387d4e8085643248b6a4152d0814))

# [13.1.0](https://github.com/oblique-bit/oblique/compare/13.0.3...13.1.0) (2025-03-27)

## Bug Fixes

- **service-navigation:** fix race condition ([9e5597b7](https://github.com/oblique-bit/oblique/commit/9e5597b79ee5d15fb79a773f041e84a94489ab5e))

## Features

- **service-navigation:** rename my-push-notifications to my-email-sms-notifications ([568aa531](https://github.com/oblique-bit/oblique/commit/568aa53100147b04abccd6ea879b2c5122c00c92))

# [13.0.0-rc.5](https://github.com/oblique-bit/oblique/compare/13.0.0-rc.1...13.0.0-rc.5) (2025-02-18)

## Bug Fixes

- **toolchain:** fix publish script

# [13.0.0-rc.2](https://github.com/oblique-bit/oblique/compare/13.0.0-rc.1...13.0.0-rc.2) (2025-02-14)

## Bug Fixes

- **service-navigation:** correct typo in i18n key ([449a3a0b](https://github.com/oblique-bit/oblique/commit/449a3a0bf85ec679fe0e9072797ef1d5cdebbf6a))
- **service-navigation:** add missing i18n key for accessibility text on phone link ([fff30121](https://github.com/oblique-bit/oblique/commit/fff301210864e5f44efa95057ff8d8c662f0cc5d))

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
