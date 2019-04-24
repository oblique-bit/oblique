import {AfterViewInit, Component, ContentChild, ElementRef, HostListener, Input, ViewEncapsulation} from '@angular/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'or-date-picker',
	styleUrls: ['./datepicker.component.scss'],
	templateUrl: './datepicker.component.html',
	// Ensure CSS styles are added to global styles to ensure `ngb-datepicker` styles can be overrided:
	// dd(see also: https://angular.io/docs/ts/latest/guide/component-styles.html#!#view-encapsulation)
	encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent implements AfterViewInit {

	@ContentChild(NgbInputDatepicker)
	ngbDatePicker: NgbInputDatepicker;

	private _disabled = false;

	@Input()
	set disabled(val) {
		this._disabled = val;
		if (this.ngbDatePicker) {
			this.ngbDatePicker.setDisabledState(val);
			this.ngbDatePicker.close();
		}
	}

	get disabled() {
		return this._disabled;
	}

	constructor(private readonly element: ElementRef) {
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

	ngAfterViewInit() {
		if (!this.ngbDatePicker) {
			throw new Error('or-date-picker requires a transcluded ngbDatepicker!');
		}
		this.ngbDatePicker.setDisabledState(this._disabled);
	}
}
