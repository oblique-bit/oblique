import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';

@Component({
	selector: 'sc-input-clear',
	templateUrl: './input-clear.component.html'
})
export class InputClearSampleComponent implements OnInit {
	testModel1: string;
	testModel2: string;
	testModel3: string;
	testModel4: string;
	testForm: UntypedFormGroup;
	stronglyTypedForm: FormGroup<{stronglyTypedFormField: FormControl<string>}>;

	constructor(private readonly formBuilder: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.testForm = this.formBuilder.group({
			field1: ['']
		});

		this.stronglyTypedForm = this.formBuilder.group({
			stronglyTypedFormField: ['']
		});
	}
}
