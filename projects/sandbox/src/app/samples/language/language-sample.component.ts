import {Component} from '@angular/core';
import type {ObDateFormat, ObTimeFormat} from '@oblique/language/date-adapter/date.model';

@Component({
	selector: 'sb-language-sample',
	standalone: false,
	templateUrl: './language-sample.component.html',
})
export class LanguageSampleComponent {
	readonly dateFormats: ObDateFormat[] = [
		null,
		'fullDate',
		'longDate',
		'mediumDate',
		'shortDate',
		'isoDate',
		'longMonthYear',
		'mediumMonthYear',
		'longMonth',
	] as const;
	readonly timeFormats: ObTimeFormat[] = [null, 'longTime', 'mediumTime', 'shortTime'] as const;
	readonly formatsPipe = ['datetime', 'shortDate', 'mediumDate', 'longDate', 'fullDate'] as const;
	date = new Date();
	formatPipe: (typeof this.formatsPipe)[number] = 'datetime';
	dateFormat: ObDateFormat = 'shortDate';
	timeFormat: ObTimeFormat = 'shortTime';
	timezone: string;
}
