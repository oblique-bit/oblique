import {MultiselectConfig} from './multiselect-config';

export class MultiselectController implements ng.IComponentController {
	// Requires:
	ngModelCtrl;

	// Bindings:
	ngModel;
	options;
	settings;
	extraSettings;
	translationTexts;
	dropup:boolean;

	translations:any = {};

	/*@ngInject*/
	constructor(
		private $scope, private $element,
		private $timeout:ng.ITimeoutService,
		private $filter:ng.IFilterService,
		private multiselectConfig:MultiselectConfig) {
	}

	$onInit() {
		// Configuration:
		this.settings = angular.extend(this.multiselectConfig.extraSettings, this.extraSettings ? this.extraSettings() : {});
		this.translations = angular.extend(
			this.multiselectConfig.translationTexts,
			this.translationTexts ? this.translationTexts() : {}
		);

		// Bindings:
		this.ngModel = this.ngModel || [];

		// Events:
		this.$timeout(() => {
			let container = this.$element.find('.multiselect-parent');
			let dropdownMultiselect:any = angular.element(container).scope();

			if (dropdownMultiselect) {
				// Close on ESC keypress:
				this.$element.bind('keydown.multiselect', (evt) => {
					if (evt.which === 27) { // ESC key
						evt.preventDefault();
						evt.stopPropagation();
						dropdownMultiselect.open = false;
						// Trigger $digest cycle:
						this.$scope.$apply();
					}
				});

				// Dropup?
				if (this.dropup) {
					container.addClass('dropup');
					this.$element.find('.dropdown-toggle').addClass('dropdown-toggle-up');
				}

				// Enable labels translation:
				// FIXME: remove when https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/54
				this.translateLabels(dropdownMultiselect);
				let deregister = this.$scope.$root.$on('$translateChangeSuccess', () => {
					this.translateLabels(dropdownMultiselect);
				});

				// Deregistration:
				this.$scope.$on('$destroy', () => {
					this.$element.off('keydown.multiselect');
					deregister();
				});
			}

			// Toggle dirty state:
			let originalValue = angular.copy(this.ngModel);
			this.$scope.$watch('orMultiselectCtrl.ngModel', (newValue, oldValue) => {
				if (!angular.equals(originalValue, newValue)) {
					this.ngModelCtrl.$setDirty();

					// Trigger parsers manually to force control validation:
					angular.forEach(this.ngModelCtrl.$parsers, (parser) => {
						parser(this.ngModelCtrl.$viewValue);
					});
				}
			}, true);
		});
	}

	// FIXME: remove when https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/54
	translateLabels(dropdownMultiselect) {
		angular.forEach(this.translations, (value, key) => {
			dropdownMultiselect.texts[key] = this.$filter('translate')(value);
		});
	}
}
