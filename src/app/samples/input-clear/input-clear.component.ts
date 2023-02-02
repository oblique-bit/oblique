import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';

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

	constructor(private readonly formBuilder: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.testForm = this.formBuilder.group({
			field1: ['']
		});
	}
}
