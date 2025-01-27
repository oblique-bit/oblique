import {Component, OnInit, inject} from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ReactiveFormsModule,
	UntypedFormBuilder,
	UntypedFormGroup
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ObInputClearModule} from '@oblique/oblique';

@Component({
	selector: 'app-form-example-input-clear-preview',
	templateUrl: './form-example-input-clear-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss', './form-example-input-clear-preview.component.scss'],
	imports: [MatFormFieldModule, MatIconModule, MatInputModule, ObInputClearModule, ReactiveFormsModule]
})
export class FormExampleInputClearPreviewComponent implements OnInit {
	stronglyTypedForm: FormGroup<{stronglyTypedFormField: FormControl<string>}>;
	stronglyTypedFormField: AbstractControl<string, string>;
	untypedForm: UntypedFormGroup;
	untypedFormField: AbstractControl<any, any>;

	private readonly stronglyTypedFormBuilder = inject(FormBuilder);
	private readonly untypedFormBuilder = inject(UntypedFormBuilder);

	ngOnInit(): void {
		this.stronglyTypedForm = this.stronglyTypedFormBuilder.group({
			stronglyTypedFormField: new FormControl<string>('')
		});
		this.stronglyTypedFormField = this.stronglyTypedForm.get('stronglyTypedFormField');
		this.untypedForm = this.untypedFormBuilder.group({
			untypedFormField: ['']
		});
		this.untypedFormField = this.untypedForm.get('untypedFormField');
	}
}
