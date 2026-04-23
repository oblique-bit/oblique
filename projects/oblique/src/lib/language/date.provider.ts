import {Provider} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core';
import {matDateFormats} from './date-adapter/date-formats';
import {ObDateAdapter} from './date-adapter/date-adapter';

export function obProvideDate(): Provider[] {
	return [
		{provide: MAT_DATE_FORMATS, useValue: matDateFormats},
		{provide: DateAdapter, useClass: ObDateAdapter},
	];
}
