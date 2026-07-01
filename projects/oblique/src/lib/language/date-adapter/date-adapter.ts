import {Injectable} from '@angular/core';
import {NativeDateAdapter} from '@angular/material/core';
import {ObDateTimeFormat, ObDateValue, ObFormat, ObTimeFormat} from './date.model';
import {obFormatDatetime} from './date-formatters';
import {obParseDateTime} from './date-parsers';

@Injectable()
export class ObDateAdapter extends NativeDateAdapter {
	private readonly timeFormats: ObTimeFormat[] = ['shortTime', 'mediumTime', 'longTime'] as const;

	override format(date: Date, displayFormat: ObDateTimeFormat): string {
		return obFormatDatetime(date, this.locale, this.buildFormat(displayFormat));
	}

	override parse(value: ObDateValue): Date | null {
		return obParseDateTime(value);
	}

	override parseTime(value: ObDateValue): Date | null {
		return obParseDateTime(value);
	}

	private buildFormat(displayFormat: ObDateTimeFormat): ObFormat {
		return this.isTimeFormat(displayFormat) ? {time: displayFormat} : {date: displayFormat};
	}

	private isTimeFormat(displayFormat: ObDateTimeFormat): displayFormat is ObTimeFormat {
		return this.timeFormats.includes(displayFormat as ObTimeFormat);
	}
}
