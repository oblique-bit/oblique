import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
	selector: 'ob-input-clear',
	templateUrl: './input-clear.component.html'
})
export class ObInputClearSampleComponent implements OnInit {
	testModel1: string;
	testModel2: string;
	testModel3: string;
	testModel4: string;
	testForm: FormGroup;

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.testForm = this.formBuilder.group({
			field1: ['']
		});
	}
}
