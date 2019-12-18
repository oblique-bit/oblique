import {Injectable} from '@angular/core';
import {DatepickerOptions} from '../datepicker-config.service';

@Injectable()
export class MockDatepickerConfigService {
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
