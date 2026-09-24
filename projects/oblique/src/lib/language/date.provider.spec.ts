import {TestBed} from '@angular/core/testing';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {ObDateAdapter} from './date-adapter/date-adapter';
import {obProvideDate} from './date.provider';

describe('date', () => {
	describe(obProvideDate.name, () => {
		beforeEach(() => {
			TestBed.configureTestingModule({providers: [obProvideDate()]});
		});

		test('DateAdapter', () => {
			expect(TestBed.inject(DateAdapter) instanceof ObDateAdapter).toBe(true);
		});

		test('MAT_DATE_FORMATS', () => {
			expect(TestBed.inject(MAT_DATE_FORMATS)).toEqual({
				parse: {timeInput: 'shortTime'},
				display: {
					dateInput: 'shortDate',
					monthLabel: 'longMonth',
					monthYearLabel: 'mediumMonthYear',
					dateA11yLabel: 'longDate',
					monthYearA11yLabel: 'longMonthYear',
					timeInput: 'shortTime',
					timeOptionLabel: 'shortTime',
				},
			});
		});
	});
});
