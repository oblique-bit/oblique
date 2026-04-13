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

	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should subscribe on locale change', () => {
		expect(language.locale$.subscribe).toHaveBeenCalled();
	});

	describe('transform', () => {
		it('should throw an error with given illegal value', () => {
			expect(() => pipe.transform('a')).toThrow();
		});

		it('should return a datetime with no format', () => {
			// Jenkins is in UTC, therefore a timezone has to be given
			expect(pipe.transform(0, undefined, '+1')).toBe('1/1/70 1:00:00 AM');
		});

		it('should accept regular angular format as 1st parameter', () => {
			expect(pipe.transform(0, 'shortDate')).toBe('1/1/70');
		});

		it('should accept a timezone as 2nd parameter', () => {
			expect(pipe.transform(0, 'shortTime', '+2')).toBe('2:00 AM');
		});
	});
});
