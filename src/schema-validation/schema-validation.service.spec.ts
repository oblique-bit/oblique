import {TestBed, inject} from '@angular/core/testing';
import {SchemaValidationService} from './schema-validation.service';


describe('SchemaValidationService', () => {
    let schemaValidationService: SchemaValidationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SchemaValidationService
            ]
        });
    });

    beforeEach(inject([SchemaValidationService], (service: SchemaValidationService) => {
        schemaValidationService = service;
    }));

    describe('validate()', () => {
        beforeEach(() => {
            schemaValidationService.compileSchema({
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
            expect(schemaValidationService.validate('someProperty', 'valid')).toBeNull();
        });

        it('should return angular2 conform error objects', () => {
            expect(schemaValidationService.validate('someProperty', 4)).toEqual({
                type: { //error type (in this case a type Issue)
                    params: {
                        type: 'string' //The required type
                    }
                }
            });

            expect(schemaValidationService.validate('someProperty', 'fuu')).toEqual({
                minLength: { //error type (in this case a type Issue)
                    params: {
                        limit: 4 //The required type
                    }
                }
            });
        });

        it('should throw, if property doesn\'t exist', () => {
            expect(() => schemaValidationService.validate('nonexistentProperty', 1337)).toThrowError();
        });

        it('should return null, if subproperty is valid', () => {
            expect(schemaValidationService.validate('object.subproperty', 1337)).toBeNull();
        });

        it('should return angular2 conform error objects if subproperties are validated', () => {
            expect(schemaValidationService.validate('object.subproperty', 'string')).toEqual({
                type: {
                    params: {
                        type: 'number'
                    }
                }
            });
        });

        it('should throw, if subproperty doesn\'t exist', () => {
            expect(() => schemaValidationService.validate('object.nonexistentProperty', 1337)).toThrowError();
        });
    });
});