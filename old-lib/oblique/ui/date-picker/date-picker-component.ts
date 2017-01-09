import {DatePickerController} from './date-picker-controller';

/**
 * Component wrapper for the `datepicker` directive of Angular UI Bootstrap .
 *
 * @see https://angular-ui.github.io/bootstrap/#/datepicker
 */
export class DatePickerComponent implements ng.IComponentOptions {
	templateUrl = 'oblique/ui/date-picker/date-picker.tpl.html';
	require = {
		formCtrl: '^form'
	};
	bindings = {
		ngModel: '=',

		options: '=', // See UI Bootstrap `datepicker-options` docs under https://angular-ui.github.io/bootstrap/#/uib-datepicker-settings
		altInputFormats: '=?', // See UI Bootstrap `alt-input-formats` docs under https://angular-ui.github.io/bootstrap/#/uib-datepicker-popup-settings

		disabled: '=?ngDisabled',
		required: '=?ngRequired',
		editable: '=?', // Manual edition
		label: '@',
		name: '@',
		controlId: '@',
		controlSize: '@', // 'sm'
		showClearControl: '=?'
	};
	controller = DatePickerController;
	controllerAs = 'orDatepickerCtrl';
}
