import {ChangeDetectionStrategy, Component} from '@angular/core';
import type {ObDateFormat, ObTimeFormat} from '@oblique/language/date-adapter/date.model';

@Component({
	selector: 'sb-language-sample',
	standalone: false,
	templateUrl: './language-sample.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
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
	date = new Date();
	dateFormat: ObDateFormat = 'shortDate';
	timeFormat: ObTimeFormat = 'shortTime';
	localizedPipeInputs = [
		'/samples/alert',
		'/en/samples/alert',
		'/fr/samples/alert',
		'',
		'/',
		'../',
		'../alert',
		'../../',
		'../../alert',
		'../../../',
		'../../../alert',
		'alert',
	];
}
