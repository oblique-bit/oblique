import {Component, ElementRef, forwardRef, HostListener, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {ThemeService} from '../theme/theme.service';
import {DatepickerConfigService, DatepickerOptions} from './datepicker-config.service';

/**
 * @deprecated with material theme since version 4.0.0. Use angular material datepicker instead
 */
@Component({
	selector: 'or-date-picker',
	exportAs: 'orDatePicker',
	styleUrls: ['./datepicker.component.scss'],
	templateUrl: './datepicker.component.html',
	encapsulation: ViewEncapsulation.None,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => DatepickerComponent)
		}, {
			provide: NG_VALIDATORS,
			multi: true,
			useExisting: forwardRef(() => DatepickerComponent)
		}
	],
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'datepicker input-group'}
})
export class DatepickerComponent implements OnInit, ControlValueAccessor, Validator {
	datePicker = new FormControl();
	opts = {} as DatepickerOptions;

	@Input() maxDate: NgbDateStruct;
	@Input() minDate: NgbDateStruct;
	@Input() startDate: NgbDateStruct;
	@Input() placeholder: string;
	@Input() options = {} as DatepickerOptions;
	@ViewChild(NgbInputDatepicker, {static: true}) ngbDatePicker: NgbInputDatepicker;

	get disabled() {
		return this.datePicker.disabled;
	}

	constructor(private readonly element: ElementRef, private readonly config: DatepickerConfigService, theme: ThemeService) {
		theme.deprecated('datepicker', 'datepicker');
	}

	ngOnInit(): void {
		this.opts = {...this.config.options, ...this.options};
	}

	writeValue(obj: any): void {
		if (obj) {
			this.datePicker.setValue(obj);
		}
	}

	registerOnChange(fn: any): void {
		this.datePicker.valueChanges.subscribe(fn);
	}

	registerOnTouched(fn: any): void {
	}

	setDisabledState(isDisabled: boolean): void {
		isDisabled ? this.datePicker.disable() : this.datePicker.enable();
	}

	validate(control: AbstractControl): ValidationErrors | null {
		return this.datePicker.valid ? null : this.datePicker.errors;
	}

	@HostListener('keydown', ['$event'])
	onKeydown($event) {
		if ($event.target.attributes['ngbdatepicker']) {
			if ($event.keyCode === 40) { // 40: ArrowDown
				this.ngbDatePicker.open();
			} else if ($event.keyCode === 38 || $event.keyCode === 9) { // 38: ArrowUp, 40: Tab
				this.ngbDatePicker.close();
			}
		}
	}
}
