import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {Component, inject} from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, type UntypedFormGroup, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {ObButtonModule} from '@oblique/oblique';
import {TranslateModule} from '@ngx-translate/core';

@Component({
	selector: 'app-stepper-example-error-preview',
	templateUrl: './stepper-example-error-preview.component.html',
	imports: [
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatStepperModule,
		ObButtonModule,
		ReactiveFormsModule,
		TranslateModule
	],
	providers: [
		{
			provide: STEPPER_GLOBAL_OPTIONS,
			useValue: {showError: true}
		}
	]
})
export class StepperExampleErrorPreviewComponent {
	firstFormGroup: UntypedFormGroup;
	secondFormGroup: UntypedFormGroup;

	constructor() {
		const formBuilder = inject(UntypedFormBuilder);
		this.firstFormGroup = formBuilder.group({
			firstCtrl: ['', Validators.required]
		});
		this.secondFormGroup = formBuilder.group({
			secondCtrl: ['', Validators.required]
		});
	}
}
