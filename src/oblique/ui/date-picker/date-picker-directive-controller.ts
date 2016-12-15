import {DatepickerPopupConfig} from './datepicker-config';

export class DatePickerDirectiveController implements ng.IComponentController {
	ngModel;
	formControl:ng.INgModelController;

	options:DatepickerPopupConfig;
	dpOptions:DatepickerPopupConfig;
	altInputFormats:string[];
	dpAltInputFormats:string[];

	disabled:boolean;
	required:boolean;
	editable:boolean;
	label:string;
	name:string;
	controlId:string;
	controlSize:string;
	showClearControl:boolean;

	opened:boolean;

	/*@ngInject*/
	constructor(private $scope,
	            private uibDatepickerPopupConfig:DatepickerPopupConfig,
	            private uibDateParser) {
	}

	$onInit() {
		this.dpOptions = angular.extend({}, this.uibDatepickerPopupConfig, this.options || {});
		this.dpAltInputFormats = (this.uibDatepickerPopupConfig.altInputFormats || []).concat(this.altInputFormats || []);
		this.editable = angular.isDefined(this.editable) ? this.editable : true;
		this.showClearControl = angular.isDefined(this.showClearControl) ? this.showClearControl : true;
		this.opened = false;

		this.$scope.$watchGroup(['orDatepickerCtrl.options.minDate', 'orDatepickerCtrl.options.maxDate'], (newValues, oldValues) => {
			if (!angular.equals(newValues, oldValues)) {
				// Ensure min/max dates get parsed correctly:
				this.parseMinMax();
			}
		});

		// Init:
		this.parseMinMax();
	}

	toggle($event) {
		$event.preventDefault();
		$event.stopPropagation();

		this.opened = !this.opened;
	};

	clear() {
		this.ngModel = null;
	}

	private parseMinMax() {
		if (this.options) {
			if (this.options.minDate && !angular.isDate(this.options.minDate)) {
				this.dpOptions.minDate = this.uibDateParser.parse(this.options.minDate, this.uibDatepickerPopupConfig.modelAsIsoFormat || this.options.datepickerPopup);
			}
			if (this.options.maxDate && !angular.isDate(this.options.maxDate)) {
				this.dpOptions.maxDate = this.uibDateParser.parse(this.options.maxDate, this.uibDatepickerPopupConfig.modelAsIsoFormat || this.options.datepickerPopup);
			}
		}
	}
}
