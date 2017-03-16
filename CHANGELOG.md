<a name="1.3.3"></a>
## [1.3.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.3) (2017-03.16)

### Bug Fixes

* **error-messages:** `ORErrorMessagesModule` is now exported

### Features

* **error-messages:** add option `showErrorMessages` on the `DatepickerPopupConfig`, if set to `true` the `date-picker` will show the `error-messages` by itself (default: true) 

Can be globally configured like this:

```
   angular.module('appModule').config((uibDatepickerPopupConfig:DatepickerPopupConfig) => {
        uibDatepickerPopupConfig.showErrorMessages = false;
    });
```

### BREAKING CHANGES

* **error-messages:**: `error-message` was renamed to `error-messages`

<a name="1.3.2"></a>
## [1.3.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.2) (2017-03.14)

#### Dependencies updates
* **ObliqueUI:** 1.3.2
* **AngularJS:** 1.6.2
* **angular-translate:** 2.15.1
* **angular-ui-bootstrap:** 2.5.0

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.1) for the full list of dependencies)

### Bug Fixes
* **datepicker:** `appendToBody` option does not change the style of the popup ([ea189b7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea189b7))
* **form-inline:** ensure custom components are displayed correctly under `.form-inline` ([e9662c4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e9662c4))
* **ObliqueHttpInterceptor:** do not stop `loadingService` for silent or back-end calls ([c906532](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/c906532))
* **publish:** execute ngAnnotate during `publish` build task ([8b78254](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8b78254))

### Features
* **error-messages:** implementation of an `error-message-component` for displaying validation errors ([d2796f0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d2796f0))
* **date-picker:**
	- the new `error-message-component` is now used to render `date-picker` validation messages ([f70a818](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f70a818))
	- add placeholder option, which accepts a text or a translation key ([a0d88da](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a0d88da)), [#OUI-395](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-395))
* **i18n:** locales are now added to the lib and use a `oblique` prefix ([cdb20da](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cdb20da)), [#OUI-389](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-389), [#OUI-394](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/issues/OUI-394)). See breaking changes below as well.
* **SchemaValidation:** use `schema-validator` to determine if an input is mandatory ([26f13ad](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/26f13ad))
* **unsaved-hanges:** unsaved changes within modals are now tracked as well ([7355e69](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/7355e69))
* **modules:** add modules for most components ([a9bd573](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a9bd573))
	- **ORDatepickerModule**
	- **ORErrorMessageModule**
	- **ORFormControlModule**
	- **ORInfrastructureModule**
	- **ORLoadingModule**
	- **ORMultiselectModule**
	- **ORNavigableModule**
	- **ORNavigatorModule**
	- **ORNotificationModule**
	- **ORSchemaValidationModule**
	- **ORTopControlModule**
	- **ORTypeaheadModule**
	- **ORUnsavedChangesModule**
	- **ORUtilModule**
	
### BREAKING CHANGES

* **i18n:** ObliqueReactive locales have a new prefix (`i18n.oblique`) and get published:
	- you have to remove the ObliqueReactive specific translation codes from your locales and merge them together with a gulp task. See merge-i18n task in ObliqueReactiveSeed
	- if you use texts that are now published with ObliqueReactive you have to change the prefix from `i18n` to `i18n.oblique` everywhere you use them
* `HttpInterceptor` has been renamed to `ObliqueHttpInterceptor` ([c727ac7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/c727ac7)). If you use `ObliqueHttpInterceptor`, you will have to update the interceptor config in your `app.module` from `$httpProvider.interceptors.push('ObliqueHttpInterceptor');` to `$httpProvider.interceptors.push('HttpInterceptor');`.

<a name="1.3.1"></a>
### [1.3.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.1) (2017-01-24)

#### Dependencies updates
* **ObliqueUI:** 1.3.1
* **AngularJS:** 1.6.1
* **angular-ui-bootstrap:** 2.4.0
* **angular-ui-router:** 0.4.2

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.1) for the full list of dependencies)

<a name="1.3.0"></a>
### [1.3.0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=1.3.0) (2016-12-12)

#### Dependencies updates
* **ObliqueUI:** 1.3.0
* **AngularJS:** 1.6.0
* **angular-translate:** 2.13.1
* **angular-ui-bootstrap:** 2.3.1
* **angular-ui-router:** 0.3.2
* **lodash:** 4.17.2
* **moment:** 2.17.1

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse/package.json?at=1.3.0) for the full list of dependencies)

#### Features
* **form-control:** rewrite `has-error` directive in order to provide better handling on form controls (validation and mandatory states), see breaking changes as well ([9aac98d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9aac98d))
* **unsaved-changes:** integrate `UnsavedChangesDirective` and provide an usage sample ([1b91cf4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/1b91cf4))
* **top-control:** add a wrapper for the ObliqueUI [TopControl](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-feedback-top-control) component ([d423315](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d423315))
* **webpack:** bundle UI with Webpack and separate `showcase` and `src` builds ([526e803](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/526e803))
* **typescript:** rewrite ObliqueReactive into TypeScript ([3db0ca7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/3db0ca7), [1e702e4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/1e702e4), [9503d46](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9503d46))
* **sourcemaps:** sourcemap integration in dev and publish build ([9e2504c](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9e2504c))
* **css:** ObliqueReactive Less resources are now bundled ([dc84849](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/dc84849))

