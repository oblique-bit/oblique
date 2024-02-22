import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {CommonModule} from '@angular/common';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Component} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {ControlValueAccessor, FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatAutocompleteHarness} from '@angular/material/autocomplete/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatInputModule} from '@angular/material/input';
import {MatInputHarness} from '@angular/material/input/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup} from '../autocomplete/autocomplete.model';
import {ObOptionLabelIconModule} from '../autocomplete/option-label-icon/option-label-icon.module';
import {ObInputClearModule} from '../input-clear/input-clear.module';
import {ObMockTranslateParamsModule} from '../translate-params/_mocks/mock-translate-params.module';
import {ObAutocompleteHarness} from './../autocomplete/_harness/autocomplete.harness';
import {ObMockHighlightTextPipe} from './_mocks/mock-highlight-text.pipe';
import {ObAutocompleteTextToFindService} from './autocomplete-text-to-find.service';
import {ObAutocompleteComponent} from './autocomplete.component';

@Component({
	template: ``
})
class TestParentComponent {
	model = new FormControl('');
	autocompleteOptions: (ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[] = [{label: 'c 5', disabled: false}];
	inputType = 'text';
	optionIconPosition = 'start';
	inputLabel = 'search.title';
	noResultKey = 'no.result.key';
	searchText = '';
	isDisabled = false;
	parentFormControl = new FormGroup({model: this.model});
}

describe(ObAutocompleteComponent.name, () => {
	let fixture: ComponentFixture<ObAutocompleteComponent>;
	let component: ObAutocompleteComponent;
	let parentFixture: ComponentFixture<TestParentComponent>;
	let parentComponent: TestParentComponent;
	let loader: HarnessLoader;
	let obAutocompleteHarness: ObAutocompleteHarness;
	let valueAccessor: readonly ControlValueAccessor[];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ObAutocompleteComponent,
				ObMockTranslatePipe,
				ObMockHighlightTextPipe,
				FormsModule,
				MatAutocompleteModule,
				MatFormFieldModule,
				MatIconModule,
				MatInputModule,
				ObInputClearModule,
				ReactiveFormsModule,
				HttpClientTestingModule,
				ObMockTranslateParamsModule,
				ObOptionLabelIconModule,
				NoopAnimationsModule,
				CommonModule,
				MatIconTestingModule,
				TranslateModule
			],
			declarations: [TestParentComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}, {provide: ObAutocompleteTextToFindService}]
		}).compileComponents();
	});

	describe('Only ObAutocompleteComponent', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(ObAutocompleteComponent);
			component = fixture.componentInstance;
			valueAccessor = fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
		});

		it('should create component', () => {
			expect(component).toBeTruthy();
		});

		it('should have a form control', () => {
			expect(component.autocompleteInputControl).toBeTruthy();
		});

		it('should have ControlValueAccessor', () => {
			expect(valueAccessor).toBeTruthy();
		});

		it('should have styling class ob-autocomplete', () => {
			expect(fixture.debugElement.classes['ob-autocomplete']).toBe(true);
		});

		describe('Default values', () => {
			it('should have an inputLabelKey to be i18n.oblique.search.title', () => {
				expect(component.inputLabelKey).toBe('i18n.oblique.search.title');
			});

			it('should have property of noResultKey to be i18n.oblique.search.no-results', () => {
				expect(component.noResultKey).toBe('i18n.oblique.search.no-results');
			});

			it('should have autocompleteOptions to be empty', () => {
				expect(component.autocompleteOptions.length).toBe(0);
			});

			it("should have filterRegex.flags to be 'gi'", () => {
				expect(component.filterRegexFlag).toBe('gi');
			});

			it("should highlightCssClass to be 'ob-highlight-text'", () => {
				expect(component.highlightCssClass).toBe('ob-highlight-text');
			});

			it("should have optionIconPosition to be 'end'", () => {
				expect(component.optionIconPosition).toBe('end');
			});

			it("should have control with value ''", () => {
				expect(component.autocompleteInputControl.value).toBe('');
			});

			it('should have hasGroupOptions with value false', () => {
				expect(component.hasGroupOptions).toBe(false);
			});

			it('should throw error if onModelTouched has not been overwritten ', () => {
				expect(component.onModelTouched).toThrowError('Method onModelTouched has not been overwritten by the ControlValueAccessor.');
			});
		});
	});

	describe('Form Wrapped', () => {
		beforeEach(() => {
			parentFixture = TestBed.overrideComponent(TestParentComponent, {
				set: {
					template: `<form [formGroup]="parentFormControl"><ob-autocomplete formControlName="model"></ob-autocomplete></form>`
				}
			}).createComponent(TestParentComponent);
			parentComponent = parentFixture.componentInstance;
			component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
			parentFixture.detectChanges();
		});

		it('should get the value as changed in autocompleteComponent ', done => {
			parentComponent.parentFormControl.get('model').valueChanges.subscribe(value => {
				expect(value).toBe('fat unicorn');
				done();
			});
			component.autocompleteInputControl.setValue('fat unicorn');
		});
	});
	describe.each([
		{
			caseDescription: 'ReactiveForm',
			template: `<ob-autocomplete
			(selectedOptionChange)="showSelection($event)"
				[autocompleteOptions]="autocompleteOptions"
				[optionIconPosition]="optionIconPosition"
				[inputLabelKey]="inputLabel"
				[noResultKey]="noResultKey"
				[formControl]="model"
				>
				</ob-autocomplete>`
		},
		{
			caseDescription: 'Form (Template driven)',
			template: `<ob-autocomplete
			(selectedOptionChange)="showSelection($event)"
				[(ngModel)]="searchText"
				[autocompleteOptions]="autocompleteOptions"
				[optionIconPosition]="optionIconPosition"
				[inputLabelKey]="inputLabel"
				[noResultKey]="noResultKey"
				[disabled]="isDisabled">
				</ob-autocomplete>`
		}
	])('$caseDescription', ({template}) => {
		const firstTestOptionList = [
			{label: 'unicorn a 1', disabled: false},
			{label: 'fat unicorn b 2', disabled: false},
			{label: 'boring b 3', disabled: false},
			{label: 'fat unicorn c 4', disabled: false}
		] as ObIAutocompleteInputOption[];
		const secondTestOptionList = [
			{label: 'rolling unicorn', disabled: false},
			{label: 'fat unicorn b 2', disabled: false},
			{label: 'fat unicorn c 4', disabled: false},
			{label: 'c 5', disabled: false}
		] as ObIAutocompleteInputOption[];
		const optionGroups: ObIAutocompleteInputOptionGroup[] = [
			{
				groupLabel: 'group 1',
				disabled: false,
				groupOptions: firstTestOptionList
			},
			{
				groupLabel: 'extraordinary fat unicorn',
				disabled: false,
				groupOptions: secondTestOptionList
			}
		] as ObIAutocompleteInputOptionGroup[];

		beforeEach(async () => {
			parentFixture = TestBed.overrideComponent(TestParentComponent, {
				set: {
					template
				}
			}).createComponent(TestParentComponent);
			parentComponent = parentFixture.componentInstance;
			component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
			jest.spyOn(component, 'registerOnChange');
			jest.spyOn(component, 'registerOnTouched');
			jest.spyOn(component, 'setDisabledState');
			jest.spyOn(component, 'writeValue');
			loader = TestbedHarnessEnvironment.documentRootLoader(parentFixture);
			obAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, ObAutocompleteHarness);
			parentFixture.detectChanges();
			parentComponent.model = new FormControl<string>('have the same value as FormControl in parent');
			parentComponent.searchText = 'have the same value as FormControl in parent';
			parentFixture.detectChanges();
		});

		it(`should create ${TestParentComponent.name}`, () => {
			expect(parentComponent).toBeTruthy();
		});

		it(`should have ${ObAutocompleteComponent.name}`, () => {
			expect(component).toBeTruthy();
		});

		it('should have a mat-form-field', async () => {
			const matFormFiledHarness = await loader.getHarnessOrNull(MatFormFieldHarness);
			const host = await matFormFiledHarness.host();
			expect(host).toBeTruthy();
		});

		it('should have a matAutocomplete', async () => {
			const matAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, MatAutocompleteHarness);
			const host = await matAutocompleteHarness.host();
			expect(host).toBeTruthy();
		});

		it('should have an input', async () => {
			const matInputHarness = await loader.getHarnessOrNull(MatInputHarness);
			const host = await matInputHarness.host();
			expect(host).toBeTruthy();
		});

		// ensures the ControlValueAccessor is correct implemented and used
		describe('registerOnChange', () => {
			it('should be called', () => {
				expect(component.registerOnChange).toBeCalled();
			});
		});

		// ensures the ControlValueAccessor is correct implemented and used
		describe('registerOnTouched', () => {
			it('should be called', () => {
				expect(component.registerOnTouched).toBeCalled();
			});
		});

		// ensures the ControlValueAccessor is correct implemented and used
		describe('onModelTouched', () => {
			it('should called onModelTouched by blur', async () => {
				jest.spyOn(component, 'onModelTouched');
				obAutocompleteHarness = await loader.getHarnessOrNull(ObAutocompleteHarness);
				const inputElement = await obAutocompleteHarness.getInputElement();
				await inputElement.blur();
				expect(component.onModelTouched).toBeCalled();
			});
		});

		describe('writeValue', () => {
			it('should be called ', () => {
				expect(component.writeValue).toBeCalled();
			});
		});

		// ensures the ControlValueAccessor is correct implemented and used
		describe('setDisabledState', () => {
			it('should called setDisabledState with true', fakeAsync(() => {
				parentComponent.model.enable();
				parentComponent.isDisabled = false;
				parentFixture.detectChanges();

				parentComponent.model.disable();
				parentComponent.isDisabled = true;
				parentFixture.detectChanges();
				tick();
				expect(component.setDisabledState).toBeCalledWith(true);
			}));

			it('should called setDisabledState with false', fakeAsync(() => {
				parentComponent.model.disable();
				parentComponent.isDisabled = true;
				parentFixture.detectChanges();

				parentComponent.model.enable();
				parentComponent.isDisabled = false;
				parentFixture.detectChanges();
				tick();
				expect(component.setDisabledState).toBeCalledWith(false);
			}));
		});

		describe('status of autocompleteInputControl', () => {
			it('should changed to VALID', fakeAsync(() => {
				parentComponent.model.disable();
				parentComponent.isDisabled = true;
				parentFixture.detectChanges();

				parentComponent.model.enable();
				parentComponent.isDisabled = false;
				parentFixture.detectChanges();
				tick();
				expect(component.autocompleteInputControl.status).toBe('VALID');
			}));

			it('should changed to DISABLED', fakeAsync(() => {
				parentComponent.model.enable();
				parentComponent.isDisabled = false;
				parentFixture.detectChanges();

				parentComponent.model.disable();
				parentComponent.isDisabled = true;
				parentFixture.detectChanges();
				tick();
				expect(component.autocompleteInputControl.status).toBe('DISABLED');
			}));
		});

		describe('by setting or changing inputLabelKey', () => {
			it("should have an label with inputLabelKey='i18n.oblique.search.title'", async () => {
				parentComponent.inputLabel = 'i18n.oblique.search.title';
				parentFixture.detectChanges();
				obAutocompleteHarness = await loader.getHarnessOrNull(ObAutocompleteHarness);
				const label = await obAutocompleteHarness.getFormLabel();
				expect(label).toBe('i18n.oblique.search.title');
			});

			it("should not have an label if inputLabelKey = ''", async () => {
				parentComponent.inputLabel = '';
				parentFixture.detectChanges();
				obAutocompleteHarness = await loader.getHarnessOrNull(ObAutocompleteHarness);
				const label = await obAutocompleteHarness.getFormLabel();
				expect(label).toBeNull();
			});
		});

		describe('by setting or changing noResultKey', () => {
			it("should have an mat-option with option label = 'i18n.oblique.search.no-results' if autocomplete is visible and filtered options list is empty", async () => {
				parentComponent.noResultKey = 'i18n.oblique.search.no-results';
				parentComponent.autocompleteOptions = [];
				parentFixture.detectChanges();
				const options = await obAutocompleteHarness.openPanelAndGetAllOptions();
				expect(await options[0].text()).toBe('i18n.oblique.search.no-results');
			});

			it("should not have an no-result mat-option if noResultKey = '' input is focused and filtered options list is empty", async () => {
				parentComponent.noResultKey = '';
				parentComponent.autocompleteOptions = [];
				parentFixture.detectChanges();
				const options = await obAutocompleteHarness.openPanelAndGetAllOptions();
				expect(options.length).toBe(0);
			});

			it('should not have an mat-option with text of noResultKey if input is focused and filtered options list has options', async () => {
				parentComponent.autocompleteOptions = firstTestOptionList;
				parentFixture.detectChanges();
				const options = await obAutocompleteHarness.openPanelAndGetAllOptions();
				expect(await options[options.length - 1].text()).toBe('fat unicorn c 4');
			});
		});

		describe('by setting or changing autocompleteOptions', () => {
			it('should show all options if input empty', async () => {
				parentComponent.autocompleteOptions = firstTestOptionList;
				parentComponent.searchText = '';
				parentComponent.model.setValue('');
				parentFixture.detectChanges();
				const optionLabelPromise = [];
				const visibleOptions = await obAutocompleteHarness.openPanelAndGetAllOptions();
				for (const item of visibleOptions) {
					optionLabelPromise.push(item.text());
				}
				const visibleOptionLabels = await Promise.all(optionLabelPromise);
				expect(visibleOptionLabels).toEqual(firstTestOptionList.map(value => value.label));
			});

			it('should have option groups', async () => {
				parentComponent.autocompleteOptions = optionGroups;
				parentFixture.detectChanges();
				const groups = await obAutocompleteHarness.openPanelAndGetAllOptionGroups();
				expect(groups.length).toBe(2);
			});

			it('should have disabled second option', async () => {
				parentComponent.autocompleteOptions = firstTestOptionList;
				parentComponent.autocompleteOptions[1].disabled = true;

				const option = await obAutocompleteHarness.openPanelAndGetAllOptions();
				expect(await option[1].getAttribute('aria-disabled')).toBe('true');
			});

			it('should have disabled second optionGroup', async () => {
				parentComponent.autocompleteOptions = optionGroups;
				parentComponent.autocompleteOptions[1].disabled = true;
				parentFixture.detectChanges();
				const group = await obAutocompleteHarness.openPanelAndGetAllOptionGroups();
				expect(await group[1].getAttribute('aria-disabled')).toBe('true');
			});
		});
	});
});
