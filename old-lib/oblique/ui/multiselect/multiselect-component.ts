import {MultiselectController} from './multiselect-controller';

/**
 * Wrapper for AngularJS Dropdown Multiselect:
 * http://dotansimha.github.io/angularjs-dropdown-multiselect/
 *
 * FIXME: problems with tv4 validation, only triggers validaton on check, not on blur. ($parsers will never be triggered)
 */
export class MultiselectComponent implements ng.IComponentOptions {
	template = `<div ng-dropdown-multiselect
					 options='orMultiselectCtrl.options'
					 selected-model='orMultiselectCtrl.ngModel'
					 checkboxes='true'
					 extra-settings='orMultiselectCtrl.settings'
					 translation-texts='orMultiselectCtrl.translations'></div>`;
	require = {
		ngModelCtrl: 'ngModel'
	};
	bindings = {
		ngModel: '=',           // The object the will contain the model for the selected items in the dropdown.
		options: '=',           // The options for the dropdown.
		extraSettings: '&?',    // See 'Settings' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
		translationTexts: '&?', // See 'Translation Texts' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
		dropup: '='             // Defines if a dropup menu should be used instead on a dropdown
	};
	controller = MultiselectController;
	controllerAs = 'orMultiselectCtrl';
}
