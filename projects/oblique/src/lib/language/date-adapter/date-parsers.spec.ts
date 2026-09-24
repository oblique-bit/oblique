import {obParseDateTime} from './date-parsers';

describe(obParseDateTime.name, () => {
	describe('valid local datetime', () => {
		test.each([
			{input: '2026-04-03', expected: {day: 2, hours: 22, minutes: 0, seconds: 0, millis: 0}},
			{input: '2026-04-03T12:34', expected: {day: 3, hours: 10, minutes: 34, seconds: 0, millis: 0}},
			{input: '2026-04-03T12:34:25', expected: {day: 3, hours: 10, minutes: 34, seconds: 25, millis: 0}},
			{input: '2026-04-03T12:34:25.667', expected: {day: 3, hours: 10, minutes: 34, seconds: 25, millis: 667}},
			{input: '3.4.2026', expected: {day: 2, hours: 22, minutes: 0, seconds: 0, millis: 0}},
			{input: '3 4 2026 12:34', expected: {day: 3, hours: 10, minutes: 34, seconds: 0, millis: 0}},
			{input: '3-4-2026 12:34:25', expected: {day: 3, hours: 10, minutes: 34, seconds: 25, millis: 0}},
			{input: '3/4/2026 12:34:25.667', expected: {day: 3, hours: 10, minutes: 34, seconds: 25, millis: 667}},
			{input: '03.04.2026', expected: {day: 2, hours: 22, minutes: 0, seconds: 0, millis: 0}},
			{input: '03.04.00', expected: {year: 2000, day: 2, hours: 22, minutes: 0, seconds: 0, millis: 0}},
			{input: '03.04.69', expected: {year: 2069, day: 2, hours: 22, minutes: 0, seconds: 0, millis: 0}},
			{input: '03.04.70', expected: {year: 1970, day: 2, hours: 23, minutes: 0, seconds: 0, millis: 0}},
			{input: '03.04.80', expected: {year: 1980, day: 2, hours: 23, minutes: 0, seconds: 0, millis: 0}},
			// Switzerland introduced daylight saving time in 1981, increasing the time offset
			{input: '03.04.81', expected: {year: 1981, day: 2, hours: 22, minutes: 0, seconds: 0, millis: 0}},
			{input: '03.04.99', expected: {year: 1999, day: 2, hours: 22, minutes: 0, seconds: 0, millis: 0}},
		])(`$input`, ({input, expected}) => {
			const date = obParseDateTime(input);
			expect(date.getUTCFullYear()).toBe(expected.year ?? 2026);
			expect(date.getUTCMonth()).toBe(3);
			expect(date.getUTCDate()).toBe(expected.day);
			expect(date.getUTCHours()).toBe(expected.hours);
			expect(date.getUTCMinutes()).toBe(expected.minutes);
			expect(date.getUTCSeconds()).toBe(expected.seconds);
			expect(date.getUTCMilliseconds()).toBe(expected.millis);
		});

		test.each([
			{input: '12:34', expected: {hours: 11, minutes: 34, seconds: 0, millis: 0}},
			{input: '12:34:25', expected: {hours: 11, minutes: 34, seconds: 25, millis: 0}},
			{input: '12:34:25.667', expected: {hours: 11, minutes: 34, seconds: 25, millis: 667}},
			{input: '5:4', expected: {hours: 4, minutes: 4, seconds: 0, millis: 0}},
			{input: '5:4:2', expected: {hours: 4, minutes: 4, seconds: 2, millis: 0}},
			{input: '5:4:2.6', expected: {hours: 4, minutes: 4, seconds: 2, millis: 6}},
		])(`$input`, ({input, expected}) => {
			const date = obParseDateTime(input);
			expect(date.getUTCFullYear()).toBe(1970);
			expect(date.getUTCMonth()).toBe(0);
			expect(date.getUTCDate()).toBe(1);
			expect(date.getUTCHours()).toBe(expected.hours);
			expect(date.getUTCMinutes()).toBe(expected.minutes);
			expect(date.getUTCSeconds()).toBe(expected.seconds);
			expect(date.getUTCMilliseconds()).toBe(expected.millis);
		});
	});

	describe('valid UTC datetime', () => {
		test.each([
			{input: '2026-04-03T12:34-03:00', expected: {hours: 15, minutes: 34, seconds: 0, millis: 0}},
			{input: '2026-04-03T12:34:25+03:00', expected: {hours: 9, minutes: 34, seconds: 25, millis: 0}},
			{input: '2026-04-03T12:34:25.667-03:30', expected: {hours: 16, minutes: 4, seconds: 25, millis: 667}},
			{input: '2026-04-03T12:34:25.667Z', expected: {hours: 12, minutes: 34, seconds: 25, millis: 667}},
			{input: '3 4 2026 12:34Z', expected: {hours: 12, minutes: 34, seconds: 0, millis: 0}},
			{input: '3 4 2026 12:34+0300', expected: {hours: 9, minutes: 34, seconds: 0, millis: 0}},
			{input: '3-4-2026 12:34:25+03:30', expected: {hours: 9, minutes: 4, seconds: 25, millis: 0}},
			{input: '3/4/2026 12:34:25.667-0300', expected: {hours: 15, minutes: 34, seconds: 25, millis: 667}},
		])(`valid UTC datetime ($input)`, ({input, expected}) => {
			const date = obParseDateTime(input);
			expect(date.getUTCFullYear()).toBe(2026);
			expect(date.getUTCMonth()).toBe(3);
			expect(date.getUTCDate()).toBe(3);
			expect(date.getUTCHours()).toBe(expected.hours);
			expect(date.getUTCMinutes()).toBe(expected.minutes);
			expect(date.getUTCSeconds()).toBe(expected.seconds);
			expect(date.getUTCMilliseconds()).toBe(expected.millis);
		});

		test.each([
			{input: '12:34Z', expected: {hours: 12, minutes: 34, seconds: 0, millis: 0}},
			{input: '12:34+03:00', expected: {hours: 9, minutes: 34, seconds: 0, millis: 0}},
			{input: '12:34:25-0300', expected: {hours: 15, minutes: 34, seconds: 25, millis: 0}},
			{input: '12:34:25.667+0300', expected: {hours: 9, minutes: 34, seconds: 25, millis: 667}},
			{input: '5:4Z', expected: {hours: 5, minutes: 4, seconds: 0, millis: 0}},
			{input: '5:4+03:00', expected: {hours: 2, minutes: 4, seconds: 0, millis: 0}},
			{input: '5:4:2-0300', expected: {hours: 8, minutes: 4, seconds: 2, millis: 0}},
			{input: '5:4:2.6+0300', expected: {hours: 2, minutes: 4, seconds: 2, millis: 6}},
		])(`valid UTC datetime ($input)`, ({input, expected}) => {
			const date = obParseDateTime(input);
			expect(date.getUTCFullYear()).toBe(1970);
			expect(date.getUTCMonth()).toBe(0);
			expect(date.getUTCDate()).toBe(1);
			expect(date.getUTCHours()).toBe(expected.hours);
			expect(date.getUTCMinutes()).toBe(expected.minutes);
			expect(date.getUTCSeconds()).toBe(expected.seconds);
			expect(date.getUTCMilliseconds()).toBe(expected.millis);
		});
	});

	describe('invalid datetime', () => {
		test.each([
			'2026-04-00', // 00 is not a valid day
			'2026-04-32', // 32 is not a valid day
			'2026-02-30', // 30 is not a valid day for February
			'2026-04-31', // 31 is not a valid day for March
			'2026-14-01', // 14 is not a valid month
			'2026-00-01', // 00 is not a valid month
			'2026-02-29', // 2026 is not a leap year
			'00.04.2026', // 00 is not a valid day
			'32.04.2026', // 32 is not a valid day
			'30.02.2026', // 30 is not a valid day for February
			'31.04.2026', // 31 is not a valid day for March
			'01.14.2026', // 14 is not a valid month
			'29.02.2026', // 2026 is not a leap year
			'2026-04-23 25:34', // invalid time
			'25:34', // 25 is not valid hours
			'12:60', // 60 is no valid minutes
			'12:34:60', // 60 is no valid seconds
			// invalid dates
			'asdf2026-4-20',
			'2026-4-20asdf',
			'2026-4-20 ',
			'2026-04-2 ',
			'2026-04-23 ',
			'2026-04-23T',
			'2026-04-23+03:00',
			'2026-04-23 12:34',
			'2026-04-23S12:34',
			'23.04.2026asdf',
			'asdf23.04.2026',
			'23.04.2026T',
			'23.04.2026 ',
			'23.04.202',
			// invalid times
			'12',
			'1234',
			'12 34',
			'T12:34',
			'asdf12:34',
			'12:34asdf',
			'12:34:25:667',
			'12:34:25.667+0',
			'12:34:25.667+00',
			'12:34:25.667+000',
			'12:34:25.667+00000',
			'12:34:25.667+00:000',
			'12:34:25.99999',
			// invalid datetime
			'23.04.2026+03:00',
			'23.04.2026T12:34',
			// gibberish input
			'asdf',
			'',
			null,
			undefined,
			new Date('asdf'),
			parseInt('asdf', 10),
		])('%s', time => {
			expect(obParseDateTime(time)).toBeNull();
		});
	});
});
