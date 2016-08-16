import {DatePickerDirectiveController} from './date-picker-directive-controller';

//TODO: rewrite to controllerAs syntax and split up
/**
 * Wrapper for UI Bootstrap `datepicker` directive:
 * https://angular-ui.github.io/bootstrap/#/datepicker
 */
export class DatePickerDirective implements ng.IDirective {
    templateUrl = '../oblique/ui/date-picker/date-picker.tpl.html';
    restrict = 'E';
    replace = true;
    scope = {
        ngModel: '=',
        minDate: '=',
        maxDate: '=',
        options: '&?', // See UI Bootstrap `datepicker` 'Popup Settings'
        disabled: '=?ngDisabled',
        required: '=?ngRequired',
        editable: '=?', // Manual edition
        label: '@label',
        name: '@',
        controlId: '@',
        controlSize: '@', // 'sm'
        showClearControl: '=?'
    };
    controller = DatePickerDirectiveController;

    link = (scope, element, attrs) => {

        scope.toggle = ($event) => {
            $event.preventDefault();
            $event.stopPropagation();

            scope.opened = !scope.opened;
        };

        scope.clear = () => {
            scope.ngModel = null;
        };

        // Bind event listeners:
        element.keydown((e) => {
            let control = element.find('input[name=' + scope.name + ']');
            if (angular.element(e.target).is(control) && e.keyCode === 40) { // 40: ArrowDown
                scope.$apply(() => {
                    scope.toggle(e);
                });
            }
        });
    };
}
