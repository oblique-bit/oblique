import {Component, type OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatLuxonDateModule} from '@angular/material-luxon-adapter';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {DateTime} from 'luxon';

export const myFormats = {
	parse: {
		dateInput: 'dd.MM.yyyy'
	},
	display: {
		dateInput: 'dd.MM.yyyy',
		monthYearLabel: 'MMM yyyy',
		dateA11yLabel: 'dd.MM.yyyy',
		monthYearA11yLabel: 'MMMM yyyy'
	}
};

@Component({
	selector: 'sb-date-picker-luxon',
	// eslint-disable-next-line @angular-eslint/component-max-inline-declarations
	template: `
		<mat-form-field>
			<mat-label>Default Datepicker</mat-label>
			<input matInput [matDatepicker]="defaultDatepicker" [(ngModel)]="selectedDate" (ngModelChange)="onDateChange($event)" />
			<mat-datepicker-toggle matIconSuffix [for]="defaultDatepicker" />
			<mat-datepicker #defaultDatepicker />
		</mat-form-field>

		<p>Europe/Istanbul {{ getDateTimeFrom('Europe/Istanbul') }}</p>
		<p>Asia/Tokyo: {{ getDateTimeFrom('Asia/Tokyo') }}</p>
		<p>Canada/Atlantic: {{ getDateTimeFrom('Canada/Atlantic') }}</p>
	`,
	standalone: true,
	imports: [MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule, ReactiveFormsModule, MatLuxonDateModule],
	providers: [
		{provide: MAT_DATE_FORMATS, useValue: myFormats},
		{provide: MAT_DATE_LOCALE, useValue: 'de'}
	]
})
export class DatepickerLuxonComponent implements OnInit {
	selectedDate: DateTime;

	ngOnInit(): void {
		this.selectedDate = DateTime.local();

		this.worldWideMeeting();
	}

	getDateTimeFrom(location: string): string {
		return this.selectedDate.setZone(location).toLocaleString(DateTime.DATETIME_FULL);
	}

	onDateChange(date?: DateTime): void {
		if (date) {
			console.info('Is Luxon DateTime?', date instanceof DateTime);
			console.info('toISO():', date.toISO());
			console.info('Weekday:', date.weekday);
			console.info('Locale-specific:', date.setLocale('de').toFormat('dd LLLL yyyy'));
		}
	}

	worldWideMeeting(): void {
		const date = '2025-08-12'; // from date picker input, e.g. 'yyyy-MM-dd'
		const time = '14:30'; // from time input, e.g. 'HH:mm'
		const userTimeZone = 'Europe/Madrid'; // user timezone

		// combine date and time with timezone
		const meetingDateTime = DateTime.fromISO(`${date}T${time}`, {zone: userTimeZone});
		console.info(meetingDateTime.toString());
		// "2025-08-12T14:30:00.000+02:00" in Madrid timezone
		const spainTZ = 'Europe/Madrid';
		const turkeyTZ = 'Europe/Istanbul';
		const japanTZ = 'Asia/Tokyo';

		console.info('Spain:', meetingDateTime.setZone(spainTZ).toLocaleString(DateTime.DATETIME_FULL));
		console.info('Turkey:', meetingDateTime.setZone(turkeyTZ).toLocaleString(DateTime.DATETIME_FULL));
		console.info('Japan:', meetingDateTime.setZone(japanTZ).toLocaleString(DateTime.DATETIME_FULL));
	}
}
