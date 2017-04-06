import {MultiselectSearchPipe} from './multiselect-search.pipe';
import {MultiselectComponent} from './multiselect.component';

describe('MultiselectSearchPipe', () => {
	let pipe: MultiselectSearchPipe;
	let multiselectDropdownMock;

	beforeEach(() => {
		multiselectDropdownMock = jasmine.createSpyObj('MultiselectComponent', ['formatOptionForLabel']);
		pipe = new MultiselectSearchPipe(multiselectDropdownMock);
	});

	describe('with options as string array', () => {
		const stringOptions = ['Fuu', 'Bar', 'Baz'];

		beforeEach(() => {
			multiselectDropdownMock.formatOptionForLabel.and.callFake((value) => value);
		});

		it('should keep option if it\'s equal to the searchString ', () => {
			let filteredOptions = pipe.transform(stringOptions, 'Bar');

			expect(filteredOptions.length).toBe(1);
			expect(filteredOptions).toContain('Bar');
		});

		it('should filter case insensitive', () => {
			let filteredOptions = pipe.transform(stringOptions, 'bAr');

			expect(filteredOptions.length).toBe(1);
			expect(filteredOptions).toContain('Bar');
		});

		it('should filter every matched option', () => {
			let filteredOptions = pipe.transform(stringOptions, 'ba');

			expect(filteredOptions.length).toBe(2);
			expect(filteredOptions).toContain('Bar');
			expect(filteredOptions).toContain('Baz');
		});
	});

	describe('with options as object array', () => {
		const objectOptions = [
			{name: 'Fuu', id: 0},
			{name: 'Bar', id: 1},
			{name: 'Baz', id: 2}
		];

		beforeEach(() => {
			multiselectDropdownMock.formatOptionForLabel.and.callFake((value) => value.name);
		});

		it('should keep option if it\'s equal to the searchString ', () => {
			let filteredOptions = pipe.transform(objectOptions, 'Bar');

			expect(filteredOptions.length).toBe(1);
			expect(filteredOptions).toContain(objectOptions[1]);
		});

		it('should filter case insensitive', () => {
			let filteredOptions = pipe.transform(objectOptions, 'bAr');

			expect(filteredOptions.length).toBe(1);
			expect(filteredOptions).toContain(objectOptions[1]);
		});

		it('should filter every matched option', () => {
			let filteredOptions = pipe.transform(objectOptions, 'Ba');

			expect(filteredOptions.length).toBe(2);
			expect(filteredOptions).toContain(objectOptions[1]);
			expect(filteredOptions).toContain(objectOptions[2]);
		});
	});

});
