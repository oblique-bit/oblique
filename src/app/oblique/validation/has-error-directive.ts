export class HasErrorDirective implements ng.IDirective {
    restrict = 'A';
    require = '^form';
    link = (scope, element, attrs, form:ng.IFormController) => {
        // Retrieve the underlying form control and its 'name' attribute:
        let control = element.find('[name]');
        let name = control.attr('name') || attrs.hasError;

        if (name) {
            // Watch for control validity changes:
            scope.$watch(form.$name + '.' + name + '.$invalid', (invalid) => {
                element.toggleClass('has-error', invalid === true);
            });
        }
    };
}