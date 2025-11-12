import {Component, computed, inject, input} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ObLanguageService} from '../language.service';
import {ObDateFormat} from './date.model';
import {formatDate} from '@angular/common';

@Component({
	selector: 'ob-date',
	templateUrl: './date.component.html',
})
export class ObDateComponent {
	readonly date = input.required<string | Date>();
	readonly format = input<ObDateFormat>('longDate');
	readonly formattedDate = computed(() => formatDate(this.validatedDate(), this.validateFormat(), this.locale()));
	readonly isoDate = computed(() => formatDate(this.validatedDate(), 'yyyy-MM-dd', this.locale()));
	private readonly locale = toSignal(inject(ObLanguageService).locale$);
	private readonly validatedDate = computed(() =>
		typeof this.date() === 'string' ? this.validateDate(this.date() as string) : this.date()
	);

	private validateFormat(): string {
		return this.format() === 'isoDate' ? 'yyyy-MM-dd' : this.format();
	}

	private validateDate(date: string): Date {
		const swissDateFormat = /\d\d\.\d\d\.\d\d\d\d/;
		const isoDateFormat = /\d\d\d\d-\d\d-\d\d/;
		if (swissDateFormat.test(date)) {
			return this.turnSwissDateStringIntoDate(date);
		}
		if (isoDateFormat.test(date)) {
			return new Date(date);
		}
		throw new Error(
			`Invalid date string received: ${date}. Accepted date strings use one of the following formats: 'dd.MM.yyyy' or 'yyyy-MM-dd'.`
		);
	}

	private turnSwissDateStringIntoDate(date: string): Date {
		const [day, month, year] = date.split('.');
		// Turning dd.MM.yyyy date strings into yyyy-MM-dd date strings because new Date() does not accept the first.
		const isoDateString = `${year}-${month}-${day}`;
		return new Date(isoDateString);
	}
}
