import {registerLocaleData} from '@angular/common';
import localeFR from '@angular/common/locales/fr-CH';
import localeDE from '@angular/common/locales/de-CH';
import {obFormatDatetime} from './date-formatters';
import {ObFormat} from './date.model';

registerLocaleData(localeFR);
registerLocaleData(localeDE);
const timestamp = 1775212506728;
const inputs = [timestamp, new Date(timestamp), '2026-04-03T12:35:06.728'] as const;

describe(obFormatDatetime.name, () => {
	test('invalid Date', () => {
		expect(obFormatDatetime(new Date('sdf'), '', {date: 'shortDate'})).toBeNull();
	});

	const cases: Record<string, {format: ObFormat; expected: string}[]> = {
		'en-US': [
			{format: {date: null}, expected: '03.04.2026'},
			{format: {date: undefined}, expected: '03.04.2026'},
			{format: {date: 'isoDate'}, expected: '2026-04-03'},
			{format: {date: 'fullDate'}, expected: 'Friday, 3 April 2026'},
			{format: {date: 'longDate'}, expected: '3 April 2026'},
			{format: {date: 'mediumDate'}, expected: '3 Apr 2026'},
			{format: {date: 'shortDate'}, expected: '03.04.2026'},
			{format: {date: 'longMonthYear'}, expected: 'April 2026'},
			{format: {date: 'mediumMonthYear'}, expected: 'Apr 2026'},
			{format: {date: 'longMonth'}, expected: 'April'},
			{format: {time: null}, expected: '03.04.2026'},
			{format: {time: undefined}, expected: '03.04.2026'},
			{format: {time: 'longTime'}, expected: '12:35:06.728'},
			{format: {time: 'mediumTime'}, expected: '12:35:06'},
			{format: {time: 'shortTime'}, expected: '12:35'},
			{format: {date: null, time: 'shortTime'}, expected: '12:35'},
			{format: {date: undefined, time: 'mediumTime'}, expected: '12:35:06'},
			{format: {date: 'isoDate', time: 'longTime'}, expected: '2026-04-03T12:35:06.728'},
			{format: {date: 'fullDate', time: 'shortTime'}, expected: 'Friday, 3 April 2026 at 12:35'},
			{format: {date: 'longDate', time: 'mediumTime'}, expected: '3 April 2026 at 12:35:06'},
			{format: {date: 'mediumDate', time: 'longTime'}, expected: '3 Apr 2026, 12:35:06.728'},
			{format: {date: 'shortDate', time: 'shortTime'}, expected: '03.04.2026, 12:35'},
			{format: {date: 'longMonthYear', time: 'mediumTime'}, expected: 'April 2026 at 12:35:06'},
			{format: {date: 'mediumMonthYear', time: 'longTime'}, expected: 'Apr 2026, 12:35:06.728'},
			{format: {date: 'longMonth', time: 'shortTime'}, expected: 'April at 12:35'},
		],
		'fr-CH': [
			{format: {date: null}, expected: '03.04.2026'},
			{format: {date: undefined}, expected: '03.04.2026'},
			{format: {date: 'isoDate'}, expected: '2026-04-03'},
			{format: {date: 'fullDate'}, expected: 'vendredi, 3 avril 2026'},
			{format: {date: 'longDate'}, expected: '3 avril 2026'},
			{format: {date: 'mediumDate'}, expected: '3 avr. 2026'},
			{format: {date: 'shortDate'}, expected: '03.04.2026'},
			{format: {date: 'longMonthYear'}, expected: 'avril 2026'},
			{format: {date: 'mediumMonthYear'}, expected: 'avr. 2026'},
			{format: {date: 'longMonth'}, expected: 'avril'},
			{format: {time: null}, expected: '03.04.2026'},
			{format: {time: undefined}, expected: '03.04.2026'},
			{format: {time: 'longTime'}, expected: '12:35:06,728'},
			{format: {time: 'mediumTime'}, expected: '12:35:06'},
			{format: {time: 'shortTime'}, expected: '12:35'},
			{format: {date: null, time: 'mediumTime'}, expected: '12:35:06'},
			{format: {date: undefined, time: 'longTime'}, expected: '12:35:06,728'},
			{format: {date: 'isoDate', time: 'shortTime'}, expected: '2026-04-03T12:35'},
			{format: {date: 'fullDate', time: 'mediumTime'}, expected: 'vendredi, 3 avril 2026 à 12:35:06'},
			{format: {date: 'longDate', time: 'longTime'}, expected: '3 avril 2026 à 12:35:06,728'},
			{format: {date: 'mediumDate', time: 'shortTime'}, expected: '3 avr. 2026, 12:35'},
			{format: {date: 'shortDate', time: 'mediumTime'}, expected: '03.04.2026 12:35:06'},
			{format: {date: 'longMonthYear', time: 'longTime'}, expected: 'avril 2026 à 12:35:06,728'},
			{format: {date: 'mediumMonthYear', time: 'shortTime'}, expected: 'avr. 2026, 12:35'},
			{format: {date: 'longMonth', time: 'mediumTime'}, expected: 'avril à 12:35:06'},
		],
		'de-CH': [
			{format: {date: null}, expected: '03.04.2026'},
			{format: {date: undefined}, expected: '03.04.2026'},
			{format: {date: 'isoDate'}, expected: '2026-04-03'},
			{format: {date: 'fullDate'}, expected: 'Freitag, 3. April 2026'},
			{format: {date: 'longDate'}, expected: '3. April 2026'},
			{format: {date: 'mediumDate'}, expected: '3. Apr. 2026'},
			{format: {date: 'shortDate'}, expected: '03.04.2026'},
			{format: {date: 'longMonthYear'}, expected: 'April 2026'},
			{format: {date: 'mediumMonthYear'}, expected: 'Apr. 2026'},
			{format: {date: 'longMonth'}, expected: 'April'},
			{format: {time: null}, expected: '03.04.2026'},
			{format: {time: undefined}, expected: '03.04.2026'},
			{format: {time: 'longTime'}, expected: '12:35:06.728'},
			{format: {time: 'mediumTime'}, expected: '12:35:06'},
			{format: {time: 'shortTime'}, expected: '12:35'},
			{format: {date: null, time: 'longTime'}, expected: '12:35:06.728'},
			{format: {date: undefined, time: 'shortTime'}, expected: '12:35'},
			{format: {date: 'isoDate', time: 'mediumTime'}, expected: '2026-04-03T12:35:06'},
			{format: {date: 'fullDate', time: 'longTime'}, expected: 'Freitag, 3. April 2026 um 12:35:06.728'},
			{format: {date: 'longDate', time: 'shortTime'}, expected: '3. April 2026 um 12:35'},
			{format: {date: 'mediumDate', time: 'mediumTime'}, expected: '3. Apr. 2026, 12:35:06'},
			{format: {date: 'shortDate', time: 'longTime'}, expected: '03.04.2026, 12:35:06.728'},
			{format: {date: 'longMonthYear', time: 'shortTime'}, expected: 'April 2026 um 12:35'},
			{format: {date: 'mediumMonthYear', time: 'mediumTime'}, expected: 'Apr. 2026, 12:35:06'},
			{format: {date: 'longMonth', time: 'longTime'}, expected: 'April um 12:35:06.728'},
		],
	};

	describe.each(inputs)(`%s`, date => {
		describe.each(Object.entries(cases))('%s', (locale, formats) => {
			test.each(formats)('$format', ({format, expected}) => {
				expect(obFormatDatetime(date, locale, format)).toBe(expected);
			});
		});
	});
});
