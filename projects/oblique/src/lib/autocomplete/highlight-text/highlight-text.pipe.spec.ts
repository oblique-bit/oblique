import {TestBed} from '@angular/core/testing';
import {BrowserTestingModule} from '@angular/platform-browser/testing';
import {ObHighlightTextPipe} from './highlight-text.pipe';
import {ObAutocompleteTextToFindService} from '../autocomplete-text-to-find.service';

describe('ObHighlightTextPipe', () => {
	let textToFindService: ObAutocompleteTextToFindService;
	let pipe: ObHighlightTextPipe;
	const testString = 'This is a testString';

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [BrowserTestingModule]
		});
		textToFindService = TestBed.inject(ObAutocompleteTextToFindService);
		pipe = new ObHighlightTextPipe(textToFindService);
	});
	it('should create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	describe('transform', () => {
		it('should return transformed value with correct span and text', () => {
			const result = pipe.transform(testString, 'This');
			expect(result).toEqual('<span class="ob-highlight-text">This</span> is a testString');
		});

		it('should return value if the textToFind is null', () => {
			expect(pipe.transform(testString, null)).toBe(testString);
		});

		it('should return the initial value when no match was found', () => {
			const result = pipe.transform(testString, 'Z', 'ob-highlight-text');
			expect(result).toEqual(testString);
		});
	});
});
