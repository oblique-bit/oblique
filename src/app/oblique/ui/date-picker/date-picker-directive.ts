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
}
