import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NO_ERRORS_SCHEMA, Pipe, PipeTransform} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';

import {ObMultiselectComponent, ObMultiselectConfig, ObMultiselectTexts} from 'oblique';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';

@Pipe({
	name: 'searchFilter'
})
class MockSearchPipe implements PipeTransform {
	transform(value: any, args: any): any {
		return value;
	}
}

describe('MultiselectComponent', () => {
	let fixture: ComponentFixture<ObMultiselectComponent>;
	let component: ObMultiselectComponent;

	const stringOption1 = 'fuu';
	const stringOption2 = 'bar';
	const stringOption3 = 'baz';

	const stringOptions = [stringOption1, stringOption2, stringOption3];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ObMultiselectComponent, MockSearchPipe, ObMockTranslatePipe],
			imports: [FormsModule],
			providers: [ObMultiselectConfig, ObMultiselectTexts],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMultiselectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('toggleDropdown', () => {
		it('should be triggered by a click on the .multiselect-toggle button', () => {
			spyOn(component, 'toggleDropdown').and.callThrough();
			const button = fixture.debugElement.query(By.css('.multiselect-toggle'));

			button.nativeElement.click();

			expect(component.toggleDropdown).toHaveBeenCalled();
		});

		it('should emit dropdownClosed, if dropdown was already open', () => {
			spyOn(component.dropdownClosed, 'emit').and.callThrough();
			component.isVisible = true;

			component.toggleDropdown();

			expect(component.dropdownClosed.emit).toHaveBeenCalled();
		});
	});

	describe('formatOptionForLabel()', () => {
		const modelOption = {
			name: 'bar',
			id: 0
		};

		it('should return the option if no labelProperty or labelFormatter is defined', () => {
			expect(component.formatOptionForLabel(stringOption1)).toEqual(stringOption1);
		});

		it('should use the property defined as labelProperty if no labelFormatter is set', () => {
			component.labelProperty = 'name';

			expect(component.formatOptionForLabel(modelOption)).toEqual(modelOption.name);
		});

		it("should use labelFormatter if it's set", () => {
			const formatterReturnValue = 'FuuBar';

			component.labelFormatter = jest.fn().mockImplementation(() => formatterReturnValue);

			const result = component.formatOptionForLabel(modelOption);

			expect(result).toEqual(formatterReturnValue);
			expect(component.labelFormatter).toHaveBeenCalledWith(modelOption);
		});
	});

	describe('toggleSelection()', () => {
		beforeEach(() => {
			component.options = stringOptions;
		});

		it('should be triggered by a click on a .dropdown-item button', () => {
			spyOn(component, 'toggleSelection').and.callThrough();
			component.isVisible = true;
			fixture.detectChanges();

			const buttons = fixture.debugElement.queryAll(By.css('.dropdown-item'));

			buttons[0].nativeElement.click();

			expect(component.toggleSelection).toHaveBeenCalled();
			expect(component.toggleSelection).toHaveBeenCalledWith(stringOption1);
		});

		it("should add option to model, if it isn't already selected", () => {
			component.toggleSelection(stringOption1);

			expect(component.model.length).toBe(1);
			expect(component.model).toContain(stringOption1);
		});

		it("should emit onAdded, if option isn't already selected", () => {
			spyOn(component.onAdded, 'emit');

			component.toggleSelection(stringOption1);

			expect(component.onAdded.emit).toHaveBeenCalledWith(stringOption1);
		});

		it("should remove option from model, if it's already selected", () => {
			component.model.push(stringOption1);

			component.toggleSelection(stringOption1);

			expect(component.model.length).toBe(0);
			expect(component.model).not.toContain(stringOption1);
		});

		it('should emit onRemoved, if option is already selected', () => {
			component.model.push(stringOption1);
			spyOn(component.onRemoved, 'emit');

			component.toggleSelection(stringOption1);

			expect(component.onRemoved.emit).toHaveBeenCalledWith(stringOption1);
		});

		describe('with selectionLimit set', () => {
			beforeEach(() => {
				component.selectionLimit = 2;
				component.model.push(stringOption1);
				component.model.push(stringOption2);
			});

			it('should emit selectionLimitReached, if there are already enough selected options', () => {
				spyOn(component.selectionLimitReached, 'emit');

				component.toggleSelection(stringOption3);

				expect(component.selectionLimitReached.emit).toHaveBeenCalled();
			});

			it("shouldn't add item to model, if there are already enough selected options", () => {
				spyOn(component.selectionLimitReached, 'emit');

				component.toggleSelection(stringOption3);

				expect(component.model.length).toBe(2);
			});
		});
	});

	describe('updateTitle()', () => {
		beforeEach(() => {
			component.dynamicTitleMaxItems = 0;
			component.options = stringOptions;
		});

		it('should set title to texts.defaultTitle, if no option is selected', () => {
			component.updateTitle();

			expect(component.title).toBe(component.texts.defaultTitle);
		});

		it('should set title to texts.allSelected, if all options are selected ', () => {
			component.model = stringOptions;

			component.updateTitle();

			expect(component.title).toBe(component.texts.allSelected);
		});

		it('should set title to texts.checked, if not all options are selected', () => {
			component.model.push(stringOption1, stringOption2);

			component.updateTitle();

			expect(component.title).toBe(component.texts.checked);
		});

		it('should set titleTranslateParams with the amount of selections, if not all options are selected', () => {
			component.model.push(stringOption1, stringOption2);

			component.updateTitle();

			expect(component.titleTranslateParams).toBeDefined();
			expect(component.titleTranslateParams).not.toBeNull();
			expect(component.titleTranslateParams).toEqual({amount: 2});
		});

		describe('with dynamicTitleMaxItems', () => {
			beforeEach(() => {
				component.dynamicTitleMaxItems = 2;
				component.options = stringOptions;
			});

			it('should still set the title to text.defaultTitle, if no option is selected', () => {
				component.updateTitle();

				expect(component.title).toBe(component.texts.defaultTitle);
			});

			it('should have no list-item, if no option is selected', () => {
				fixture.detectChanges();
				const items = fixture.debugElement.queryAll(By.css('.list-item'));

				expect(items.length).toBe(0);
			});

			it('should empty the title, if one option is selected', () => {
				component.model.push(stringOption1);
				component.updateTitle();

				expect(component.title).toBe('');
			});

			it('should have one list-item per selected option', () => {
				component.model.push(stringOption1, stringOption2);
				fixture.detectChanges();
				const items = fixture.debugElement.queryAll(By.css('.list-item'));
				expect(items.length).toBe(2);
				expect(items[0].nativeElement.textContent).toBe(stringOption1);
				expect(items[1].nativeElement.textContent).toBe(stringOption2);
			});
		});
	});

	describe('checkAll()', () => {
		beforeEach(() => {
			spyOn(component.onAdded, 'emit').and.callThrough();

			component.showCheckAll = true;
			component.options = stringOptions;
		});

		it('should be triggered by a click on .multiselect-control-check button', () => {
			spyOn(component, 'checkAll').and.callThrough();
			component.isVisible = true;
			fixture.detectChanges();

			const button = fixture.debugElement.query(By.css('button.multiselect-control-check'));

			button.nativeElement.click();

			expect(component.checkAll).toHaveBeenCalled();
		});

		it('should select every option', () => {
			component.checkAll();

			expect(component.model.length).toBe(component.options.length);
			component.options.forEach(option => {
				expect(component.model).toContain(option);
			});
		});

		it('should emit onAdded on every new selection', () => {
			component.model.push(stringOption1);

			component.checkAll();

			expect(component.onAdded.emit).toHaveBeenCalledTimes(2);
			expect(component.onAdded.emit).toHaveBeenCalledWith(stringOption2);
			expect(component.onAdded.emit).toHaveBeenCalledWith(stringOption3);
		});
	});

	describe('uncheckAll()', () => {
		beforeEach(() => {
			spyOn(component.onRemoved, 'emit').and.callThrough();

			component.showUncheckAll = true;
			component.options = stringOptions;
		});

		it('should be triggered by a click on .multiselect-control-uncheck button', () => {
			spyOn(component, 'uncheckAll').and.callThrough();
			component.isVisible = true;
			fixture.detectChanges();

			const button = fixture.debugElement.query(By.css('button.multiselect-control-uncheck'));

			button.nativeElement.click();

			expect(component.uncheckAll).toHaveBeenCalled();
		});

		it('should clear the model', () => {
			component.model = stringOptions;

			component.uncheckAll();

			expect(component.model.length).toBe(0);
		});

		it('should emit onRemoved for every removed option', () => {
			component.model.push(stringOption1, stringOption2);

			component.uncheckAll();

			expect(component.onRemoved.emit).toHaveBeenCalledTimes(2);
			expect(component.onRemoved.emit).toHaveBeenCalledWith(stringOption1);
			expect(component.onRemoved.emit).toHaveBeenCalledWith(stringOption2);
		});
	});

	describe('with `dropup` variation', () => {
		beforeEach(() => {
			component.dropup = true;
			fixture.detectChanges();
		});

		it('should enable the `.dropup` class', () => {
			const dropup = fixture.debugElement.query(By.css('.dropup'));
			expect(dropup).toBeDefined();
		});
	});
});
