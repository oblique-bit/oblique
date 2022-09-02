import {TestBed} from '@angular/core/testing';

import {ObAutocompleteTextToFindService} from './autocomplete-text-to-find.service';

describe('ObAutocompleteTextToFindService', () => {
	let service: ObAutocompleteTextToFindService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ObAutocompleteTextToFindService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('createTextToFindRegex', () => {
		it("should return regex '/this is a string this/gi'", () => {
			const result = service.createTextToFindRegex('this is a string textToFind', 'gi', 'this');
			expect(result).toEqual(/this is a string this/gi);
		});

		it("should throw error with error message if  parameter 'pattern' empty", () => {
			expect(() => {
				service.createTextToFindRegex('noPlaceholder', 'gi', 'This');
			}).toThrow("In customised regex patterns, the string 'textToFind' should mark the location where the entered text will be.");
		});

		it("should throw error with error message if  parameter 'pattern' empty", () => {
			expect(() => {
				service.createTextToFindRegex('', 'gi', 'This');
			}).toThrow("Property pattern should not be empty. Default value is 'textToFind'. That will replace with the value");
		});

		it("should throw an error with error message if parameter 'pattern' not includes textToFind", () => {
			expect(() => {
				service.createTextToFindRegex('FalsyPattern', 'gi', 'This');
			}).toThrow("In customised regex patterns, the string 'textToFind' should mark the location where the entered text will be.");
		});
	});

	describe('escapeRegexCharacter', () => {
		it('should escape regex character', () => {
			const escapeString = service.escapeRegexCharacter('{/*}');
			expect(escapeString).toBe('\\{/\\*\\}');
		});
	});
});
