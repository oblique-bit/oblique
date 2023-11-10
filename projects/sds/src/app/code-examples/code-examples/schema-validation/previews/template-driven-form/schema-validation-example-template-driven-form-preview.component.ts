import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule, ObFormFieldDirective, ObSchemaValidationModule} from '@oblique/oblique';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

@Component({
	selector: 'app-schema-validation-example-template-driven-form-preview',
	templateUrl: './schema-validation-example-template-driven-form-preview.component.html',
	imports: [
		CommonModule,
		MatInputModule,
		ObSchemaValidationModule,
		ObErrorMessagesModule,
		FormsModule,
		MatDatepickerModule,
		ObFormFieldDirective,
		MatNativeDateModule
	],
	standalone: true
})
export class SchemaValidationExampleTemplateDrivenFormPreviewComponent {
	firstName = '';
	lastName = '';
	age = 18;
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
				minimum: 18, // 18 is included, 17 is first invalid value
				exclusiveMaximum: 120 // 120 is not included, max is 119
			}
		}
	};
}
