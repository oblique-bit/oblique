export class UibTypeaheadPopupDirective implements ng.IDirective {
    restrict = 'EA';
    link = (scope, element, attrs) => {
        let unregisterFn = scope.$on('TypeaheadActiveChanged', (event) => {
            if (scope.activeIdx !== -1) {
                // Retrieve active Typeahead option:
                let option = element.find('#' + attrs.id + '-option-' + scope.activeIdx);
                // You nay need to change this selector if you are using custom templates

                if (option.length) {
                    // Make sure option is visible:
                    option[0].scrollIntoView(false);
                }
            }
        });

        // Ensure listener is unregistered when $destroy event is fired:
        scope.$on('$destroy', unregisterFn);
    };

}