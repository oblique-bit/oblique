import {Component} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-datepicker',
	templateUrl: './datepicker-sample.component.html'
})
export class DatepickerSampleComponent {

	isDatepickerDisabled = true;
	minDate: NgbDateStruct;
	maxDate: NgbDateStruct;

	model: any = {
		date: undefined,
		range: {}
	};

	constructor() {
		const today = new Date();
		this.minDate = DatepickerSampleComponent.dateToNgbDateStruct(new Date(new Date().setDate(today.getDate() - 7)));
		this.maxDate = DatepickerSampleComponent.dateToNgbDateStruct(new Date(new Date().setDate(today.getDate() + 7)));
	}

	setToday() {
		this.model.date = DatepickerSampleComponent.dateToNgbDateStruct(new Date());
	}

	min() {
		const underMinDate = DatepickerSampleComponent.ngbDateStructToDate(this.minDate);
		underMinDate.setDate(underMinDate.getDate() - 1);
		this.model.minMax = DatepickerSampleComponent.dateToNgbDateStruct(underMinDate);
	}

	max() {
		const overMaxDate = DatepickerSampleComponent.ngbDateStructToDate(this.maxDate);
		overMaxDate.setDate(overMaxDate.getDate() + 1);
		this.model.minMax = DatepickerSampleComponent.dateToNgbDateStruct(overMaxDate);
	}

	private static dateToNgbDateStruct(date: Date) {
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
	}

	private static ngbDateStructToDate(dateStruct: NgbDateStruct) {
		return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
	}
}
