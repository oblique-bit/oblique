import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sc-stepper-horizontal',
	templateUrl: './stepper-horizontal.component.html'
})
export class StepperHorizontalComponent implements OnInit {
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	isRippleDisabled = false;
	isSmall = false;
	isLarge = false;
	labelBottom = true;

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.firstFormGroup = this.formBuilder.group({
			firstCtrl: ['', Validators.required]
		});
		this.secondFormGroup = this.formBuilder.group({
			secondCtrl: ['', Validators.required]
		});
	}
}
