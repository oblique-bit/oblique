import {LogDecorator} from '../infrastructure/log-decorator';

export class ValidationBusinessDirective implements ng.IDirective {
	restrict = 'A';
	require = '^form';

	constructor(private $log:LogDecorator) {

	}

	link = (scope:ng.IScope, element, attrs, form:ng.IFormController) => {
		scope.$on('validationBusinessEvent', (event, errors) => {
			_.forEach(errors || [], (error) => {
				let formKey:string = error.parent ? error.parent + (error.index ? '_' + error.index : '') : null;
				let targetForm:ng.IFormController = formKey ? form[formKey] : form;
				let formControl = targetForm[error.property || error.name];
				if (formControl) {
					formControl.$setValidity('business', false);
					//TODO: monkey patching, perhaps use another way
					formControl.$errorMessage = error.message;
				} else {
					this.$log.warn('Unable to map business error with form control. Ignoring...', error);
				}
			});
		});
	}
}
