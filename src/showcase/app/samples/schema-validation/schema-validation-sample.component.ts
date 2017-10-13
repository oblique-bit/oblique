import {Component} from '@angular/core';

@Component({
	selector: 'app-schema-validation',
	templateUrl: './schema-validation-sample.component.html',
	styles: [`
		.form-horizontal label {
			text-align: right;
		}
		
		form + .row {
			margin-top: 2rem;
		}
	`]
})
export class SchemaValidationSampleComponent {

	schema = {
		'title': 'SampleSchemaSampleValidation',
		'type': 'object',
		/*'required': [
		 'id',
		 'text',
		 'number',
		 'date',
		 'time'
		 ],*/
		'properties': {
			'id': {
				'type': 'integer'
			},
			'text': {
				'type': 'string',
				'minLength': 3,
				'maxLength': 64
			},
			'number': {
				'type': 'number',
				'minimum': 1,
				'maximum': 10000000,
				'exclusiveMinimum': 1
			},
			'integer': {
				'type': 'integer',
				'minimum': 0,
				'maximum': 100,
				'exclusiveMaximum': 100
			},
			//TODO: not implemented yet
			'date': {
				'type': [
					'object',
					'string',
					'number'
				],
				'format': 'date-time'
			},
			'time': {
				'format': 'date-time',
				'type': [
					'object',
					'string'
				]
			},
			'select': {
				'type': 'string',
				'options': [
					{'label': 'Aaa', 'value': 'aaa'},
					{'label': 'Bbb', 'value': 'bbb'},
					{'label': 'Ccc', 'value': 'ccc'},
					{'label': 'Ddd', 'value': 'ddd'},
					{'label': 'Eee', 'value': 'eee'}
				]
			},
			'multiselect': {
				'type': 'array',
				'items': {
					'type': 'object'
				},
				'minItems': 1,
				'maxItems': 4,
				'options': [
					{'label': 'Aaa', 'value': 'aaa'},
					{'label': 'Bbb', 'value': 'bbb'},
					{'label': 'Ccc', 'value': 'ccc'},
					{'label': 'Ddd', 'value': 'ddd'},
					{'label': 'Eee', 'value': 'eee'}
				]
			},
			'textarea': {
				'type': 'string',
				'minLength': 5,
				'maxLength': 140
			},
			'name': {
				'type': 'object',
				'properties': {
					'firstname': {
						'type': 'string',
						'minLength': 2
					},
					'lastname': {
						'type': 'string',
						'minLength': 2
					}
				}
			}
		}
	};
}
