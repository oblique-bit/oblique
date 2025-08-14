import {Component, type OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DateFnsAdapter, MAT_DATE_FNS_FORMATS, MatDateFnsModule, provideDateFnsAdapter} from '@angular/material-date-fns-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {de} from 'date-fns/locale'; // German locale
import {getDay} from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';

@Component({
	selector: 'sb-date-picker-datefns',
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
		<p>America/Buenos_Aires: {{ getDateTimeFrom('America/Buenos_Aires') }}</p>
	`,
	standalone: true,
	imports: [MatFormFieldModule, FormsModule, MatInputModule, MatDatepickerModule, MatDateFnsModule],
	providers: [
		{provide: MAT_DATE_LOCALE, useValue: de},
		{provide: DateAdapter, useClass: DateFnsAdapter, deps: [MAT_DATE_LOCALE]},
		{provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FNS_FORMATS},
		provideDateFnsAdapter()
	]
})
export class DatepickerDateFnsComponent implements OnInit {
	selectedDate: Date | null = null;

	ngOnInit(): void {
		this.selectedDate = new Date();

		this.worldwideMeeting();
	}

	getDateTimeFrom(location: string): string {
		return formatInTimeZone(this.selectedDate, location, 'yyyy-MM-dd HH:mm:ssXXX');
	}

	onDateChange(date: Date | null): void {
		if (date) {
			console.info('Is JS Date?', date instanceof Date);
			console.info('toISO():', date.toISOString());
			const weekday = getDay(date) === 0 ? 7 : getDay(date);
			console.info('Weekday:', weekday);
		}
	}

	worldwideMeeting(): void {
		const date = '2025-08-12'; // from date input, e.g. yyyy-MM-dd
		const time = '14:30'; // from time input, e.g. HH:mm
		const userTimeZone = 'Europe/Madrid';

		// Combine date and time string
		const dateTimeString = `${date}T${time}:00`; // '2025-08-12T14:30:00'

		// Convert user local date/time string + timezone → UTC Date object
		const utcDate = formatInTimeZone(dateTimeString, userTimeZone, 'yyyy-MM-dd HH:mm:ssXXX');
		console.info('UTC date:', utcDate);
		// "2025-08-12T14:30:00.000+02:00" in Madrid timezone

		const spainTZ = 'Europe/Madrid';
		const turkeyTZ = 'Europe/Istanbul';
		const japanTZ = 'Asia/Tokyo';

		console.info('Spain:', formatInTimeZone(dateTimeString, spainTZ, 'yyyy-MM-dd HH:mm:ssXXX'));
		console.info('Turkey:', formatInTimeZone(dateTimeString, turkeyTZ, 'yyyy-MM-dd HH:mm:ss zzz'));
		console.info('Japan:', formatInTimeZone(dateTimeString, japanTZ, 'yyyy-MM-dd HH:mm:ss zzz'));
	}
}
