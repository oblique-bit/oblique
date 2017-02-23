import {DatepickerPopupConfig} from './datepicker-config';

export class DatePickerController implements ng.IComponentController {
	// Requires:
	formCtrl:ng.INgModelController;

	// Bindings:
	ngModel;

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
	placeholder:string;

	opened:boolean;

	// Scope:
	formControl:ng.INgModelController;

	/*@ngInject*/
	constructor(private $scope,
	            private $element,
	            private $timeout:ng.ITimeoutService,
	            private uibDatepickerPopupConfig:DatepickerPopupConfig,
	            private uibDateParser) {
	}

	$onInit() {
		// Expose form control to component view:
		this.$timeout(() => {
			this.formControl = this.formCtrl[this.name];
		});

		// Bind options & configuration:
		this.dpOptions = angular.extend({}, this.uibDatepickerPopupConfig, this.options || {});
		this.dpAltInputFormats = (this.uibDatepickerPopupConfig.altInputFormats || []).concat(this.altInputFormats || []);
		this.editable = angular.isDefined(this.editable) ? this.editable : true;
		this.showClearControl = angular.isDefined(this.showClearControl) ? this.showClearControl : true;
		this.opened = false;
		this.placeholder = angular.isDefined(this.placeholder) ? this.placeholder : 'i18n.oblique.common.date.format.' + this.dpOptions.datepickerPopup;

		// Events:
		this.$scope.$watchGroup(['orDatepickerCtrl.options.minDate', 'orDatepickerCtrl.options.maxDate'], (newValues, oldValues) => {
			if (!angular.equals(newValues, oldValues)) {
				// Ensure min/max dates get parsed correctly:
				this.parseMinMax();
			}
		});

		this.$element.keydown((e) => {
			let control = this.$element.find('input[name=' + this.name + ']');
			if (angular.element(e.target).is(control) && e.keyCode === 40) { // 40: ArrowDown
				this.toggle(e);
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
