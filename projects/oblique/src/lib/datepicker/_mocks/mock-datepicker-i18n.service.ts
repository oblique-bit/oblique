import {Injectable} from '@angular/core';
import {NgbDatepickerI18n, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class ObMockDatepickerI18nService extends NgbDatepickerI18n {
	getDayAriaLabel(date: NgbDateStruct): string {
		return '';
	}

	getMonthFullName(month: number, year?: number): string {
		return '';
	}

	getMonthShortName(month: number, year?: number): string {
		return '';
	}

	getWeekdayLabel(weekday: number): string {
		return '';
	}
}
