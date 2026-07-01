import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ObErrorMessagesModule} from '@oblique/oblique';
// Since Oblique 16.0.0, schema validation is a secondary entry point because AJV requires `unsafe-eval`.
import {ObSchemaValidationModule} from '@oblique/oblique/schema-validation';

@Component({
	selector: 'app-schema-validation-example-template-driven-form-preview',
	imports: [MatInputModule, ObSchemaValidationModule, ObErrorMessagesModule, FormsModule],
	templateUrl: './schema-validation-example-template-driven-form-preview.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
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
				maxLength: 30,
			},
			lastName: {
				type: 'string',
				minLength: 2,
				maxLength: 30,
			},
			age: {
				type: 'number',
				minimum: 18, // 18 is included, 17 is first invalid value
				exclusiveMaximum: 120, // 120 is not included, max is 119
			},
		},
	};
}
