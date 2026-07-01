export type ObDateFormat =
	'isoDate' | 'fullDate' | 'longDate' | 'mediumDate' | 'shortDate' | 'longMonthYear' | 'mediumMonthYear' | 'longMonth';
export type ObTimeFormat = 'longTime' | 'mediumTime' | 'shortTime';
export type ObDateTimeFormat = ObDateFormat | ObTimeFormat;
export type ObDateValue = Date | number | string | null | undefined;
export interface ObDateParts {
	year: number;
	month: number;
	day: number;
}
export interface ObTimeParts {
	hours: number;
	minutes: number;
	seconds: number;
	milliseconds: number;
}
export type ObDateTimeParts =
	| 'weekday'
	| 'day'
	| 'month'
	| 'year'
	| 'hour'
	| 'minute'
	| 'second'
	| 'fractionalSecond'
	| 'daySeparator'
	| 'timeSeparator'
	| 'millisSeparator';
export interface ObFormat {
	date?: ObDateFormat;
	time?: ObTimeFormat;
}
