import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sc-stepper-vertical',
	templateUrl: './stepper-vertical.component.html'
})
export class StepperVerticalComponent implements OnInit {
	firstFormGroup: UntypedFormGroup;
	secondFormGroup: UntypedFormGroup;
	isRippleDisabled = false;
	isSmall = false;
	isLarge = false;

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
