import {ObSchemaValidatorInstance} from './schema-validator.instance';

describe(ObSchemaValidatorInstance.name, () => {
	const validator = new ObSchemaValidatorInstance({
		title: 'SampleSchemaValidation',
		type: 'object',
		required: ['required'],
		properties: {
			required: {type: 'string'},
			optional: {type: 'string'},
			minLength: {type: 'string', minLength: 5},
			date: {
				type: ['object', 'string', 'number'],
				format: 'date-time',
			},
			nested: {required: ['required'], properties: {required: {type: 'string'}, optional: {type: 'string'}}},
			empty: {},
		},
	});

	describe('validate', () => {
		test('fails when "required" not provided', () => {
			expect(validator.validate('required', null)).toEqual({'ajv.required': true});
		});

		test('fails when "minLength" is too short', () => {
			expect(validator.validate('minLength', 'min')).toEqual({'ajv.minLength': {limit: 5}});
		});

		test('fails when "date" has a bad format', () => {
			expect(validator.validate('date', 'asdf')).toEqual({'ajv.format.date': {format: 'date-time'}});
		});

		test.each([
			{property: 'required', value: '42'},
			{property: 'minLength', value: 'minLength'},
			{property: 'date', value: ''}, // this is because no language data has been loaded
			{property: undefined, value: ''},
		])('succeed when $property is correct', ({property, value}) => {
			expect(validator.validate(property, value)).toBeNull();
		});
	});

	describe('isRequired', () => {
		test.each([
			{property: 'required', path: [], result: true},
			{property: 'optional', path: [], result: false},
			{property: 'required', path: ['nested'], result: true},
			{property: 'optional', path: ['nested'], result: false},
			{property: 'nonexistent', path: ['nested'], result: false},
		])('"$property" property with "$path" path returns "$result"', ({property, path, result}) => {
			expect(validator.isRequired(property, path)).toBe(result);
		});
	});

	describe('getValidator', () => {
		test('returns a function', () => {
			const func = validator.getValidator('text');
			expect(func instanceof Function).toBe(true);
		});
	});
});
