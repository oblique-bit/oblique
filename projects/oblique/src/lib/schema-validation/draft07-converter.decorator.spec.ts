import {draft07Convert} from './draft07-converter.decorator';

describe('draft07Convert', () => {
	let descriptor;
	let resultSchema;
	const mockCallback = jest.fn().mockImplementation(schema => {
		resultSchema = schema;
	});

	beforeEach(() => {
		descriptor = draft07Convert(null, 'test', {value: mockCallback});
	});

	test('returns a descriptor', () => {
		expect(descriptor.value instanceof Function).toBe(true);
	});

	describe('descriptor', () => {
		beforeEach(() => {
			descriptor.value({
				title: 'SampleSchemaValidation',
				id: 'id',
				type: 'object',
				properties: {
					required: {type: 'string', required: true},
					optional: {type: 'any'},
				},
			});
		});

		test('original callback is called', () => {
			expect(mockCallback).toHaveBeenCalled();
		});

		test('schema has been transformed', () => {
			expect(resultSchema).toEqual({
				title: 'SampleSchemaValidation',
				$id: 'id',
				type: 'object',
				required: ['required'],
				properties: {
					required: {type: 'string'},
					optional: {type: 'object'},
				},
			});
		});

		test('schema without properties gets an empty required array', () => {
			descriptor.value({
				title: 'SampleSchemaValidation',
				id: 'id',
				type: 'object',
			});

			expect(resultSchema).toEqual({
				title: 'SampleSchemaValidation',
				$id: 'id',
				type: 'object',
				required: [],
			});
		});

		test('property with an empty required array is not marked as required', () => {
			descriptor.value({
				title: 'SampleSchemaValidation',
				id: 'id',
				type: 'object',
				properties: {
					alpha: {type: 'string', required: []},
				},
			});

			expect(resultSchema).toEqual({
				title: 'SampleSchemaValidation',
				$id: 'id',
				type: 'object',
				required: [],
				properties: {
					alpha: {type: 'string', required: []},
				},
			});
		});

		test('property with a non-empty required array keeps its own required list', () => {
			descriptor.value({
				title: 'SampleSchemaValidation',
				id: 'id',
				type: 'object',
				properties: {
					alpha: {type: 'string', required: ['b']},
				},
			});

			expect(resultSchema).toEqual({
				title: 'SampleSchemaValidation',
				$id: 'id',
				type: 'object',
				required: [],
				properties: {
					alpha: {type: 'string', required: ['b']},
				},
			});
		});
	});
});
