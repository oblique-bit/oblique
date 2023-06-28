import {Component, OnInit} from '@angular/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';

@Component({
	selector: 'sb-datepicker',
	templateUrl: './datepicker.component.html',
	standalone: true,
	imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule]
})
export class DatepickerComponent implements OnInit {
	minFromDate: Date;
	maxFromDate: Date | null;

	minToDate: Date | null;
	maxToDate: Date;

	constructor(private readonly adapter: DateAdapter<unknown>) {
		this.minFromDate = new Date(1900, 0, 1);
		this.maxFromDate = new Date();

		this.minToDate = new Date(1900, 0, 1);
		this.maxToDate = new Date();
	}

	ngOnInit(): void {
		this.adapter.setLocale('de-CH');
	}

	toDateChange(type: string, event: MatDatepickerInputEvent<Date>): void {
		this.maxFromDate = event.value;

		if (event.value !== null) {
			this.minFromDate = new Date(event.value.getFullYear(), event.value.getMonth(), event.value.getDate() - 30);
		}
	}
}
