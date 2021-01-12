import {Component} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ObMasterLayoutService, ObThemeService} from 'oblique';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-datepicker-sample',
	templateUrl: './datepicker-sample.component.html'
})
export class ObDatepickerSampleComponent {
	material: Observable<boolean>;

	isDatepickerDisabled = true;
	minDate: NgbDateStruct;
	maxDate: NgbDateStruct;

	model: any = {
		date: undefined,
		range: {}
	};

	constructor(masterLayout: ObMasterLayoutService, theme: ObThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
		const today = new Date();
		this.minDate = ObDatepickerSampleComponent.dateToNgbDateStruct(new Date(new Date().setDate(today.getDate() - 7)));
		this.maxDate = ObDatepickerSampleComponent.dateToNgbDateStruct(new Date(new Date().setDate(today.getDate() + 7)));
	}

	setToday() {
		this.model.date = ObDatepickerSampleComponent.dateToNgbDateStruct(new Date());
	}

	min() {
		const underMinDate = ObDatepickerSampleComponent.ngbDateStructToDate(this.minDate);
		underMinDate.setDate(underMinDate.getDate() - 1);
		this.model.minMax = ObDatepickerSampleComponent.dateToNgbDateStruct(underMinDate);
	}

	max() {
		const overMaxDate = ObDatepickerSampleComponent.ngbDateStructToDate(this.maxDate);
		overMaxDate.setDate(overMaxDate.getDate() + 1);
		this.model.minMax = ObDatepickerSampleComponent.dateToNgbDateStruct(overMaxDate);
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
