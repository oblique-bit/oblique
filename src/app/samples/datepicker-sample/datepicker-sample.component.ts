import {Component} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {ObMasterLayoutService} from '@oblique/oblique';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ThemeService} from '../../common/theme.service';

@Component({
	selector: 'sc-datepicker-sample',
	templateUrl: './datepicker-sample.component.html'
})
export class DatepickerSampleComponent {
	material: Observable<boolean>;

	isDatepickerDisabled = true;
	minDate: NgbDateStruct;
	maxDate: NgbDateStruct;

	model: any = {
		date: undefined,
		range: {}
	};

	constructor(masterLayout: ObMasterLayoutService, theme: ThemeService) {
		this.material = theme.theme$.pipe(map(() => theme.isMaterial()));
		const today = new Date();
		this.minDate = DatepickerSampleComponent.dateToNgbDateStruct(new Date(new Date().setDate(today.getDate() - 7)));
		this.maxDate = DatepickerSampleComponent.dateToNgbDateStruct(new Date(new Date().setDate(today.getDate() + 7)));
	}

	setToday(): void {
		this.model.date = DatepickerSampleComponent.dateToNgbDateStruct(new Date());
	}

	min(): void {
		const underMinDate = DatepickerSampleComponent.ngbDateStructToDate(this.minDate);
		underMinDate.setDate(underMinDate.getDate() - 1);
		this.model.minMax = DatepickerSampleComponent.dateToNgbDateStruct(underMinDate);
	}

	max(): void {
		const overMaxDate = DatepickerSampleComponent.ngbDateStructToDate(this.maxDate);
		overMaxDate.setDate(overMaxDate.getDate() + 1);
		this.model.minMax = DatepickerSampleComponent.dateToNgbDateStruct(overMaxDate);
	}

	private static dateToNgbDateStruct(date: Date): NgbDateStruct {
		return {
			year: date.getFullYear(),
			month: date.getMonth() + 1,
			day: date.getDate()
		};
	}

	private static ngbDateStructToDate(dateStruct: NgbDateStruct): Date {
		return new Date(dateStruct.year, dateStruct.month - 1, dateStruct.day);
	}
}
