import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {ObNotificationService, ObSchemaValidationService, ObThemeService} from 'oblique';
import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-schema-validation',
	templateUrl: './schema-validation-sample.component.html',
	styles: [
		`
			.form-horizontal label {
				text-align: right;
			}
		`
	]
})
export class ObSchemaValidationSampleComponent implements OnInit {
	material: Observable<boolean>;
	materialTestForm: FormGroup;

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
		private readonly formBuilder: FormBuilder,
		private readonly theme: ObThemeService
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

		this.material = this.theme.theme$.pipe(map(() => this.theme.isMaterial()));
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
		return (control: AbstractControl): ValidationErrors => {
			return new Date(control.value).getTime() < Date.now() ? {invalidDateMin: {value: new Date().toDateString()}} : null;
		};
	}
}
