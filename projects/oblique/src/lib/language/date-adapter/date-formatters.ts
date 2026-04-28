import {obDateTimeFormats, swissTimezone} from './date-formats';
import {ObDateTimeFormat, ObDateTimeParts, ObDateValue, ObFormat, ObTimeFormat} from './date.model';
import {obParseDateTime} from './date-parsers';

/**
 * Formats a date/time value into a Swiss-style formatted string using Intl formatting rules.
 *
 * Formatting is based on locale-aware `Intl.DateTimeFormat`, but the output is normalized
 * into a Swiss-like order (day → month → year → time components) regardless of locale.
 *
 * Supported format presets are defined in `obDateTimeFormats`.
 *
 * If neither format nor timeFormat are provided, 'shortDate' is assumed.
 *
 * @param date - The date value to format (Date, timestamp, or string)
 * @param locale - BCP 47 locale string used for Intl formatting (e.g. `de-CH`, `en-US`)
 * @param formats - formats for date and time
 * @returns Formatted date string, or `null` if the input date is invalid or cannot be parsed
 */
export function obFormatDatetime(date: ObDateValue, locale: string, formats: ObFormat): string | null {
	const dateTime = obParseDateTime(date);
	if (!dateTime) {
		return null;
	}
	const timeFormat = formats.time;
	const dateFormat = formats.date ?? (timeFormat ? undefined : 'shortDate');
	const parts = getParts(dateTime, locale, dateFormat, timeFormat);
	return [mergeParts(dateFormat, parts), mergeParts(timeFormat, parts)].filter(Boolean).join(parts.timeSeparator);
}

function getParts(
	date: Date,
	locale: string,
	format: ObDateTimeFormat,
	timeFormat?: ObTimeFormat
): Record<ObDateTimeParts, string> {
	const options = mergeFormats(format, timeFormat);
	const parts = new Intl.DateTimeFormat(locale, options).formatToParts(date);

	return {
		...(Object.fromEntries(parts.map(({type, value}) => [type, value])) as Record<ObDateTimeParts, string>),
		daySeparator: getDaySeparator(parts),
		timeSeparator: getTimeSeparator(parts, format === 'isoDate'),
		millisSeparator: getMillisSeparator(parts),
	};
}

function getDaySeparator(parts: Intl.DateTimeFormatPart[]): string | undefined {
	const index = parts.findIndex(part => part.type === 'day');
	const separator = parts[index + 1].value;
	return separator === ', ' ? ' ' : separator;
}

function getTimeSeparator(parts: Intl.DateTimeFormatPart[], isIso: boolean): string | undefined {
	const index = parts.findIndex(part => part.type === 'hour');
	const separator = parts[index - 1]?.value;
	return isIso ? 'T' : separator;
}

function getMillisSeparator(parts: Intl.DateTimeFormatPart[]): string | undefined {
	const index = parts.findIndex(part => part.type === 'fractionalSecond');
	return parts[index - 1]?.value;
}

function mergeFormats(format: ObDateTimeFormat, timeFormat?: ObTimeFormat): Intl.DateTimeFormatOptions {
	const timezoneFormat = {...obDateTimeFormats[format], timeZone: swissTimezone};

	return timeFormat ? {...timezoneFormat, ...obDateTimeFormats[timeFormat]} : timezoneFormat;
}

function mergeParts(
	format: ObDateTimeFormat | null | undefined,
	parts: Record<ObDateTimeParts, string>
): string | null {
	switch (format) {
		case 'isoDate':
			return `${parts.year}-${parts.month}-${parts.day}`;
		case 'shortDate':
			return `${parts.day}.${parts.month}.${parts.year}`;
		case 'mediumDate':
		case 'longDate':
			return `${parts.day}${parts.daySeparator}${parts.month} ${parts.year}`;
		case 'fullDate':
			return `${parts.weekday}, ${parts.day}${parts.daySeparator}${parts.month} ${parts.year}`;
		case 'longMonth':
			return parts.month;
		case 'mediumMonthYear':
		case 'longMonthYear':
			return `${parts.month} ${parts.year}`;
		case 'shortTime':
			return `${parts.hour}:${parts.minute}`;
		case 'mediumTime':
			return `${parts.hour}:${parts.minute}:${parts.second}`;
		case 'longTime':
			return `${parts.hour}:${parts.minute}:${parts.second}${parts.millisSeparator}${parts.fractionalSecond}`;
		case undefined:
		case null:
			return null;
	}
}
