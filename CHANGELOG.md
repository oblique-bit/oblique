<a name="2.0.0-RC.2"></a>
#### [2.0.0-RC.1 to 2.0.0-RC.2](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-ui/browse?at=2.0.0-RC.2) (2017-08-04)

#### Dependencies updates
* **ObliqueUI:** 2.0.0-RC.2
* **jQuery:** 3.2.1
* **Bootstrap:** 4.0.0-beta
* **Angular:** 4.4.3
* **ng-bootstrap:** 1.0.0-beta.5
* **ngx-translate:** 8.0.0
* **rxjs:** 5.4.3

(see [package.json](https://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse/package.json?at=2.0.0-RC.2) for the full list of dependencies)

#### Features
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

### BREAKING CHANGES
* **Webpack**:
	- ObliqueUI JavaScript resources are no more required to run Angular-based application. These references should be removed from the [Angular CLI](./.angular-cli.json) configuration.
* **master-layout**:
	* ObliqueUI master layout has been completely refactored. Refer to ObliqueUI changelog for potential breaking changes.
	* `LayoutManagerService` has been renamed to `MasterLayoutApplicationService`
* **multiselect:**
	- If you used `[settings]` of `MultiselectComponent` you now have to bind every config value separately.


<a name="2.0.0-RC.1"></a>
## [2.0.0-RC.1](http://stash.eap.bit.admin.ch/projects/OUI/repos/oblique2-reactive/browse?at=2.0.0-RC.1) (2017-06-23)

We migrated most of the components from ObliqueReactive 1.3.* to Angular 4.
This of course break all compatibility to all older releases of ObliqueReactive. 

