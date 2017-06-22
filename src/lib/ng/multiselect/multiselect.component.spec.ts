import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {MultiselectComponent} from './multiselect.component';
import {FormsModule} from '@angular/forms';
import {Pipe, PipeTransform} from '@angular/core';
import {MultiselectConfig} from './multiselect.config';
import {MockTranslatePipe} from '../../../../testhelpers';
import {By} from '@angular/platform-browser';
import {MultiselectTexts} from './multiselect.texts';

describe('MultiselectComponent', () => {
	let fixture: ComponentFixture<MultiselectComponent>;
	let component: MultiselectComponent;

	const stringOption1 = 'fuu';
	const stringOption2 = 'bar';
	const stringOption3 = 'baz';

	const stringOptions = [
		stringOption1,
		stringOption2,
		stringOption3
	];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				MultiselectComponent,
				MockSearchPipe,
				MockTranslatePipe
			],
			imports: [FormsModule],
			providers: [
				MultiselectConfig,
				MultiselectTexts
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MultiselectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	describe('toggleDropdown', () => {
		it('should be triggered by a click on the .multiselect-toggle button', () => {
			spyOn(component, 'toggleDropdown').and.callThrough();
			let button = fixture.debugElement.query(By.css('.multiselect-toggle'));

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

		it('should use labelFormatter if it\'s set', () => {
			const formatterReturnValue = 'FuuBar';

			component.labelFormatter = jasmine.createSpy('formatter').and.callFake((val) => {
				return formatterReturnValue;
			});

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

			let buttons = fixture.debugElement.queryAll(By.css('.dropdown-item'));

			buttons[0].nativeElement.click();

			expect(component.toggleSelection).toHaveBeenCalled();
			expect(component.toggleSelection).toHaveBeenCalledWith(stringOption1);
		});

		it('should add option to model, if it isn\'t already selected', () => {
			component.toggleSelection(stringOption1);

			expect(component.model.length).toBe(1);
			expect(component.model).toContain(stringOption1);
		});

		it('should emit onAdded, if option isn\'t already selected', () => {
			spyOn(component.onAdded, 'emit');

			component.toggleSelection(stringOption1);

			expect(component.onAdded.emit).toHaveBeenCalledWith(stringOption1);
		});

		it('should remove option from model, if it\'s already selected', () => {
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
				component.settings.selectionLimit = 2;
				component.model.push(stringOption1);
				component.model.push(stringOption2);
			});

			it('should emit selectionLimitReached, if there are already enough selected options', () => {
				spyOn(component.selectionLimitReached, 'emit');

				component.toggleSelection(stringOption3);

				expect(component.selectionLimitReached.emit).toHaveBeenCalled();
			});

			it('shouldn\'t add item to model, if there are already enough selected options', () => {
				spyOn(component.selectionLimitReached, 'emit');

				component.toggleSelection(stringOption3);

				expect(component.model.length).toBe(2);
			});
		});
	});

	describe('updateTitle()', () => {
		beforeEach(() => {
			component.settings.dynamicTitleMaxItems = 0;
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
				component.settings.dynamicTitleMaxItems = 2;
				component.options = stringOptions;
			});

			it('should still set the title to text.defaultTitle, if no option is selected', () => {
				component.updateTitle();

				expect(component.title).toBe(component.texts.defaultTitle);
			});

			it('should set the title to the selected option, if only one option is selected', () => {
				component.model.push(stringOption1);
				component.updateTitle();

				expect(component.title).toBe(stringOption1);
			});

			it('should set the title to contain every selected option, if selected options <= dynamicTitleMaxItem  ', () => {
				component.model.push(stringOption1, stringOption2);
				component.updateTitle();

				expect(component.title).toBe(`${stringOption1}, ${stringOption2}`);
			});
		});
	});

	describe('checkAll()', () => {
		beforeEach(() => {
			spyOn(component.onAdded, 'emit').and.callThrough();

			component.settings.showCheckAll = true;
			component.options = stringOptions;
		});

		it('should be triggered by a click on .multiselect-control-check button', () => {
			spyOn(component, 'checkAll').and.callThrough();
			component.isVisible = true;
			fixture.detectChanges();

			let button = fixture.debugElement.query(By.css('button.multiselect-control-check'));

			button.nativeElement.click();

			expect(component.checkAll).toHaveBeenCalled();
		});

		it('should select every option', () => {
			component.checkAll();

			expect(component.model.length).toBe(component.options.length);
			component.options.forEach((option) => {
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

			component.settings.showUncheckAll = true;
			component.options = stringOptions;
		});

		it('should be triggered by a click on .multiselect-control-uncheck button', () => {
			spyOn(component, 'uncheckAll').and.callThrough();
			component.isVisible = true;
			fixture.detectChanges();

			let button = fixture.debugElement.query(By.css('button.multiselect-control-uncheck'));

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
			let dropup = fixture.debugElement.query(By.css('.dropup'));
			expect(dropup).toBeDefined();
		});
	});
});

@Pipe({
	name: 'searchFilter'
})
class MockSearchPipe implements PipeTransform {
	transform(value: any, args: any): any {
		return value;
	}
}
