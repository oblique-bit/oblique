import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {DatePipe, JsonPipe, NgIf} from '@angular/common';
import {ObFormFieldModule} from '@oblique/oblique';

@Component({
	selector: 'app-datepicker-example-other-options-preview',
	templateUrl: './datepicker-example-other-options-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [DatePipe, JsonPipe, MatFormFieldModule, MatInputModule, MatDatepickerModule, NgIf, ObFormFieldModule, ReactiveFormsModule]
})
export class DatepickerExampleOtherOptionsPreviewComponent {
	readonly august1st1891 = new Date(1891, 7, 1);
	readonly errorControl = new FormControl(new Date(), [
		function (control: FormControl) {
			return new Date(control.value as Date) < new Date() ? {pastDate: true} : null;
		}
	]);

	readonly minErrorControl = new FormControl(new Date(), [
		function (control: FormControl) {
			return new Date(control.value as Date) < new Date() ? {pastDate: true} : null;
		}
	]);

	readonly maxErrorControl = new FormControl(new Date(), [
		function (control: FormControl) {
			return new Date(control.value as Date) > new Date() ? {futureDate: true} : null;
		}
	]);
	lastDateChange: MatDatepickerInputEvent<any>;
	lastDateInput: MatDatepickerInputEvent<any>;
	readonly today = new Date();

	onDateChange(event: MatDatepickerInputEvent<any>): void {
		this.lastDateChange = event;
	}

	onDateInput(event: MatDatepickerInputEvent<any>): void {
		this.lastDateInput = event;
	}
}
