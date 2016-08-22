import {DatePickerDirectiveController} from './date-picker-directive-controller';

/**
 * Wrapper for UI Bootstrap `datepicker` directive:
 * https://angular-ui.github.io/bootstrap/#/datepicker
 */
export class DatePickerDirective implements ng.IDirective {
    templateUrl = '../oblique/ui/date-picker/date-picker.tpl.html';
    restrict = 'E';
    replace = true;
    scope = {};
    bindToController = {
        ngModel: '=',

        options: '=', // See UI Bootstrap `datepicker-options` docs under https://angular-ui.github.io/bootstrap/#/uib-datepicker-settings
        altInputFormats: '=?', // See UI Bootstrap `alt-input-formats` docs under https://angular-ui.github.io/bootstrap/#/uib-datepicker-popup-settings

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
    controllerAs = 'ctrl';

    link = (scope, element, attrs, controller:DatePickerDirectiveController) => {
        element.keydown((e) => {
            let control = element.find('input[name=' + controller.name + ']');
            if (angular.element(e.target).is(control) && e.keyCode === 40) { // 40: ArrowDown
                controller.toggle(e);
            }
        });
    }
}
