import {LogDecorator} from '../../infrastructure/log-decorator';

/**
 * Controller for the FormControl component.
 *
 * @see FormControlComponent
 */
export class FormControlController implements ng.IComponentController {

	// Requires:
	formCtrl;

	// Bindings:
	name:string;
	mandatory:boolean;
	pristineValidation:boolean;

	/*@ngInject*/
	constructor(private $scope, private $element, private $log:LogDecorator, private $timeout:ng.ITimeoutService) {
	}

	$onInit() {
		// Delay initialization to ensure form control has already been attached to the form:
		this.$timeout(() => {
			// Lookup the underlying form control 'name':
			let name = this.name || this.$element.find('[name]').attr('name');

			if (name && this.formCtrl[name]) {
				let formControl:ng.INgModelController = this.formCtrl[name];
				this.$scope.$watchGroup(
					[
						() => formControl.$invalid,
						() => formControl.$dirty,
						() => this.formCtrl.$submitted
					],
					() => {
						// Invalidity:
						this.$element.toggleClass(
							'has-error',
							formControl.$invalid === true && (this.formCtrl.$submitted || this.formCtrl.$dirty || !!this.pristineValidation)
						);

						// Mandatory:
						if(this.mandatory) {
							this.$element.find('[name]')
								.parent().toggleClass(
									'control-mandatory',
									(angular.isUndefined(formControl.$modelValue) ||angular.isUndefined(formControl.$modelValue)) && (formControl.$invalid || formControl.$error.required)
								);
						}

						// ARIA:
						this.$element.find('[name="' + name + '"]').attr('aria-invalid', formControl.$invalid);
					}
				);
			} else {
				this.$log.warn(`[form-control] Could not find any form control with name "${name}". Ignoring..."`);
			}
		});
	}
}
