import {ObButtonModule} from '@oblique/oblique';
import {MatInputModule} from '@angular/material/input';
import {Component, OnInit} from '@angular/core';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';

@Component({
	selector: 'app-stepper-example-other-options-preview',
	templateUrl: './stepper-example-other-options-preview.component.html',
	styleUrls: ['./stepper-example-other-options-preview.component.scss'],
	imports: [
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatInputModule,
		MatStepperModule,
		ObButtonModule,
		ReactiveFormsModule,
		TranslateModule
	]
})
export class StepperExampleOtherOptionsPreviewComponent implements OnInit {
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
