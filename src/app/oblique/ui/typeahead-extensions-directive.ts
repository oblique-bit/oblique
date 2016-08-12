/**
 * Extend AngularUI Typeahead to ensure that active item remains always visible
 * on a scrollable popup when using UP/DOWN arrow keys.
 *
 * See: http://stackoverflow.com/questions/27705490/up-down-arrow-key-issue-with-typeahead-control-angular-bootstrap-ui
 */

export class UibTypeaheadDirective implements ng.IDirective {
    restrict = 'A';
    priority = 1000; // Let's ensure AngularUI Typeahead directive gets initialized first!

    link = (scope, element, attrs) => {
        // Bind keyboard events: arrows up(38) / down(40)
        element.bind('keydown', (evt) => {
            if (evt.which === 38 || evt.which === 40) {
                // Broadcast a possible active option change:
                // (Note that we could pass the activeIdx value as event data but AngularUI Typeahead directive
                //  has its own local scope which makes it hard to retrieve, see:
                //  https://github.com/angular-ui/bootstrap/blob/7b7039b4d94074987fa405ee1174cfe7f561320e/src/typeahead/typeahead.js#L104)
                scope.$broadcast('TypeaheadActiveChanged');
            }
        });
    };
}
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