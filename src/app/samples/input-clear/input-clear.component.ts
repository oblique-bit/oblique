import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';

@Component({
	selector: 'sc-input-clear',
	templateUrl: './input-clear.component.html'
})
export class InputClearSampleComponent implements OnInit {
	mandatoryModel: string;
	mandatoryLgModel: string;
	mandatorySmModel: string;
	datepickerModel: string;
	untypedForm: UntypedFormGroup;
	stronglyTypedForm: FormGroup<{stronglyTypedFormField: FormControl<string>}>;

	constructor(private readonly formBuilder: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.untypedForm = this.formBuilder.group({
			untypedFormField: ['']
		});

		this.stronglyTypedForm = this.formBuilder.group({
			stronglyTypedFormField: ['']
		});
	}
}
