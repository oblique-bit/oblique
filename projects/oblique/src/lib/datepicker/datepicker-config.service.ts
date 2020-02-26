import {Injectable} from '@angular/core';

export interface ObIDatepickerOptions {
	displayMonths: number;
	firstDayOfWeek: 1;
	navigation: 'select' | 'arrows' | 'none';
	outsideDays: 'visible' | 'hidden' | 'none';
	appendToBody: boolean;
	showWeekdays: boolean;
	showWeekNumbers: boolean;
	icon: string;
}

@Injectable({
	providedIn: 'root'
})
export class ObDatepickerConfigService {
	options: ObIDatepickerOptions = {
		displayMonths: 1,
		firstDayOfWeek: 1,
		navigation: 'select',
		outsideDays: 'visible',
		appendToBody: true,
		showWeekdays: false,
		showWeekNumbers: false,
		icon: 'fa-calendar-alt'
	};
}
