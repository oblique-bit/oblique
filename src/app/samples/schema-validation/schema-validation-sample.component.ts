import {Component, OnInit} from '@angular/core';
import {AbstractControl, NgForm, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {ObNotificationService, ObSchemaValidationService} from '@oblique/oblique';
import {of} from 'rxjs';

@Component({
	selector: 'sc-schema-validation',
	templateUrl: './schema-validation-sample.component.html',
	styleUrls: ['./schema-validation-sample.component.scss']
})
export class SchemaValidationSampleComponent implements OnInit {
	materialTestForm: UntypedFormGroup;

	selectOptions = [
		{label: 'Aaa', value: 'aaa'},
		{label: 'Bbb', value: 'bbb'},
		{label: 'Ccc', value: 'ccc'},
		{label: 'Ddd', value: 'ddd'},
		{label: 'Eee', value: 'eee'},
		{label: 'Invalid-1', value: 'invalid-1'},
		{label: 'Invalid-2', value: 'invalid-2'},
		{label: 'Invalid-3', value: 'invalid-3'}
	];

	formData: UntypedFormGroup;
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
				maximum: 10000000
			},
			integer: {
				type: 'integer',
				minimum: 1,
				maximum: 100
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
				enum: ['aaa', 'bbb', 'ccc', 'ddd', 'eee']
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
		private readonly formBuilder: UntypedFormBuilder
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

		this.initMaterialForm();
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

	private initMaterialForm(): void {
		this.schema$.subscribe(schema => {
			const schemaValidatorInstance = this.schemaValidation.compileSchema(schema);

			this.materialTestForm = this.formBuilder.group({
				dateField: undefined,
				textField: ''
			});

			this.materialTestForm.get('dateField').setValidators([schemaValidatorInstance.getValidator('date'), this.dateBeforeNowValidator()]);

			this.materialTestForm.get('textField').setValidators([schemaValidatorInstance.getValidator('text')]);
		});
	}

	private dateBeforeNowValidator(): ValidatorFn {
		return (control: AbstractControl): ValidationErrors =>
			new Date(control.value).getTime() < Date.now() ? {invalidDateMin: {value: new Date().toDateString()}} : null;
	}
}
