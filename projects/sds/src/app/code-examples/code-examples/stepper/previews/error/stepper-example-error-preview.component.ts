import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {Component, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {ObButtonModule} from '@oblique/oblique';

@Component({
	selector: 'app-stepper-example-error-preview',
	templateUrl: './stepper-example-error-preview.component.html',
	imports: [MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule, MatStepperModule, ObButtonModule, ReactiveFormsModule],
	providers: [
		{
			provide: STEPPER_GLOBAL_OPTIONS,
			useValue: {showError: true}
		}
	]
})
export class StepperExampleErrorPreviewComponent implements OnInit {
	firstFormGroup: UntypedFormGroup;
	secondFormGroup: UntypedFormGroup;
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
