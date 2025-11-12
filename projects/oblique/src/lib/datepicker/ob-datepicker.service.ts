import {Injectable} from '@angular/core';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class ObDatepickerIntlService extends MatDatepickerIntl {
	constructor(private readonly translateService: TranslateService) {
		super();
		this.initTranslation();
	}

	private initTranslation(): void {
		this.translateService
			.stream([
				'i18n.datepicker.calender.label',
				'i18n.datepicker.open-calender.label',
				'i18n.datepicker.close-calender.label',
				'i18n.datepicker.prev-month.label',
				'i18n.datepicker.next-month.label',
				'i18n.datepicker.prev-year.label',
				'i18n.datepicker.next-year.label',
				'i18n.datepicker.prev-multi-year.label',
				'i18n.datepicker.next-multi-year.label',
				'i18n.datepicker.switch-to-month-view.label',
				'i18n.datepicker.switch-to-multi-year-view.label',
				'i18n.datepicker.comparison-date.label',
			])
			.subscribe(translation => {
				this.calendarLabel = translation['i18n.datepicker.calender.label'];
				this.openCalendarLabel = translation['i18n.datepicker.open-calender.label'];
				this.closeCalendarLabel = translation['i18n.datepicker.close-calender.label'];
				this.prevMonthLabel = translation['i18n.datepicker.prev-month.label'];
				this.nextMonthLabel = translation['i18n.datepicker.next-month.label'];
				this.prevYearLabel = translation['i18n.datepicker.prev-year.label'];
				this.nextYearLabel = translation['i18n.datepicker.next-year.label'];
				this.prevMultiYearLabel = translation['i18n.datepicker.prev-multi-year.label'];
				this.nextMultiYearLabel = translation['i18n.datepicker.next-multi-year.label'];
				this.switchToMonthViewLabel = translation['i18n.datepicker.switch-to-month-view.label'];
				this.switchToMultiYearViewLabel = translation['i18n.datepicker.switch-to-multi-year-view.label'];
				this.comparisonDateLabel = translation['i18n.datepicker.comparison-date.label'];
				this.changes.next();
			});
	}
}