#### Bug Fixes
* **notifications:**
	- ensure notification message key is correctly retrieved for translation ([e028fd4](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e028fd4))
	- removed CSS class `.lead` to match ObliqueUI [notifications](https://eui.bit.admin.ch/oblique-ui/1.3.0-RC.8/components.html#components-dialogs-notifications) specs ([a01b0ef](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a01b0ef))
* **spinner:**
	- callable from other controllers than `app-controller` ([b9d527d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/b9d527d))
	- overlay uses the fixed variant ([e343224](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e343224))
* **datepicker:** fix min/max date validation ([9cea457](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9cea457))
* **multiselect:** add support for schema validation ([506d8ec](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/506d8ec))
* **navigable:** ensure `navigable-activate` and `navigable-highlight` are properly evaluated ([ba992b7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ba992b7))
* **navigator:** ensure UP & BACK navigation is performed as expected ([53113d5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/53113d5))
* **validation:**
	- datepicker + schema-validate ([5e40bca](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/5e40bca), [487126d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/487126d))
	- ensure `date-picker`, `schema-validation` and `has-error` directives work nicely together, add support for JSON schema v3 & update live examples ([d4ae8dc](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d4ae8dc))

#### Code Refactoring
* **validation:** normalize namings of validation components (directives & events), see breaking changes as well ([817a9a0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/817a9a0))

#### BREAKING CHANGES
* **navigator:** `navigator` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;navigator&gt;&lt;/navigator&gt;`) ([927d7e3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/927d7e3))
* **notifications:** `notifications` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;notifications&gt;&lt;/notifications&gt;`) ([ea2044d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/ea2044d))
* **multiselect:** `multiselect` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;multiselect&gt;&lt;/multiselect&gt;`) ([3ea1b53](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/3ea1b53))
* **date-picker:** `date-picker` implementation is now based on AngularJS component design and needs to be referenced using the element tag (i.e. `&lt;date-picker&gt;&lt;/date-picker&gt;`) ([d6e22eb](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d6e22eb))
* **header-navigation:** partial needs to be updated to support ObliqueUI 1.3.0 (see [primary navigation](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-navs-navbars-primary))
* **footer:** partial needs to be updated to support ObliqueUI 1.3.0 (see [footer](https://eui.bit.admin.ch/oblique-ui/1.3.0/components.html#components-branding-footer))
* **validation**:
	- `validation-schema` directive has been renamed into `schema-validation`
	- `validationSchemaEvent` event has been renamed into `schemaValidationEvent`
	- `validationBusinessEvent` event has been renamed into `businessValidationEvent`
* **has-error**: `has-error` directive is removed in favor of `form-control` component ([9aac98d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/9aac98d))
	- `has-error="controlName"` becomes `&lt;form-control name="controlName" /&gt;`
	- `has-error-pristine` becomes `&lt;form-control pristine-validation /&gt;`

<a name="v1.2.7"></a>
### [v1.2.7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v1.2.7) (2016-05-31)

#### Features
* **navigable:**
	- enable item activation on load ([93f46f0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/93f46f0))
	- enable item highlighting on load ([e57a76a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e57a76a))
* **npm:** remove Bower and use only npm to fetch all dependencies ([094709a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/094709a), [2e01c74](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/2e01c74), [e8f9e2f](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e8f9e2f), [929bf49](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/929bf49))

#### Bug Fixes
* **navigable:** ensure `navigable` item gets activated when a child element gets focused ([972e7ad](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/972e7ad), [df64911](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/df64911))
* **ngAnimate:** ensure `ngRepeat` does not show stale items due to ngAnimate transitions ([51cbfdc](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/51cbfdc))
* **typeahead:** provide a workaround for scrollable AngularUI Typeahead suggestions and create a sample state to showcase it. ([cca3282](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cca3282))

<a name="v1.2.2"></a>
### [v1.2.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v1.2.2) (2015-09-11)

#### Features
* **delayed-change:** Added delayed-change directive for firing delayed callback when inputs value changes ([f84d177](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/f84d177))
* **locale:** enable i18n localization for 3rd-party directives (including AngularUI datepicker) ([d9e93fc](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/d9e93fc))
* **navigator:** implement a state navigator service & directive and provide sample usage ([e3ef760](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e3ef760))
* **auth:**
	- bind user roles with UI elements ([90cc7b3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/90cc7b3))
	- finalize client-side authentication and refactor accordingly ([e75752a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/e75752a))
	- prepare application for client-side authentication ([43addf0](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/43addf0))

#### Bug Fixes
* **locale:** do not determine preferred language as locale keys are inconsistent across browsers ([8e55f4b](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/8e55f4b))
* **notifications:** notification can now be dismissed with the close button ([a24bf28](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/a24bf28))
* **schema-validation:** fix nested properties validation and showcase with a sample usage ([6ff2932](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/6ff2932))

<a name="v0.0.3"></a>
### [v0.0.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v0.0.3) (2015-03-18)

#### Bug Fixes
* **notifications:** ensure notifications are correctly displayed for API exceptions ([527807e](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/527807e))

#### BREAKING CHANGES
* notifications: API-specific methods are now scoped under `$http.api` (i.e. `$http.api.get()`, `$http.api.post()`, etc.)

<a name="v0.0.2"></a>
### [v0.0.2](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/browse?at=v0.0.2) (2015-03-11)

#### Features
* **AppController:** enable global control for core UI components (layout, page title & spinner) ([58a25c8](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/58a25c8))
* **head-title:** implement composable block for the head `title` element and use `ng-bind` to avoid curlies (`{{}}`) FoC ([17e6404](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/17e6404))

#### Bug Fixes
* **navbar-global:** use `ui-sref` and `ui-sref-active` directives instead of custom state handling ([cdd754d](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique-reactive/commits/cdd754d))
