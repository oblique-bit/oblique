import {TestBed} from '@angular/core/testing';
import {ObDatePipe} from './date.pipe';
import {ObLanguageService} from './language.service';
import {of} from 'rxjs';

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
			expect(() => pipe.transform('a')).toThrow();
		});

		test('default format', () => {
			// Jenkins is in UTC, therefore a timezone has to be given
			expect(pipe.transform(0, undefined, '+1')).toBe('1/1/70 1:00:00 AM');
		});

		test.each([
			{format: 'shortDate', expected: '1/1/70'},
			{format: 'mediumDate', expected: 'Jan 1, 1970'},
			{format: 'longDate', expected: 'January 1, 1970'},
			{format: 'fullDate', expected: 'Thursday, January 1, 1970'},
		])('format: $format', ({format, expected}) => {
			expect(pipe.transform(0, format)).toBe(expected);
		});

		test('timezone', () => {
			expect(pipe.transform(0, 'shortTime', '+2')).toBe('2:00 AM');
		});
	});
});
