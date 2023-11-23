import {Component, OnInit} from '@angular/core';
import {FormControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sb-mandatory.sample',
	templateUrl: './mandatory.sample.component.html',
	styleUrls: ['./mandatory.sample.component.scss']
})
export class MandatorySampleComponent implements OnInit {
	/**
	 * The Mandatory Directive was removed with Oblique Version 8. This component remains in the showcase to ensure that the Asterisk functionality still works.
	 */
	testForm: UntypedFormGroup;

	constructor(private readonly formBuilder: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.testForm = this.formBuilder.group({
			inputRequired: new FormControl<string>('', Validators.required),
			inputDynamicRequired: new FormControl<string>(''),
			inputOptional: new FormControl<string>(''),
			inputDateRequired: new FormControl<string>('', Validators.required),
			inputDateDynamicRequired: new FormControl<string>(''),
			inputDateOptional: new FormControl<string>(''),
			selectRequired: new FormControl<string>('', Validators.required),
			selectDynamicRequired: new FormControl<string>(''),
			selectOptional: new FormControl<string>(''),
			matSelectRequired: new FormControl<string>('', Validators.required),
			matSelectDynamicRequired: new FormControl<string>(''),
			matSelectOptional: new FormControl<string>(''),
			textareaRequired: new FormControl<string>('', Validators.required),
			textareaDynamicRequired: new FormControl<string>(''),
			textareaOptional: new FormControl<string>(''),
			matChipListRequired: new FormControl<string[]>([''], Validators.required),
			matChipListDynamicRequired: new FormControl<string[]>(['']),
			matChipListOptional: new FormControl<string[]>([''])
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
		this.updateValidity();
	}

	removeRequired(): void {
		this.testForm.get('inputDynamicRequired').clearValidators();
		this.testForm.get('inputDateDynamicRequired').clearValidators();
		this.testForm.get('selectDynamicRequired').clearValidators();
		this.testForm.get('matSelectDynamicRequired').clearValidators();
		this.testForm.get('textareaDynamicRequired').clearValidators();
		this.testForm.get('matChipListDynamicRequired').clearValidators();
		this.updateValidity();
	}

	private updateValidity(): void {
		this.testForm.get('inputDynamicRequired').updateValueAndValidity();
		this.testForm.get('inputDateDynamicRequired').updateValueAndValidity();
		this.testForm.get('selectDynamicRequired').updateValueAndValidity();
		this.testForm.get('matSelectDynamicRequired').updateValueAndValidity();
		this.testForm.get('textareaDynamicRequired').updateValueAndValidity();
		this.testForm.get('matChipListDynamicRequired').updateValueAndValidity();
	}
}
