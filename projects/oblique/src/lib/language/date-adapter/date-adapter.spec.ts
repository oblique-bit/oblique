import {TestBed} from '@angular/core/testing';
import {LOCALE_ID} from '@angular/core';
import {ObDateAdapter} from './date-adapter';
import {NativeDateAdapter} from '@angular/material/core';
import * as formatters from './date-formatters';
import * as parsers from './date-parsers';
import {obFormatDatetime} from './date-formatters';
import {obParseDateTime} from './date-parsers';
import {ObDateTimeFormat, ObFormat} from './date.model';

describe(ObDateAdapter.name, () => {
	let adapter: ObDateAdapter;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObDateAdapter, {provide: LOCALE_ID, useValue: 'en-US'}],
		});

		adapter = TestBed.inject(ObDateAdapter);
		jest.clearAllMocks();
	});

	test('instance of NativeDateAdapter', () => {
		expect(adapter instanceof NativeDateAdapter).toBe(true);
	});

	describe(ObDateAdapter.prototype.format.name, () => {
		test.each([
			{format: 'longDate', expectedFormat: {date: 'longDate'}, expectedDate: '1 January 2020'},
			{format: 'shortTime', expectedFormat: {time: 'shortTime'}, expectedDate: '13:35'},
		] as {
			format: ObDateTimeFormat;
			expectedFormat: ObFormat;
			expectedDate: string;
		}[])('$format', ({format, expectedFormat, expectedDate}) => {
			jest.spyOn(formatters, 'obFormatDatetime');
			const date = new Date('2020-01-01T12:35:06.728Z');

			const result = adapter.format(date, format);

			expect(obFormatDatetime).toHaveBeenCalledWith(date, 'en-US', expectedFormat);
			expect(result).toBe(expectedDate);
		});
	});

	describe(ObDateAdapter.prototype.parse.name, () => {
		test('valid format with string date', () => {
			jest.spyOn(parsers, 'obParseDateTime');
			const date = '2020-01-01';

			const result = adapter.parse(date);

			expect(obParseDateTime).toHaveBeenCalledWith(date);
			expect(result.getUTCFullYear()).toBe(2019);
			expect(result.getUTCMonth()).toBe(11);
			expect(result.getUTCDate()).toBe(31);
			expect(result.getUTCHours()).toBe(23);
			expect(result.getUTCMinutes()).toBe(0);
			expect(result.getUTCSeconds()).toBe(0);
			expect(result.getUTCMilliseconds()).toBe(0);
		});
	});

	describe(ObDateAdapter.prototype.parseTime.name, () => {
		test('valid format with string time', () => {
			jest.spyOn(parsers, 'obParseDateTime');
			const date = new Date();
			date.setHours(12, 34, 0, 0);

			const result = adapter.parseTime('12:34');

			expect(obParseDateTime).toHaveBeenCalledWith('12:34');
			expect(result.getUTCFullYear()).toBe(1970);
			expect(result.getUTCMonth()).toBe(0);
			expect(result.getUTCDate()).toBe(1);
			expect(result.getUTCHours()).toBe(11);
			expect(result.getUTCMinutes()).toBe(34);
			expect(result.getUTCSeconds()).toBe(0);
			expect(result.getUTCMilliseconds()).toBe(0);
		});
	});
});
