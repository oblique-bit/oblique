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
			const result = service.createTextToFindRegex('gi', 'this');
			expect(result).toEqual(/this/gi);
		});
	});

	describe('escapeRegexCharacter', () => {
		it.each([
			{value: '[]', expected: '\\[\\]'},
			{value: '{}', expected: '\\{\\}'},
			{value: '()', expected: '\\(\\)'},
			{value: '*', expected: '\\*'},
			{value: '+', expected: '\\+'},
			{value: '?', expected: '\\?'},
			{value: '.', expected: '\\.'},
			{value: ',', expected: '\\,'},
			{value: '^', expected: '\\^'},
			{value: '$', expected: '\\$'},
			{value: '|', expected: '\\|'},
			{value: '#', expected: '\\#'},
			{value: '-', expected: '\\-'}
		])('should escape $value regex characters', ({value, expected}) => {
			const escapeString = service.escapeRegexCharacter(value);
			expect(escapeString).toBe(expected);
		});
	});
});
