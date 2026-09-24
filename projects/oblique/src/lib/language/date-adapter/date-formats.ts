import {ObDateTimeFormat} from './date.model';

export const swissTimezone = 'Europe/Zurich';

export const matDateFormats = {
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
} as const;

export const obDateTimeFormats: Record<ObDateTimeFormat, Intl.DateTimeFormatOptions> = {
	isoDate: {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	},
	shortDate: {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	},
	mediumDate: {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	},
	longDate: {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	},
	fullDate: {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		weekday: 'long',
	},
	mediumMonthYear: {
		month: 'short',
		year: 'numeric',
	},
	longMonth: {
		month: 'long',
	},
	longMonthYear: {
		month: 'long',
		year: 'numeric',
	},
	shortTime: {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	},
	mediumTime: {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	},
	longTime: {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		fractionalSecondDigits: 3,
		hour12: false,
	},
} as const;
