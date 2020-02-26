import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'ob-stepper-vertical',
	templateUrl: './stepper-vertical.component.html'
})
export class ObStepperVerticalComponent implements OnInit {
	firstFormGroup: FormGroup;
	secondFormGroup: FormGroup;
	isRippleDisabled = false;
	isSmall = false;
	isLarge = false;

	constructor(private formBuilder: FormBuilder) {
	}

	ngOnInit() {
		this.firstFormGroup = this.formBuilder.group({
			firstCtrl: ['', Validators.required]
		});
		this.secondFormGroup = this.formBuilder.group({
			secondCtrl: ['', Validators.required]
		});
	}
}
