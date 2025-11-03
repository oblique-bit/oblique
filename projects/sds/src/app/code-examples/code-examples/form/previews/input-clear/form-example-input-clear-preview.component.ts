import {Component, type OnInit, inject} from '@angular/core';
import {
	type AbstractControl,
	FormBuilder,
	FormControl,
	type FormGroup,
	ReactiveFormsModule,
	UntypedFormBuilder,
	type UntypedFormGroup
} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {ObInputClearModule} from '@oblique/oblique';

@Component({
	selector: 'app-form-example-input-clear-preview',
	imports: [MatFormFieldModule, MatIconModule, MatInputModule, ObInputClearModule, ReactiveFormsModule],
	templateUrl: './form-example-input-clear-preview.component.html',
	styleUrls: ['./form-example-input-clear-preview.component.scss', '../../../../code-example-flex-layout.scss']
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
