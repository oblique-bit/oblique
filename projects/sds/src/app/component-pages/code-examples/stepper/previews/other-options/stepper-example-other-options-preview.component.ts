import {ObButtonModule} from '@oblique/oblique';
import {MatInputModule} from '@angular/material/input';
import {Component, OnInit} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {MatStepperModule} from '@angular/material/stepper';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
	selector: 'app-stepper-example-other-options-preview',
	templateUrl: './stepper-example-other-options-preview.component.html',
	styleUrls: ['./stepper-example-other-options-preview.component.scss'],
	standalone: true,
	imports: [MatFormFieldModule, MatButtonModule, MatIconModule, MatInputModule, MatStepperModule, ObButtonModule, ReactiveFormsModule]
})
export class StepperExampleOtherOptionsPreviewComponent implements PreviewComponent, OnInit {
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
