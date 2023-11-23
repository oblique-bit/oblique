import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ObButtonDirective, ObErrorMessagesModule, ObSchemaValidationModule} from '@oblique/oblique';

@Component({
	selector: 'app-schema-validation-example-reactive-form-preview',
	templateUrl: './schema-validation-example-reactive-form-preview.component.html',
	imports: [CommonModule, MatInputModule, ObButtonDirective, ReactiveFormsModule, ObSchemaValidationModule, ObErrorMessagesModule],
	standalone: true
})
export class SchemaValidationExampleReactiveFormPreviewComponent implements OnInit {
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		required: ['firstName', 'lastName'],
		properties: {
			firstName: {
				type: 'string',
				minLength: 2,
				maxLength: 30
			},
			lastName: {
				type: 'string',
				minLength: 2,
				maxLength: 30
			},
			age: {
				type: 'number',
				minimum: 18, // 18 is included, 17 is the first invalid value
				exclusiveMaximum: 120 // 120 is not included, max is 119
			}
		}
	};
	nameFormGroup: FormGroup;

	private readonly formBuilder: FormBuilder = inject(FormBuilder);

	ngOnInit(): void {
		this.nameFormGroup = this.formBuilder.group({
			firstName: new FormControl(''),
			lastName: new FormControl(''),
			age: new FormControl(18)
		});
	}
}
