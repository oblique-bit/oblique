import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sb-stepper-horizontal',
	templateUrl: './stepper-horizontal.component.html'
})
export class StepperHorizontalComponent implements OnInit {
	firstFormGroup: UntypedFormGroup;
	secondFormGroup: UntypedFormGroup;
	isRippleDisabled = false;
	isSmall = false;
	isLarge = false;
	labelBottom = true;

	constructor(private readonly formBuilder: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.firstFormGroup = this.formBuilder.group({
			firstCtrl: ['', Validators.required]
		});
		this.secondFormGroup = this.formBuilder.group({
			secondCtrl: ['', Validators.required]
		});
	}
}
