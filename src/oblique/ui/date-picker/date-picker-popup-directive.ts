/**
 * DatepickerPopup extensions:
 *  - validation of ISO-formatted date strings (no more accepted by AngularUI v0.13.3)
 *  - validation of ISO-formatted date strings (no more accepted since AngularUI v0.13.3)
 *  - ISO model values only
 *
 * See:
 *  - https://github.com/angular-ui/bootstrap/issues/4233
 */
export class DatePickerPopupDirective implements ng.IDirective {
	restrict = 'A';
	priority = 9999;
	require = ['ngModel', '^datePicker'];

	constructor(private dateFilter,
	            private uibDateParser,
	            private uibDatepickerPopupConfig) {
	}

	link = (scope, element, attrs, ctrls) => {

		let ngModel:ng.INgModelController = ctrls[0];
		let datePicker = ctrls[1];
		let dateFilter = this.dateFilter;

		// Check for ISO model values:
		if (this.uibDatepickerPopupConfig.modelAsIsoFormat) {
			ngModel.$formatters.push((value) => {
				return this.uibDateParser.parse(value, this.uibDatepickerPopupConfig.modelAsIsoFormat);
			});

			ngModel.$parsers.push((value) => {
				if (angular.isDate(value)) {
					return this.dateFilter(value, this.uibDatepickerPopupConfig.modelAsIsoFormat);
				} else if(value === null) {
					return null;
				}
				//If the value isn't parsable, the model should be undefined
				return undefined;
			});

			//We have to override the date validator from ui-bootstrap or add modelAsIsoFormat to altInputFormats
			let oldDateValidator = ngModel.$validators['date'];
			ngModel.$validators['date'] = (modelValue:string, viewValue:string) => {
				if (!oldDateValidator(modelValue, viewValue)) {
					return !!(this.uibDateParser.parse(modelValue, this.uibDatepickerPopupConfig.modelAsIsoFormat));
				}
				return true;
			};
		}

		//TODO remove this workaround for https://github.com/angular-ui/bootstrap/issues/6124 as soon as it's fixed
		ngModel.$validators['minDate'] = (modelValue) => {
			return !modelValue || !isInRange(modelValue).min;
		};

		ngModel.$validators['maxDate'] = (modelValue) => {
			return !modelValue || !isInRange(modelValue).max;
		};

		function isInRange(date) {
			date = new Date(date);
			let dates: any = {};
			angular.forEach(['minDate', 'maxDate'], (key) => {
				if (!datePicker.dpOptions[key]) {
					dates[key] = null;
				} else if (angular.isDate(datePicker.dpOptions[key])) {
					dates[key] = new Date(datePicker.dpOptions[key]);
				} else {
					dates[key] = new Date(dateFilter(datePicker.dpOptions[key], 'medium'));
				}
			});

			return  {
				min: dates.minDate && compare(date, dates.minDate) < 0,
				max: dates.maxDate && compare(date, dates.maxDate) > 0
			};
		}

		function compare(date1, date2) {
			return new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).valueOf() - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).valueOf();
		}
	};
}
