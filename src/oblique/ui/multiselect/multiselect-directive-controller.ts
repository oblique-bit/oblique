import {MultiselectConfig} from './multiselect-config';

export class MultiselectDirectiveController {
	ngModel;
	options;
	settings;
	extraSettings;
	translations;
	translationTexts;
	dropup:boolean;

	/*@ngInject*/
	constructor(private $filter:ng.IFilterService,
	            multiselectConfig:MultiselectConfig) {
		// Configuration:
		this.settings = angular.extend(multiselectConfig.extraSettings, this.extraSettings ? this.extraSettings() : {});
		this.translations = angular.extend(
			multiselectConfig.translationTexts,
			this.translationTexts ? this.translationTexts() : {}
		);

		// Binding:
		this.ngModel = this.ngModel || [];
	}

	// FIXME: remove when https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/54
	translateLabels(dropdownMultiselect) {
		angular.forEach(this.translations, (value, key) => {
			dropdownMultiselect.texts[key] = this.$filter('translate')(value);
		});
	}
}
