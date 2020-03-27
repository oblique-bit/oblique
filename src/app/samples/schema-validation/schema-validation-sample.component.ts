import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {ObNotificationService, ObSchemaValidationService} from 'oblique';
import {of} from 'rxjs';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'app-schema-validation',
	templateUrl: './schema-validation-sample.component.html',
	styles: [
		`
			.form-horizontal label {
				text-align: right;
			}
		`
	]
})
export class SchemaValidationSampleComponent implements OnInit {
	formData: FormGroup;
	schema$ = of({
		title: 'SampleSchemaSampleValidation',
		type: 'object',
		required: ['text', 'number', 'date', 'select', 'time'],
		properties: {
			text: {
				type: 'string',
				minLength: 3,
				maxLength: 64
			},
			number: {
				type: 'number',
				minimum: 1,
				maximum: 10000000,
				exclusiveMinimum: 1
			},
			integer: {
				type: 'integer',
				minimum: 0,
				maximum: 100,
				exclusiveMaximum: 100
			},
			date: {
				type: ['object', 'string', 'number'],
				format: 'date-time'
			},
			time: {
				format: 'date-time',
				type: ['object', 'string']
			},
			select: {
				type: 'string',
				options: [
					{label: 'Aaa', value: 'aaa'},
					{label: 'Bbb', value: 'bbb'},
					{label: 'Ccc', value: 'ccc'},
					{label: 'Ddd', value: 'ddd'},
					{label: 'Eee', value: 'eee'}
				]
			},
			multiselect: {
				type: 'array',
				items: {
					type: 'object'
				},
				minItems: 1,
				maxItems: 4,
				options: [
					{label: 'Aaa', value: 'aaa'},
					{label: 'Bbb', value: 'bbb'},
					{label: 'Ccc', value: 'ccc'},
					{label: 'Ddd', value: 'ddd'},
					{label: 'Eee', value: 'eee'}
				]
			},
			textarea: {
				type: 'string',
				minLength: 5,
				maxLength: 140
			},
			name: {
				type: 'object',
				required: ['firstName', 'lastName'],
				properties: {
					firstName: {
						type: 'string',
						minLength: 2
					},
					lastName: {
						type: 'string',
						minLength: 2
					},
					address: {
						type: 'object',
						required: ['street', 'number'],
						properties: {
							street: {type: 'string'},
							number: {type: 'integer'}
						}
					}
				}
			}
		}
	});

	constructor(
		private readonly schemaValidation: ObSchemaValidationService,
		private readonly notification: ObNotificationService,
		private readonly formBuilder: FormBuilder
	) {}

	ngOnInit(): void {
		this.formData = this.formBuilder.group({
			text: undefined,
			number: undefined,
			integer: undefined,
			date: undefined,
			select: undefined,
			textarea: undefined,
			name: this.formBuilder.group({
				firstName: undefined,
				lastName: undefined,
				address: this.formBuilder.group({
					street: undefined,
					number: undefined
				})
			})
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
