import {Component, Input} from '@angular/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'or-date-picker',
	exportAs: 'orDatePicker',
	template: ''
})
export class MockDatepickerComponent {
	ngbDatePicker: NgbInputDatepicker;
	@Input() disabled: boolean;

	onKeydown($event): void {
	}
}
