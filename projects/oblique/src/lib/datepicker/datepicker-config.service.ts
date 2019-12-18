import {Injectable} from '@angular/core';

export interface DatepickerOptions {
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
export class DatepickerConfigService {
	options: DatepickerOptions = {
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
