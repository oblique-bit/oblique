import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
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
		range: {}
	};

	@ViewChild(NgForm) form: NgForm;

	constructor() {
		let today = new Date();
		this.minDate = this.dateToNgbDateStruct(new Date(new Date().setDate(today.getDate() - 7)));
		this.maxDate = this.dateToNgbDateStruct(new Date(new Date().setDate(today.getDate() + 7)));
	}

	setToday() {
		this.model.date = this.dateToNgbDateStruct(new Date())
	}

	min() {
		//TODO should we set the control dirty?
		let underMinDate = this.ngbDateStructToDate(this.minDate);
		underMinDate.setDate(underMinDate.getDate() - 1);
		this.model.minMax = this.dateToNgbDateStruct(underMinDate);
	}

	max() {
		let overMaxDate = this.ngbDateStructToDate(this.maxDate);
		overMaxDate.setDate(overMaxDate.getDate() + 1);
		console.log(this.maxDate);
		this.model.minMax = this.dateToNgbDateStruct(overMaxDate);
	}

	private dateToNgbDateStruct(date: Date) {
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
	}

	private ngbDateStructToDate(dateStruct: NgbDateStruct) {
		return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
	}
}
