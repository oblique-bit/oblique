import {
	Component, ContentChild, Input, AfterViewInit, HostListener, ElementRef, ViewEncapsulation
} from '@angular/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'or-date-picker',
	template: `
		<div class="input-group">
			<ng-content></ng-content>
			<div class="input-group-append">
				<button type="button" class="btn btn-secondary" [disabled]="disabled" (click)="ngbDatePicker.toggle()">
					<span class="fa fa-calendar"></span>
				</button>
			</div>
		</div>`,
	// Ensure CSS styles are added to global styles to ensure `ngb-datepicker` styles can be overrided:
	// (see also: https://angular.io/docs/ts/latest/guide/component-styles.html#!#view-encapsulation)
	encapsulation: ViewEncapsulation.None,
	styles: [`
		ngb-datepicker.dropdown-menu {
			margin-top: 0;
			border-top-left-radius: 0;
			border-top-right-radius: 0;
			border-top: 0;
			border-color: #b4b4b4; /* ObliqueUI: $gray */
		}

		.ngb-dp-header {
			padding-top: 0 !important;
		}

		.ngb-dp-header .btn-link {
			color: #b4b4b4; /* ObliqueUI: $gray */
			height: 2.25rem;
			border-radius: 0;
		}

		.ngb-dp-header .btn-link:hover {
			color: #b4b4b4; /* ObliqueUI: $gray */
			border-color: transparent;
		}

		.ngb-dp-header .btn-link:not([disabled]):hover {
			color: #171717; /* ObliqueUI: $brand-default */
		}

		.ngb-dp-months {
			padding: 0 !important;
		}

		.ngb-dp-weekday {
			color: #333333 !important; /* ObliqueUI: $gray-darker */
			font-style: normal;
			width: 2.5rem !important;
		}

		.ngb-dp-day, .ngb-dp-week-number {
			width: 2.5rem !important;
			height: 2.5rem !important;
		}

		.ngb-dp-day .btn-secondary {
			border-radius: 0;
			width: 2.5rem;
			height: 2.5rem;
			line-height: 2.5rem;
		}

		.ngb-dp-day .btn-secondary:not(.bg-primary) {
			color: #333333 !important; /* ObliqueUI: $gray-darker */
		}

		.ngb-dp-day .btn-secondary:not(.bg-primary):hover {
			font-weight: bold;
		}

		.ngb-dp-day .btn-secondary.bg-primary {
			box-shadow: inset 0 0 7px -1px #171717; /* ObliqueUI: $brand-default */
		}
	`]
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
