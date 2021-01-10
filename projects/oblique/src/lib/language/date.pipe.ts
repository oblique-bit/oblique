import {Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '@angular/common';
import {ObLanguageService} from './language.service';

@Pipe({
	name: 'obDate',
	pure: false
})
export class ObDatePipe implements PipeTransform {
	private locale: string;

	constructor(language: ObLanguageService) {
		language.locale$.subscribe(locale => (this.locale = locale));
	}

	transform(value: string | number | Date, format = 'datetime', timezone?: string): string {
		return format === 'datetime'
			? `${formatDate(value, 'shortDate', this.locale, timezone)} ${formatDate(value, 'mediumTime', this.locale, timezone)}`
			: formatDate(value, format, this.locale, timezone);
	}
}
