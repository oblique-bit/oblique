import {ObButtonModule} from '@oblique/oblique';
import {MatInputModule} from '@angular/material/input';
import {Component, inject} from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule, UntypedFormBuilder, type UntypedFormGroup, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';

@Component({
	selector: 'app-stepper-example-other-options-preview',
	imports: [
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatStepperModule,
		ObButtonModule,
		ReactiveFormsModule,
		TranslateModule,
	],
	templateUrl: './stepper-example-other-options-preview.component.html',
	styleUrl: './stepper-example-other-options-preview.component.scss',
})
export class StepperExampleOtherOptionsPreviewComponent {
	firstFormGroup: UntypedFormGroup;
	secondFormGroup: UntypedFormGroup;

	constructor() {
		const formBuilder = inject(UntypedFormBuilder);
		this.firstFormGroup = formBuilder.group({
			firstCtrl: ['', Validators.required],
		});
		this.secondFormGroup = formBuilder.group({
			secondCtrl: ['', Validators.required],
		});
	}
}
