import {inject, TestBed} from '@angular/core/testing';
import {ObSchemaValidationService} from 'oblique';


describe('SchemaValidationService', () => {
	let schemaValidationService: ObSchemaValidationService;
	let validator;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ObSchemaValidationService
			]
		});
	});

	beforeEach(inject([ObSchemaValidationService], (service: ObSchemaValidationService) => {
		schemaValidationService = service;
	}));

	describe('validate()', () => {
		beforeEach(() => {
			validator = schemaValidationService.compileSchema({
				'type': 'object',
				'properties': {
					'someProperty': {
						'type': 'string',
						'minLength': 4,
						'maxLength': 10
					},
					'object': {
						'type': 'object',
						'properties': {
							'subproperty': {
								'type': 'number'
							}
						}
					}
				}
			});
		});

		it('should return null, if data is valid', () => {
			expect(validator.validate('someProperty', 'valid')).toBeNull();
		});

		it('should return angular2 conform error objects', () => {
			expect(validator.validate('someProperty', 4)).toEqual({
				type: { //error type (in this case a type Issue)
					type: 'string' //The required type
				}
			});

			expect(validator.validate('someProperty', 'fuu')).toEqual({
				minLength: { //error type (in this case a type Issue)
					limit: 4 //The required type
				}
			});
		});

		it('should return null, if property doesn\'t exist', () => {
			expect(validator.validate('nonexistentProperty', 1337)).toBeNull();
		});

		it('should return null, if subproperty is valid', () => {
			expect(validator.validate('object.subproperty', 1337)).toBeNull();
		});

		it('should return angular conform error objects if subproperties are validated', () => {
			expect(validator.validate('object.subproperty', 'string')).toEqual({
				type: {
					type: 'number'
				}
			});
		});

		it('should return null, if subproperty doesn\'t exist', () => {
			expect(validator.validate('object.nonexistentProperty', 1337)).toBeNull();
		});
	});
});
