import {Component} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import type {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {DatePipe} from '@angular/common';
import {ObDatepickerModule} from '@oblique/oblique';

@Component({
	selector: 'app-datepicker-example-other-options-preview',
	templateUrl: './datepicker-example-other-options-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	imports: [DatePipe, MatFormFieldModule, MatInputModule, ObDatepickerModule, ReactiveFormsModule]
})
export class DatepickerExampleOtherOptionsPreviewComponent {
	readonly august1st1891 = new Date(1891, 7, 1);
	readonly errorControl = new FormControl(new Date(), [
		(control: FormControl) => (new Date(control.value as Date) < new Date() ? {pastDate: true} : null)
	]);

	readonly minErrorControl = new FormControl(new Date(), [
		(control: FormControl) => (new Date(control.value as Date) < new Date() ? {pastDate: true} : null)
	]);

	readonly maxErrorControl = new FormControl(new Date(), [
		(control: FormControl) => (new Date(control.value as Date) > new Date() ? {futureDate: true} : null)
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
