### ObliqueReactive

<a name="2.0.0-RC.3"></a>
#### [2.0.0-RC.3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.3) (2018-01-09)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.3
* **Bootstrap:** 4.0.0-beta.3
* **Angular:** 5.1.3
* **ng-bootstrap:** 1.0.0-beta.9
* **ngx-translate:** 9.0.2
* **rxjs:** 5.5.6
* **ajv:** 6.0.0

##### Features
* **notification:** can pass parameters to title and message translations ([d781e19](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d781e19))
* **unsubscribe:** add `Unsubscribable` class to unsubscribe form `Observable` ([d20d4bd](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d20d4bd))

##### Bug Fixes
* **schema-validation:** `SchemaValidationModule` now provides `schemaValidationService` ([acbc7f9](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/acbc7f9))
* **AoT:** avoid lambda function on providers ([8a90825](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8a90825))
* **navigator:** fix routing to module ([74e2778](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/74e2778))
* **notification:** add `alert-default` class to default alerts ([dac70b1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dac70b1))
* **observable:** unsubscribe from all observables ([95b4b7a](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/95b4b7a))


<a name="2.0.0-RC.2-1"></a>
#### [2.0.0-RC.2-1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.2-1) (2017-11-01)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.2-1
* **Bootstrap:** 4.0.0-beta.2
* **Angular:** 4.4.6
* **rxjs:** 5.5.1
* **ajv:** 5.3.0

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2-1) for the full list of dependencies)

##### Bug Fixes
* **formControlState:**
	- `name` attribute is not mandatory. Either `ngModel`, `ngModelChange` or `formControlName` is ([7abce66](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/7abce66))
	- for reactive forms, allow `pristineValidation` and set `control-mandatory` on page initialisation ([19d5f5c](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/19d5f5c))
	- remove `has-error` class on form reset ([d1c605f](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d1c605f))
* **schemaValidation:**
	- never pass null to ajv ([afc7468](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/afc7468), [4353179](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4353179))
	- prevent multiple compile with same schema ([84c9dac](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/84c9dac))

##### Code Refactoring
* **navigator:** rename `orNavigator` into `or-navigator` ([0cb9f47](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/0cb9f47))
* **scss:** remove module SCSS resources and cleanup showcase ones ([d2f3383](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d2f3383))

##### Features
* **column-layout:** dispose content within collapsible/expansible columns using `ColumnLayoutComponent` (or `ColumnPanelDirective` & `ColumnPanelDirective`) ([4348d51](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/4348d51))
* **filterBox:** add `size`, `disabled` and `readonly` attributes ([847d3a7](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/847d3a7))
* **formControlState:** add reactive form sample ([226d0d5](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/226d0d5))
* **schemaValidation:**
	- add `getValidator` function for reactive forms ([d3ff5f3](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/d3ff5f3))
	- add reactive form to the showcase ([1e4afde](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/1e4afde))
	- move Draft06 transformation into a decorator ([75a8b8b](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/75a8b8b))
* **toggle:** add `ToggleDirective` for icon toggle ([dc6f8e8](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/dc6f8e8))
* **toolchain:** add npm script & Gulp task for npm linking and watching distribution files ([8ed5c89](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/8ed5c89))
* **unsavedChangesService:** expose `discardChanges` function ([3e84226](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/commits/3e84226))

##### BREAKING CHANGES
* **navigator:** rename `orNavigator` into `or-navigator`
* **scss:** remove any import of ObliqueReactive CSS styles (mainly in your Angular CLI configuration) as they are now bundled with components.

<a name="oblique-reactive-2.0.0-RC.2"></a>
#### [2.0.0-RC.2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.2) (2017-08-04)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.2
* **jQuery:** 3.2.1
* **Bootstrap:** 4.0.0-beta
* **Angular:** 4.4.3
* **ng-bootstrap:** 1.0.0-beta.5
* **ngx-translate:** 8.0.0
* **rxjs:** 5.4.3

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2) for the full list of dependencies)

##### Features
* **toolchain**
	- Enable NodeJS 8+ & npm 5+ support.
* **master-layout**
	- `MasterLayoutHeaderDirective` & `MasterLayoutHeaderService` added for controlling the application header.
	- `MasterLayoutNavigation`, `MasterLayoutNavigationItem`, `MasterLayoutNavigationToggle` & `MasterLayoutNavigation` added for controlling the application navigation.
	- `ScrollDetectionDirective` & `ScrollingConfig` added for controlling the application scroll.
* **notification**
	- Notifications now use Angular animations for transitions (_enter_ & _leave_).
	- Notifications can now be configured using `NotificationConfig` for default notification parameters (`channel`, `sticky`, `timeout`).
* **document-meta**
	- Title `suffix` is now translated as well.
	- Page `title`, `suffix` and `description` are now translated on locale change.
* **filter-box**
	- `FilterBoxComponent` added to building search pattern-like components.
* **form-control**
	- `control-mandatory` CSS class is added if `required` attribute is set on form control.
* **schema-validation**
	- `SchemaValidationDirective` now accepts JSON schema draft 06 and partially drafts 04 and 03 as well.
* **multiselect:**
	- dropped the input `[settings]`, every property of `MultiselectConfig` is now an input of `MuliselectComponent`. This ensures, that we can change the settings at runtime

##### BREAKING CHANGES
* **Webpack**:
	- ObliqueUI CSS & images folders are now located directly on the root of the dependency module instead of the `dist/` folder. These references should be adapted on your [Angular CLI](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/.angular-cli.json?at=2.0.0-RC.2) configuration.
	- ObliqueUI JavaScript resources are no more required to run ObliqueReactive-based applications. These references should be removed from the [Angular CLI](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/.angular-cli.json?at=2.0.0-RC.2) configuration.
* **master-layout**:
	* ObliqueUI master layout has been completely refactored. Refer to ObliqueUI changelog for potential breaking changes.
	* `LayoutManagerService` has been renamed to `MasterLayoutApplicationService`
* **animations:**
	* You need to include an animation strategy module in your app as some ObliqueReactive components are using Angular animations. Simply import `BrowserAnimationsModule` (or alternatively `NoopAnimationsModule` if you prefer to disable animations) in your `app-module.ts`.
* **multiselect:**
	- If you used `[settings]` of `MultiselectComponent` you now have to bind every config value separately.

<a name="oblique-reactive-2.0.0-RC.1"></a>
#### [2.0.0-RC.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.1) (2017-06-23)

##### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.1
* **jQuery:** 3.2.1
* **Bootstrap:** 4.0.0-alpha.6
* **Angular:** 4.2.4
* **ng-bootstrap:** 1.0.0-alpha.26
* **ngx-translate:** 7.0.0
* **rxjs:** 5.4.1

##### BREAKING CHANGES
ObliqueReactive has been migrated to Angular 4. This of course breaks all compatibility to any previous release of ObliqueReactive. 

