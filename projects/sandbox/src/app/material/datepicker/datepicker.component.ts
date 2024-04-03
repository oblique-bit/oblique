import {Component, OnInit, inject} from '@angular/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {DateAdapter, MatNativeDateModule} from '@angular/material/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {ObErrorMessagesModule} from '@oblique/oblique';

@Component({
	selector: 'sb-datepicker',
	templateUrl: './datepicker.component.html',
	standalone: true,
	imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, ObErrorMessagesModule]
})
export class DatepickerComponent implements OnInit {
	untypedForm: UntypedFormGroup;
	minFromDate: Date;
	maxFromDate: Date | null;

	minToDate: Date | null;
	maxToDate: Date;

	private readonly formBuilder = inject(UntypedFormBuilder);

	constructor(private readonly adapter: DateAdapter<unknown>) {
		this.minFromDate = new Date(1900, 0, 1);
		this.maxFromDate = new Date();

		this.minToDate = new Date(1900, 0, 1);
		this.maxToDate = new Date();
	}

	ngOnInit(): void {
		this.adapter.setLocale('de-CH');
		this.untypedForm = this.formBuilder.group({
			minMaxControl: []
		});
	}

	toDateChange(type: string, event: MatDatepickerInputEvent<Date>): void {
		this.maxFromDate = event.value;

		if (event.value !== null) {
			this.minFromDate = new Date(event.value.getFullYear(), event.value.getMonth(), event.value.getDate() - 30);
		}
	}
}
