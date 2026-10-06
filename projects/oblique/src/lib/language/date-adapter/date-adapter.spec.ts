import {TestBed} from '@angular/core/testing';
import {LOCALE_ID} from '@angular/core';
import {ObDateAdapter} from './date-adapter';
import {NativeDateAdapter} from '@angular/material/core';
import {ObDateTimeFormat} from './date.model';

describe(ObDateAdapter.name, () => {
	let adapter: ObDateAdapter;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ObDateAdapter, {provide: LOCALE_ID, useValue: 'en-US'}],
		});

		adapter = TestBed.inject(ObDateAdapter);
	});

	test('instance of NativeDateAdapter', () => {
		expect(adapter instanceof NativeDateAdapter).toBe(true);
	});

	describe(ObDateAdapter.prototype.format.name, () => {
		test.each([
			{format: 'longDate', expectedDate: '1 January 2020'},
			{format: 'shortTime', expectedDate: '13:35'},
		] as {format: ObDateTimeFormat; expectedDate: string}[])('$format', ({format, expectedDate}) => {
			const date = new Date('2020-01-01T12:35:06.728Z');

			expect(adapter.format(date, format)).toBe(expectedDate);
		});
	});

	describe(ObDateAdapter.prototype.parse.name, () => {
		test('valid format with string date', () => {
			const result = adapter.parse('2020-01-01');

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
			const result = adapter.parseTime('12:34');

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
