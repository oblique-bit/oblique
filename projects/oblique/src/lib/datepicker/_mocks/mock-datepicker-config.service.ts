import {Injectable} from '@angular/core';
import {ObIDatepickerOptions} from '../datepicker.model';

@Injectable()
export class ObMockDatepickerConfigService {
	options: ObIDatepickerOptions = {
		displayMonths: 1,
		firstDayOfWeek: 1,
		navigation: 'select',
		outsideDays: 'visible',
		appendToBody: true,
		weekdays: false,
		showWeekNumbers: false,
		icon: 'fa-calendar-alt'
	};
}
