import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms'; // UntypedFormBuilder, UntypedFormGroup,
import {ObNumberFormatModule} from '@oblique/oblique';
import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-number-format-example-default-with-reactive-form-preview',
	templateUrl: './number-format-example-default-with-reactive-form-preview.component.html',
	standalone: true,
	imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, ObNumberFormatModule, ReactiveFormsModule],
	styleUrls: ['../../../../code-example-flex-layout.scss']
})
export class NumberFormatExampleDefaultWithReactiveFormPreviewComponent {
	exampleReactive$: Observable<string>;
	formData: FormGroup;

	constructor(formBuilder: FormBuilder) {
		this.formData = formBuilder.group({
			exampleReactive: 5.236548
		});

		this.showValue();
	}

	showValue(): void {
		this.exampleReactive$ = this.formData.get('exampleReactive').valueChanges as Observable<string>;
	}
}
