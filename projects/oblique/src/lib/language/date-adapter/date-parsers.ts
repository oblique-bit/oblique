import {ObDateParts, ObDateValue, ObTimeParts} from './date.model';
import {swissTimezone} from './date-formats';

// 4 digits
// dash
// 0 followed by 1-9 OR 1 followed by 0-2
// dash
// 0 followed by 1-9 OR 1-2 followed by a digit OR 3 followed by 0-1
const isoDateRegexp = /(?<year>\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\d|3[01])/u;
// 0 followed by 1-9 OR 1-9 OR 1-2 followed by 1 digit OR 3 followed by 0-1
// dash OR dot OR slash OR whitespace
// 0 followed by 1-9 OR 1-9 OR 1 followed by 0-2
// dash OR dot OR slash OR whitespace
// 4 digits OR 2 digits
const swissDateRegexp = /(?<day>0?[1-9]|[12]\d|3[01])[.\-\s/](?<month>0?[1-9]|1[0-2])[.\-\s/](?<year>\d{2,4})/u;
// 0-1 followed by 1 digit OR 1 digit OR 2 followed by 0-3
// colon
// 0-5 followed by 1 digit OR 1 digit
// optional
//  colon
//  0-5 followed by 1 digit OR 1 digit
//  optional
//    dot
//    between 1 and 4 digits
//  optional
//    + OR -
//    4 digits with an optional colon in the middle
const timeRegexp =
	/(?<hours>[01]?\d|2[0-3]):(?<minutes>[0-5]?\d)(?::(?<seconds>[0-5]?\d)(?:\.(?<milliseconds>\d{1,4}))?)?(?<timezone>Z|[+-]\d\d:?\d\d)?$/u;
const timezoneRegexp = /(?<sign>[+-])(?<hours>\d\d):?(?<minutes>\d\d)/u;
const validSwissDate = /(?:0?[1-9]|[12]\d|3[01])[.\-\s/](?:0?[1-9]|1[0-2])[.\-\s/](?:\d{2}|\d{4})/u.source;
const validIsoDate = /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])/u.source;
const validTime = /(?:[01]?\d|2[0-3]):[0-5]?\d(?::[0-5]?\d(?:\.\d{1,4})?)?(?:Z|[+-]\d\d:?\d\d)?/u.source;
// validSwissDate
// validSwissDate validTime
// validIsoDate
// validIsoDateTvalidTime
// validTime
const validDatetime = new RegExp(
	`^(?:(?:${validSwissDate}(?: ${validTime})?)|(?:${validIsoDate}(?:T${validTime})?)|(?:${validTime}))$`,
	'u'
);

const MILLISECONDS_PER_HOUR = 3_600_000;
const MILLISECONDS_PER_MINUTE = 60_000;

/**
 * Parses a date-time value (Date, number, or string) into a `Date`.
 *
 * Supported string formats:
 * - ISO: `YYYY-MM-DD[THH:mm[:ss[.SSS]][±HHMM]]`
 * - Swiss: `DD.MM.YYYY`, `DD-MM-YYYY`, `DD/MM/YYYY`, `DD MM YYYY`
 *   with optional time: `[ HH:mm[:ss[.SSS]][±HHMM]]`
 *
 * Swiss two-digit years are interpreted as:
 * - 00–69 → 2000–2069
 * - 70–99 → 1970–1999
 *
 * If no timezone is provided, `Europe/Zurich` is assumed.
 *
 * @param datetime - Input value to parse
 * @returns A `Date` representing the calendar date and time or `null` if the input is invalid.
 */
export function obParseDateTime(datetime: ObDateValue): Date | null {
	if (datetime === null || datetime === undefined) {
		return null;
	}

	if (datetime instanceof Date) {
		return isNaN(datetime.getTime()) ? null : datetime;
	}

	if (typeof datetime === 'number') {
		const date = new Date(datetime);
		return isNaN(date.getTime()) ? null : date;
	}

	if (!validDatetime.test(datetime)) {
		return null;
	}

	return stringToDate(datetime);
}

function stringToDate(datetime: string): Date | null {
	const date = isoDateRegexp.exec(datetime) ?? swissDateRegexp.exec(datetime);
	const time = timeRegexp.exec(datetime);

	const datetimeParts = {
		...parseDateParts(date?.groups),
		...parseTimeParts(time?.groups),
	};
	return buildUTCDate(datetimeParts, time?.groups.timezone);
}

function parseDateParts(groups: Record<string, string> | null): ObDateParts {
	return {
		year: Number(groups?.year ?? 1970),
		month: Number(groups?.month ?? 1),
		day: Number(groups?.day ?? 1),
	};
}

function parseTimeParts(groups: Record<string, string> | null): ObTimeParts {
	return {
		hours: Number(groups?.hours ?? 0),
		minutes: Number(groups?.minutes ?? 0),
		seconds: Number(groups?.seconds ?? 0),
		milliseconds: Number(groups?.milliseconds ?? 0),
	};
}

function buildUTCDate(
	{year, month, day, hours, minutes, seconds, milliseconds}: ObDateParts & ObTimeParts,
	timezone: string | undefined
): Date | null {
	const fullYear = computeFullYear(year);
	if (!isDateValid(fullYear, month, day)) {
		return null;
	}

	const timestamp = Date.UTC(fullYear, month - 1, day, hours, minutes, seconds, milliseconds);
	const offset = computeTimezoneOffset(timezone, timestamp);
	return new Date(timestamp - offset);
}

function computeFullYear(year: number): number {
	if (year < 70) {
		return 2000 + year;
	}
	return year < 100 ? 1900 + year : year;
}

function isDateValid(year: number, month: number, day: number): boolean {
	// other potential errors are already caught by the regexp
	const daysInMonth = [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	return day <= daysInMonth[month - 1];
}

function isLeapYear(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function computeTimezoneOffset(timezone: string | undefined, timestamp: number): number {
	if (timezone === 'Z') {
		return 0;
	}
	const {sign, hours, minutes} = timezoneRegexp.exec(timezone ?? getTimeZoneString(new Date(timestamp))).groups;
	const signValue = sign === '+' ? 1 : -1;
	return signValue * (Number(hours) * MILLISECONDS_PER_HOUR + Number(minutes) * MILLISECONDS_PER_MINUTE);
}

function getTimeZoneString(date: Date): string {
	return new Intl.DateTimeFormat('en', {
		timeZone: swissTimezone,
		timeZoneName: 'longOffset',
	})
		.formatToParts(date)
		.find(part => part.type === 'timeZoneName').value;
}
