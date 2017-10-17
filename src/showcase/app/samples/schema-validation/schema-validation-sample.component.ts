import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {SchemaValidationService} from '../../../../lib';
import {NotificationService} from '../../../../lib/ng/notification/notification.service';

@Component({
	selector: 'app-schema-validation',
	templateUrl: './schema-validation-sample.component.html',
	styles: [`
		.form-horizontal label {
			text-align: right;
		}

		.row + .row {
			margin-top: 2rem;
		}

		option[value=''],
		select.ng-pristine {
			color: #8e8e8e;
		}

		select.ng-pristine option:not([value='']) {
			color: #171717;
		}
		
		fieldset fieldset legend {
			width: calc(100% - 1rem);
			margin-left: 1rem;
		}
	`]
})
export class SchemaValidationSampleComponent implements OnInit {

	formData: FormGroup;

	schema = {
		'title': 'SampleSchemaSampleValidation',
		'type': 'object',
		'required': [
			'id',
			'text',
			'number',
			'date',
			'select',
			'time'
		],
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
				'required': ['firstName', 'lastName'],
				'properties': {
					'firstName': {
						'type': 'string',
						'minLength': 2
					},
					'lastName': {
						'type': 'string',
						'minLength': 2
					},
					'address': {
						'type': 'object',
						'required': ['street', 'number'],
						'properties': {
							'street': {'type': 'string'},
							'number': {'type': 'integer'}
						}
					}
				}
			}
		}
	};

	constructor(private schemaValidation: SchemaValidationService,
				private notification: NotificationService,
				private formBuilder: FormBuilder) {
	}

	ngOnInit(): void {
		this.schemaValidation.compileSchema(this.schema);
		this.formData = this.formBuilder.group({
			text: ['', this.schemaValidation.getValidator('text')],
			number: ['', this.schemaValidation.getValidator('number')],
			integer: ['', this.schemaValidation.getValidator('integer')],
			date: ['', this.schemaValidation.getValidator('date')],
			select: ['', this.schemaValidation.getValidator('select')],
			textarea: ['', this.schemaValidation.getValidator('textarea')],
			name: this.formBuilder.group({
				firstName: ['', this.schemaValidation.getValidator('name.firstName')],
				lastName: ['', this.schemaValidation.getValidator('name.lastName')],
				address: this.formBuilder.group({
					street: ['', this.schemaValidation.getValidator('name.address.street')],
					number: ['', this.schemaValidation.getValidator('name.address.number')],
				}),
			}),
		});
	}

	check(form?: NgForm): void {
		if ((form || this.formData).valid) {
			this.notification.success('Congratulations, your data is valid!');
		} else {
			this.notification.warning('Oops, your data does not look to be valid!');
		}
	}

	reset(form?: NgForm): void {
		(form || this.formData).reset();
	}
}
