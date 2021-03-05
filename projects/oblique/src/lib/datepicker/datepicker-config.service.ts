import {Injectable} from '@angular/core';
import {ObIDatepickerOptions} from './datepicker.model';

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
