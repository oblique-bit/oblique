import {Injectable} from '@angular/core';
import {ObIDatepickerOptions} from '../datepicker-config.service';

@Injectable()
export class ObMockDatepickerConfigService {
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
