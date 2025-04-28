import {Component, type OnInit, inject} from '@angular/core';
import {UntypedFormBuilder, type UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sb-stepper-vertical',
	templateUrl: './stepper-vertical.component.html',
	styleUrl: './stepper-vertical.component.scss',
	standalone: false
})
export class StepperVerticalComponent implements OnInit {
	firstFormGroup: UntypedFormGroup;
	secondFormGroup: UntypedFormGroup;
	isRippleDisabled = false;
	isSmall = false;
	isLarge = false;
	private readonly formBuilder = inject(UntypedFormBuilder);

	ngOnInit(): void {
		this.firstFormGroup = this.formBuilder.group({
			firstCtrl: ['', Validators.required]
		});
		this.secondFormGroup = this.formBuilder.group({
			secondCtrl: ['', Validators.required]
		});
	}
}
