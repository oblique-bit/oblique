import {FormControlController} from './form-control-controller';
/**
 * Style wrapper for the Bootstrap `has-error` and ObliqueUI `control-mandatory` validation states for form controls.
 *
 * @see http://getbootstrap.com/css/#forms-control-validation
 *
 * @binding name                [Optional] Specify a form control name only if underlying control cannot be automatically retrieved.
 * @binding mandatory           [Optional] Defines if the current form control requires a value (use with ng-required on control it-self)
 * @binding pristineValidation  [Optional] Defines if the validation state should be activated even if the form is pristineValidation.
 */
export class FormControlComponent implements ng.IComponentOptions {

	require = {
		formCtrl: '^form'
	};

	bindings = {
		name: '@',
		mandatory: '=',
		pristineValidation: "=",
	};

	controller = FormControlController;
	controllerAs = 'orFormControlController';
}
