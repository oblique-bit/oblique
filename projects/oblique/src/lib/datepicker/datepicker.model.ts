import {TranslationWidth} from '@angular/common';

export interface ObIDatepickerOptions {
	displayMonths: number;
	firstDayOfWeek: 1;
	navigation: 'select' | 'arrows' | 'none';
	outsideDays: 'visible' | 'hidden' | 'none';
	appendToBody: boolean;
	weekdays: boolean | TranslationWidth;
	showWeekNumbers: boolean;
	icon: string;
}
