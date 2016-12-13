/**
 * Style wrapper for the `has-error` Bootstrap variant for form controls.
 *
 * TODO: rename into validation-state
 *
 * @scope   hasError            Specify a form control name only if underlying control cannot beautomatically retrieved.
 * @scope   hasErrorPristine    Defines if the validation state should be activated even if the form is pristine.
 */
export class HasErrorDirective implements ng.IDirective {
	restrict = 'A';
	require = '^form';

	link = (scope, element, attrs, form:ng.IFormController) => {
		// Retrieve the underlying form control 'name':
		let name = attrs.hasError || element.find('[name]').attr('name');

		if (name) {
			scope.$watchGroup(
				[
					form.$name + '.' + name + '.$invalid',
					form.$name + '.' + name + '.$dirty',
					form.$name + '.$submitted'
				],
				() => {
					element.toggleClass('has-error', form[name].$invalid === true && (form.$submitted || form.$dirty || angular.isDefined(attrs.hasErrorPristine)));
				}
			);
		}
	};
}
