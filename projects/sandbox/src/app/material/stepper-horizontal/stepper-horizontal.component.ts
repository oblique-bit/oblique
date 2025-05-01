import {Component, type OnInit, inject} from '@angular/core';
import {UntypedFormBuilder, type UntypedFormGroup, Validators} from '@angular/forms';

@Component({
	selector: 'sb-stepper-horizontal',
	templateUrl: './stepper-horizontal.component.html',
	styleUrl: './stepper-horizontal.component.scss',
	standalone: false
})
export class StepperHorizontalComponent implements OnInit {
	firstFormGroup: UntypedFormGroup;
	secondFormGroup: UntypedFormGroup;
	isRippleDisabled = false;
	isSmall = false;
	isLarge = false;
	labelBottom = true;
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
