import {TestBed} from '@angular/core/testing';
import {ObDatePipe} from './date.pipe';
import {ObLanguageService} from './language.service';
import {of} from 'rxjs';
import {ObDateFormat, ObTimeFormat} from './date-adapter/date.model';

describe('DatePipe', () => {
	let pipe: ObDatePipe;
	const language = {locale$: of('en')} as ObLanguageService;
	jest.spyOn(language.locale$, 'subscribe');

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObDatePipe, {provide: ObLanguageService, useValue: language}],
		});
		pipe = TestBed.inject(ObDatePipe);
	});

	test('creation', () => {
		expect(pipe).toBeTruthy();
	});

	test('subscription on locale change', () => {
		expect(language.locale$.subscribe).toHaveBeenCalled();
	});

	describe('transform', () => {
		test('illegal value', () => {
			expect(pipe.transform('a', 'fullDate')).toBeNull();
		});

		test.each([undefined, null])('default format (%s)', format => {
			expect(pipe.transform(0, format)).toBe('01.01.1970');
		});

		test.each([
			{format: 'shortDate', timeFormat: null, expected: '01.01.1970'},
			{format: 'mediumDate', timeFormat: null, expected: '1 Jan 1970'},
			{format: 'longDate', timeFormat: null, expected: '1 January 1970'},
			{format: 'fullDate', timeFormat: null, expected: 'Thursday, 1 January 1970'},
			{format: 'shortDate', timeFormat: 'shortTime', expected: '01.01.1970, 01:00'},
			{format: 'mediumDate', timeFormat: 'mediumTime', expected: '1 Jan 1970, 01:00:00'},
			{format: 'longDate', timeFormat: 'longTime', expected: '1 January 1970 at 01:00:00.000'},
			{format: 'fullDate', timeFormat: 'shortTime', expected: 'Thursday, 1 January 1970 at 01:00'},
			{format: 'shortTime', timeFormat: null, expected: '01:00'},
			{format: 'mediumTime', timeFormat: null, expected: '01:00:00'},
			{format: 'longTime', timeFormat: null, expected: '01:00:00.000'},
		] as {format: ObDateFormat; timeFormat?: ObTimeFormat; expected: string}[])(
			`format: $format, timeFormat: $timeFormat`,
			({format, timeFormat, expected}) => {
				expect(pipe.transform(0, format, timeFormat)).toBe(expected);
			}
		);
	});
});
