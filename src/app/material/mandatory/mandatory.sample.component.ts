import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sc-mandatory.sample',
	templateUrl: './mandatory.sample.component.html'
})
export class MandatorySampleComponent implements OnInit {
	testForm: FormGroup;

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.testForm = this.formBuilder.group({
			inputRequired: ['', Validators.required],
			inputDynamicRequired: '',
			inputNonRequired: '',
			inputDateRequired: ['', Validators.required],
			inputDateDynamicRequired: '',
			inputDateNonRequired: '',
			selectRequired: ['', Validators.required],
			selectDynamicRequired: '',
			selectNonRequired: '',
			matSelectRequired: ['', Validators.required],
			matSelectDynamicRequired: '',
			matSelectNonRequired: '',
			textareaRequired: ['', Validators.required],
			textareaDynamicRequired: '',
			textareaNonRequired: '',
			matChipListRequired: ['', Validators.required],
			matChipListDynamicRequired: '',
			matChipListNonRequired: ''
		});
	}

	setRequired(): void {
		this.removeRequired();
		this.testForm.get('inputDynamicRequired').setValidators(Validators.required);
		this.testForm.get('inputDateDynamicRequired').setValidators(Validators.required);
		this.testForm.get('selectDynamicRequired').setValidators(Validators.required);
		this.testForm.get('matSelectDynamicRequired').setValidators(Validators.required);
		this.testForm.get('textareaDynamicRequired').setValidators(Validators.required);
		this.testForm.get('matChipListDynamicRequired').setValidators(Validators.required);
	}

	removeRequired(): void {
		this.testForm.get('inputDynamicRequired').clearValidators();
		this.testForm.get('inputDateDynamicRequired').clearValidators();
		this.testForm.get('selectDynamicRequired').clearValidators();
		this.testForm.get('matSelectDynamicRequired').clearValidators();
		this.testForm.get('textareaDynamicRequired').clearValidators();
		this.testForm.get('matChipListDynamicRequired').clearValidators();
	}
}
