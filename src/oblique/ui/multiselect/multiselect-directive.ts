import {MultiselectDirectiveController} from './multiselect-directive-controller';

/**
 * Wrapper for AngularJS Dropdown Multiselect:
 * http://dotansimha.github.io/angularjs-dropdown-multiselect/
 *
 * FIXME: problems with tv4 validation, only triggers validaton on check, not on blur. ($parsers will never be triggered)
 */
export class MultiselectDirective implements ng.IDirective {
	restrict = 'E';
	template = `<div    ng-dropdown-multiselect 
						options='ctrl.options' 
						selected-model='ctrl.ngModel' 
						checkboxes='true' 
						extra-settings='ctrl.settings' 
						translation-texts='ctrl.translations'></div>`;
	require = ['ngModel', 'multiselect'];
	scope = {};
	bindToController = {
		ngModel: '=',    // The object the will contain the model for the selected items in the dropdown.
		options: '=',    // The options for the dropdown.
		extraSettings: '&?',   // See 'Settings' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
		translationTexts: '&?',   // See 'Translation Texts' section on http://dotansimha.github.io/angularjs-dropdown-multiselect/
		dropup: '='     // Defines if a dropup menu should be used instead on a dropdown
	};
	controller = MultiselectDirectiveController;
	controllerAs = 'ctrl';

	//TODO: discuss splitting
	link = (scope, element, attrs, controllers) => {
		let ngModelCtrl:ng.INgModelController = controllers[0];
		let multiselectCtrl:MultiselectDirectiveController = controllers[1];

		let container = element.find('.multiselect-parent');
		let dropdownMultiselect:any = angular.element(container).scope();

		if (dropdownMultiselect) {
			// Close on ESC keypress:
			element.bind('keydown', (evt) => {
				if (evt.which === 27) { // ESC key
					evt.preventDefault();
					evt.stopPropagation();
					dropdownMultiselect.open = false;
					// Trigger $digest cycle:
					scope.$apply();
				}
			});

			// Dropup?
			if (multiselectCtrl.dropup) {
				container.addClass('dropup');
				element.find('.dropdown-toggle').addClass('dropdown-toggle-up');
			}

			// Enable labels translation:
			// FIXME: remove when https://github.com/dotansimha/angularjs-dropdown-multiselect/issues/54
			multiselectCtrl.translateLabels(dropdownMultiselect);
			scope.$root.$on('$translateChangeSuccess', () => {
				multiselectCtrl.translateLabels(dropdownMultiselect);
			});
		}

		// Toggle dirty state:
		let originalValue = angular.copy(multiselectCtrl.ngModel);
		scope.$watch('ctrl.ngModel', (newValue, oldValue) => {
			if (!angular.equals(originalValue, newValue)) {
				ngModelCtrl.$setDirty();
				// TODO: trigger parsers here!
			}
		}, true);
	};
}
