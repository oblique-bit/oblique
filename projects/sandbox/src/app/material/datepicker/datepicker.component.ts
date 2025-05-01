import {Component, type OnInit, inject} from '@angular/core';
import type {MatDatepickerInputEvent} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ReactiveFormsModule, UntypedFormBuilder, type UntypedFormGroup} from '@angular/forms';
import {ObDatepickerModule, ObErrorMessagesModule} from '@oblique/oblique';

@Component({
	selector: 'sb-datepicker',
	templateUrl: './datepicker.component.html',
	imports: [MatFormFieldModule, MatInputModule, ObDatepickerModule, ReactiveFormsModule, ObErrorMessagesModule]
})
export class DatepickerComponent implements OnInit {
	untypedForm: UntypedFormGroup;
	minFromDate: Date;
	maxFromDate: Date | null;

	minToDate: Date | null;
	maxToDate: Date;

	private readonly formBuilder = inject(UntypedFormBuilder);

	constructor() {
		this.minFromDate = new Date(1900, 0, 1);
		this.maxFromDate = new Date();

		this.minToDate = new Date(1900, 0, 1);
		this.maxToDate = new Date();
	}

	ngOnInit(): void {
		this.untypedForm = this.formBuilder.group({
			minMaxControl: [],
			filterControl: []
		});
	}

	toDateChange(type: string, event: MatDatepickerInputEvent<Date>): void {
		this.maxFromDate = event.value;

		if (event.value !== null) {
			this.minFromDate = new Date(event.value.getFullYear(), event.value.getMonth(), event.value.getDate() - 30);
		}
	}

	myFilter = (date: Date | null): boolean => {
		const day = (date || new Date()).getDay();
		// Prevent Saturday and Sunday from being selected.
		return day !== 0 && day !== 6;
	};
}
