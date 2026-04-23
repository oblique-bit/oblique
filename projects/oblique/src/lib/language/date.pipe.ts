import {Pipe, PipeTransform, inject} from '@angular/core';
import {ObLanguageService} from './language.service';
import {obFormatDatetime} from './date-adapter/date-formatters';
import {ObDateTimeFormat, ObDateValue, ObFormat, ObTimeFormat} from './date-adapter/date.model';

@Pipe({
	name: 'obDate',
	// eslint-disable-next-line @angular-eslint/no-pipe-impure
	pure: false,
})
export class ObDatePipe implements PipeTransform {
	private readonly timeFormats: ObTimeFormat[] = ['shortTime', 'mediumTime', 'longTime'] as const;
	private locale: string;

	constructor() {
		inject(ObLanguageService).locale$.subscribe(locale => {
			this.locale = locale;
		});
	}

	transform(value: ObDateValue, dateFormat: ObDateTimeFormat, timeFormat?: ObTimeFormat): string {
		return obFormatDatetime(value, this.locale, this.buildFormat(dateFormat, timeFormat));
	}

	private buildFormat(dateFormat: ObDateTimeFormat, timeFormat?: ObTimeFormat): ObFormat {
		if (this.isTimeFormat(dateFormat)) {
			return {time: dateFormat};
		}
		return {date: dateFormat, time: timeFormat};
	}

	private isTimeFormat(displayFormat: ObDateTimeFormat): displayFormat is ObTimeFormat {
		return this.timeFormats.includes(displayFormat as ObTimeFormat);
	}
}
