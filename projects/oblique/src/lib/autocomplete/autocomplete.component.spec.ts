import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {CommonModule} from '@angular/common';
import {ChangeDetectorRef, Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {
	ControlValueAccessor,
	FormControl,
	FormGroup,
	FormsModule,
	NG_VALUE_ACCESSOR,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatAutocompleteHarness} from '@angular/material/autocomplete/testing';
import {MatOptionHarness} from '@angular/material/core/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {MatIconModule} from '@angular/material/icon';
import {MatIconTestingModule} from '@angular/material/icon/testing';
import {MatInputModule} from '@angular/material/input';
import {MatInputHarness} from '@angular/material/input/testing';
import {By} from '@angular/platform-browser';

import {ObIAutocompleteInputOption, ObIAutocompleteInputOptionGroup} from '../autocomplete/autocomplete.model';
import {ObOptionLabelIconModule} from '../autocomplete/option-label-icon/option-label-icon.module';
import {ObInputClearModule} from '../input-clear/input-clear.module';
import {ObMockTranslateParamsModule} from '../translate-params/_mocks/mock-translate-params.module';
import {ObAutocompleteHarness} from './../autocomplete/_harness/autocomplete.harness';
import {ObMockHighlightTextPipe} from './_mocks/mock-highlight-text.pipe';
import {ObAutocompleteTextToFindService} from './autocomplete-text-to-find.service';
import {ObAutocompleteComponent} from './autocomplete.component';
import {provideObliqueTestingConfiguration} from '../utilities';

@Component({
	standalone: false,
	template: ``,
})
class TestParentComponent {
	model = new FormControl('', Validators.required);
	autocompleteOptions: (ObIAutocompleteInputOption<unknown> | ObIAutocompleteInputOptionGroup<unknown>)[] = [
		{label: 'c 5', disabled: false},
	];
	inputType = 'text';
	optionIconPosition = 'start';
	inputLabel = 'search.title';
	noResultKey = 'no.result.key';
	searchText = '';
	isDisabled = false;
	parentFormControl = new FormGroup({model: this.model});
	displayWith(option: {name: string}): string {
		return option.name;
	}
}

describe(ObAutocompleteComponent.name, () => {
	let fixture: ComponentFixture<ObAutocompleteComponent<any>>;
	let component: ObAutocompleteComponent;
	let parentFixture: ComponentFixture<TestParentComponent>;
	let parentComponent: TestParentComponent;
	let autocompleteChangeDetectorRef: ChangeDetectorRef;
	let loader: HarnessLoader;
	let obAutocompleteHarness: ObAutocompleteHarness;
	let valueAccessor: readonly ControlValueAccessor[];

	afterEach(() => {
		jest.useRealTimers();
	});

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				ObAutocompleteComponent,
				ObMockHighlightTextPipe,
				FormsModule,
				MatAutocompleteModule,
				MatFormFieldModule,
				MatIconModule,
				MatInputModule,
				ObInputClearModule,
				ReactiveFormsModule,
				ObMockTranslateParamsModule,
				ObOptionLabelIconModule,
				CommonModule,
				MatIconTestingModule,
			],
			declarations: [TestParentComponent],
			providers: [provideObliqueTestingConfiguration(), {provide: ObAutocompleteTextToFindService}],
		}).compileComponents();
	});

	describe('Only ObAutocompleteComponent', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent<ObAutocompleteComponent>(ObAutocompleteComponent);
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
				expect(component.autocompleteOptions().length).toBe(0);
			});

			it("should have filterRegex.flags to be 'gi'", () => {
				expect(component.filterRegexFlag()).toBe('gi');
			});

			it("should highlightCssClass to be 'ob-highlight-text'", () => {
				expect(component.highlightCssClass()).toBe('ob-highlight-text');
			});

			it("should have optionIconPosition to be 'end'", () => {
				expect(component.optionIconPosition()).toBe('end');
			});

			it("should have control with value ''", () => {
				expect(component.autocompleteInputControl.value).toBe('');
			});

			it('should have hasGroupOptions with value false', () => {
				expect(component.hasGroupOptions).toBe(false);
			});
		});
	});

	describe('Content projection', () => {
		beforeEach(() => {
			parentFixture = TestBed.overrideComponent(TestParentComponent, {
				set: {
					template: `<form [formGroup]="parentFormControl"><ob-autocomplete formControlName="model"><mat-hint>hello</mat-hint></ob-autocomplete></form>`,
				},
			}).createComponent(TestParentComponent);
			parentComponent = parentFixture.componentInstance;
			loader = TestbedHarnessEnvironment.loader(parentFixture);
			component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
			parentFixture.detectChanges();
		});

		it('should project the mat-hint', async () => {
			const formField = await loader.getHarness(MatFormFieldHarness);
			const hints = await formField.getTextHints();

			expect(hints).toContain('hello');
		});
	});

	describe('Form Wrapped', () => {
		beforeEach(() => {
			parentFixture = TestBed.overrideComponent(TestParentComponent, {
				set: {
					template: `<form [formGroup]="parentFormControl"><ob-autocomplete formControlName="model"></ob-autocomplete></form>`,
				},
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
				</ob-autocomplete>`,
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
				</ob-autocomplete>`,
		},
	])('$caseDescription', ({template}) => {
		const firstTestOptionList = [
			{label: 'unicorn a 1', disabled: false},
			{label: 'fat unicorn b 2', disabled: false},
			{label: 'boring b 3', disabled: false},
			{label: 'fat unicorn c 4', disabled: false},
		] as ObIAutocompleteInputOption[];
		const secondTestOptionList = [
			{label: 'rolling unicorn', disabled: false},
			{label: 'fat unicorn b 2', disabled: false},
			{label: 'fat unicorn c 4', disabled: false},
			{label: 'c 5', disabled: false},
		] as ObIAutocompleteInputOption[];
		const optionGroups: ObIAutocompleteInputOptionGroup[] = [
			{
				groupLabel: 'group 1',
				disabled: false,
				groupOptions: firstTestOptionList,
			},
			{
				groupLabel: 'extraordinary fat unicorn',
				disabled: false,
				groupOptions: secondTestOptionList,
			},
		] as ObIAutocompleteInputOptionGroup[];

		beforeEach(async () => {
			parentFixture = TestBed.overrideComponent(TestParentComponent, {
				set: {
					template,
				},
			}).createComponent(TestParentComponent);
			parentComponent = parentFixture.componentInstance;
			component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
			autocompleteChangeDetectorRef = parentFixture.debugElement
				.query(By.directive(ObAutocompleteComponent))
				.injector.get(ChangeDetectorRef);
			jest.spyOn(component, 'registerOnChange');
			jest.spyOn(component, 'registerOnTouched');
			jest.spyOn(component, 'setDisabledState');
			jest.spyOn(component, 'writeValue');
			loader = TestbedHarnessEnvironment.documentRootLoader(parentFixture);
			obAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, ObAutocompleteHarness);
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
			const matAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(
				parentFixture,
				MatAutocompleteHarness
			);
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
				expect(component.registerOnChange).toHaveBeenCalled();
			});
		});

		// ensures the ControlValueAccessor is correct implemented and used
		describe('registerOnTouched', () => {
			it('should be called', () => {
				expect(component.registerOnTouched).toHaveBeenCalled();
			});
		});

		// ensures the ControlValueAccessor is correct implemented and used
		describe('onModelTouched', () => {
			it('should called onModelTouched by blur', async () => {
				const onModelTouched = jest.fn();
				component.registerOnTouched(onModelTouched);
				obAutocompleteHarness = await loader.getHarnessOrNull(ObAutocompleteHarness);
				const inputElement = await obAutocompleteHarness.getInputElement();
				await inputElement.blur();
				expect(onModelTouched).toHaveBeenCalled();
			});
		});

		describe('writeValue', () => {
			it('should be called ', () => {
				expect(component.writeValue).toHaveBeenCalled();
			});
		});

		// ensures the ControlValueAccessor is correct implemented and used
		describe('setDisabledState', () => {
			it('should called setDisabledState with true', async () => {
				parentComponent.model.enable();
				parentComponent.isDisabled = false;
				parentFixture.componentRef.changeDetectorRef.detectChanges();
				await parentFixture.whenStable();

				parentComponent.model.disable();
				parentComponent.isDisabled = true;
				parentFixture.componentRef.changeDetectorRef.detectChanges();
				await parentFixture.whenStable();
				expect(component.setDisabledState).toHaveBeenCalledWith(true);
			});

			it('should called setDisabledState with false', async () => {
				parentComponent.model.disable();
				parentComponent.isDisabled = true;
				parentFixture.componentRef.changeDetectorRef.detectChanges();
				await parentFixture.whenStable();

				parentComponent.model.enable();
				parentComponent.isDisabled = false;
				parentFixture.componentRef.changeDetectorRef.detectChanges();
				await parentFixture.whenStable();
				expect(component.setDisabledState).toHaveBeenCalledWith(false);
			});
		});

		describe('status of autocompleteInputControl', () => {
			it('should changed to VALID', async () => {
				parentComponent.model.disable();
				parentComponent.isDisabled = true;
				parentFixture.componentRef.changeDetectorRef.detectChanges();
				await parentFixture.whenStable();

				parentComponent.model.enable();
				parentComponent.isDisabled = false;
				parentFixture.componentRef.changeDetectorRef.detectChanges();
				await parentFixture.whenStable();
				expect(component.autocompleteInputControl.status).toBe('VALID');
			});

			it('should changed to DISABLED', async () => {
				parentComponent.model.enable();
				parentComponent.isDisabled = false;
				parentFixture.componentRef.changeDetectorRef.detectChanges();
				await parentFixture.whenStable();

				parentComponent.model.disable();
				parentComponent.isDisabled = true;
				parentFixture.componentRef.changeDetectorRef.detectChanges();
				await parentFixture.whenStable();
				expect(component.autocompleteInputControl.status).toBe('DISABLED');
			});
		});

		describe('by setting or changing inputLabelKey', () => {
			it("should have an label with inputLabelKey='i18n.oblique.search.title'", async () => {
				component.inputLabelKey = 'i18n.oblique.search.title';
				autocompleteChangeDetectorRef.detectChanges();
				await parentFixture.whenStable();
				obAutocompleteHarness = await loader.getHarnessOrNull(ObAutocompleteHarness);
				const label = await obAutocompleteHarness.getFormLabel();
				expect(label).toBe('i18n.oblique.search.title');
			});

			it("should not have an label if inputLabelKey = ''", async () => {
				component.inputLabelKey = '';
				autocompleteChangeDetectorRef.detectChanges();
				await parentFixture.whenStable();
				obAutocompleteHarness = await loader.getHarnessOrNull(ObAutocompleteHarness);
				const label = await obAutocompleteHarness.getFormLabel();
				expect(label).toBeNull();
			});
		});

		describe('by setting or changing noResultKey', () => {
			it("should have an mat-option with option label = 'i18n.oblique.search.no-results' if autocomplete is visible and filtered options list is empty", async () => {
				component.noResultKey = 'i18n.oblique.search.no-results';
				parentComponent.autocompleteOptions = [];
				component.autocompleteInputControl.setValue('');
				component.ngOnChanges();
				autocompleteChangeDetectorRef.detectChanges();
				await parentFixture.whenStable();
				await obAutocompleteHarness.openAutocompletePanel();
				parentFixture.detectChanges();
				autocompleteChangeDetectorRef.detectChanges();
				const options = await loader.getAllHarnesses(MatOptionHarness);
				expect(await options[0].getText()).toBe('i18n.oblique.search.no-results');
			});

			it("should not have an no-result mat-option if noResultKey = '' input is focused and filtered options list is empty", async () => {
				component.noResultKey = '';
				parentComponent.autocompleteOptions = [];
				component.autocompleteInputControl.setValue('');
				component.ngOnChanges();
				autocompleteChangeDetectorRef.detectChanges();
				await parentFixture.whenStable();
				await obAutocompleteHarness.openAutocompletePanel();
				autocompleteChangeDetectorRef.detectChanges();
				const options = await loader.getAllHarnesses(MatOptionHarness);
				expect(options.length).toBe(0);
			});

			it('should not have an mat-option with text of noResultKey if input is focused and filtered options list has options', async () => {
				parentFixture = TestBed.createComponent(TestParentComponent);
				parentComponent = parentFixture.componentInstance;
				parentComponent.model = new FormControl<string>('');
				parentComponent.parentFormControl = new FormGroup({model: parentComponent.model});
				parentComponent.searchText = '';
				parentComponent.autocompleteOptions = firstTestOptionList;
				component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
				loader = TestbedHarnessEnvironment.documentRootLoader(parentFixture);
				obAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, ObAutocompleteHarness);
				parentFixture.detectChanges();
				await parentFixture.whenStable();
				await obAutocompleteHarness.openAutocompletePanel();
				parentFixture.detectChanges();
				const options = await loader.getAllHarnesses(MatOptionHarness);
				expect(await options[options.length - 1].getText()).toBe('fat unicorn c 4');
			});
		});

		describe('by setting or changing autocompleteOptions', () => {
			it('should show all options if input empty', async () => {
				parentFixture = TestBed.createComponent(TestParentComponent);
				parentComponent = parentFixture.componentInstance;
				parentComponent.model = new FormControl<string>('');
				parentComponent.parentFormControl = new FormGroup({model: parentComponent.model});
				parentComponent.searchText = '';
				parentComponent.autocompleteOptions = firstTestOptionList;
				component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
				loader = TestbedHarnessEnvironment.documentRootLoader(parentFixture);
				obAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, ObAutocompleteHarness);
				parentFixture.detectChanges();
				await parentFixture.whenStable();
				await obAutocompleteHarness.openAutocompletePanel();
				parentFixture.detectChanges();
				const optionLabelPromises: Promise<string>[] = [];
				const visibleOptions = await loader.getAllHarnesses(MatOptionHarness);
				for (const option of visibleOptions) {
					optionLabelPromises.push(option.getText());
				}
				const visibleOptionLabels = await Promise.all(optionLabelPromises);
				expect(visibleOptionLabels).toEqual(firstTestOptionList.map(value => value.label));
			});

			it('should have option groups', async () => {
				parentFixture = TestBed.createComponent(TestParentComponent);
				parentComponent = parentFixture.componentInstance;
				parentComponent.model = new FormControl<string>('');
				parentComponent.parentFormControl = new FormGroup({model: parentComponent.model});
				parentComponent.searchText = '';
				parentComponent.autocompleteOptions = optionGroups;
				component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
				loader = TestbedHarnessEnvironment.documentRootLoader(parentFixture);
				obAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, ObAutocompleteHarness);
				parentFixture.detectChanges();
				await parentFixture.whenStable();
				await obAutocompleteHarness.openAutocompletePanel();
				parentFixture.detectChanges();
				const groups = await obAutocompleteHarness.openPanelAndGetAllOptionGroups();
				expect(groups.length).toBe(2);
			});

			it('should have disabled second option', async () => {
				parentFixture = TestBed.createComponent(TestParentComponent);
				parentComponent = parentFixture.componentInstance;
				parentComponent.model = new FormControl<string>('');
				parentComponent.parentFormControl = new FormGroup({model: parentComponent.model});
				parentComponent.searchText = '';
				parentComponent.autocompleteOptions = firstTestOptionList;
				parentComponent.autocompleteOptions[1].disabled = true;
				component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
				loader = TestbedHarnessEnvironment.documentRootLoader(parentFixture);
				obAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, ObAutocompleteHarness);
				parentFixture.detectChanges();
				await parentFixture.whenStable();
				await obAutocompleteHarness.openAutocompletePanel();
				parentFixture.detectChanges();
				const options = await loader.getAllHarnesses(MatOptionHarness);
				expect(await options[1].isDisabled()).toBe(true);
			});

			it('should have disabled second optionGroup', async () => {
				parentFixture = TestBed.createComponent(TestParentComponent);
				parentComponent = parentFixture.componentInstance;
				parentComponent.model = new FormControl<string>('');
				parentComponent.parentFormControl = new FormGroup({model: parentComponent.model});
				parentComponent.searchText = '';
				parentComponent.autocompleteOptions = optionGroups;
				parentComponent.autocompleteOptions[1].disabled = true;
				component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
				loader = TestbedHarnessEnvironment.documentRootLoader(parentFixture);
				obAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, ObAutocompleteHarness);
				parentFixture.detectChanges();
				await parentFixture.whenStable();
				await obAutocompleteHarness.openAutocompletePanel();
				parentFixture.detectChanges();
				const groups = await obAutocompleteHarness.openPanelAndGetAllOptionGroups();
				expect(await groups[1].getAttribute('aria-disabled')).toBe('true');
			});
		});

		describe('ngDoCheck', () => {
			it('should not call updatePosition on the first check after opening', async () => {
				await obAutocompleteHarness.openAutocompletePanel();
				parentFixture.detectChanges();
				const updatePositionSpy = jest.spyOn(component.autocompleteTrigger, 'updatePosition');

				component.ngDoCheck();

				expect(updatePositionSpy).not.toHaveBeenCalled();
			});

			it('should call updatePosition when the position changes while the panel stays open', async () => {
				await obAutocompleteHarness.openAutocompletePanel();
				parentFixture.detectChanges();
				const updatePositionSpy = jest.spyOn(component.autocompleteTrigger, 'updatePosition');
				const rectSpy = jest.spyOn(component.elementRef.nativeElement, 'getBoundingClientRect');

				rectSpy.mockReturnValueOnce({top: 0, left: 0} as DOMRect);
				component.ngDoCheck();
				rectSpy.mockReturnValueOnce({top: 50, left: 0} as DOMRect);
				component.ngDoCheck();

				expect(updatePositionSpy).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe('displayWith', () => {
		beforeEach(async () => {
			parentFixture = TestBed.overrideComponent(TestParentComponent, {
				set: {
					template: `<form [formGroup]="parentFormControl">
									<ob-autocomplete formControlName="model" [autocompleteOptions]="autocompleteOptions" [displayWith]="displayWith"></ob-autocomplete>
									</form>`,
				},
			}).createComponent(TestParentComponent);
			parentComponent = parentFixture.componentInstance;
			component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
			loader = TestbedHarnessEnvironment.documentRootLoader(parentFixture);
			obAutocompleteHarness = await TestbedHarnessEnvironment.harnessForFixture(parentFixture, ObAutocompleteHarness);
			parentFixture.detectChanges();
		});

		it('modifies the display of the selected option using the displayWith method', async () => {
			parentComponent.autocompleteOptions = [{label: {name: 'hello'}}];
			parentFixture.componentRef.changeDetectorRef.detectChanges();
			await parentFixture.whenStable();
			await obAutocompleteHarness.openAutocompletePanel();
			await new Promise(resolve => {
				setTimeout(resolve, 250);
			});
			parentFixture.detectChanges();
			const options = await loader.getAllHarnesses(MatOptionHarness);
			await options[0].click();
			parentFixture.detectChanges();

			const input = parentFixture.nativeElement.querySelector('input');
			expect(input.value).toBe('hello');
		});
	});

	describe('filter options', () => {
		const testData = [
			[
				'dragon',
				[{label: 'fat dragon 1'}, {label: 'fat dragon 2'}, {label: 'unicorn 1'}],
				[{label: 'fat dragon 1'}, {label: 'fat dragon 2'}],
			],
			[
				'Dragon',
				[{label: 'fat dragon 1'}, {label: 'fat dragon 2'}, {label: 'unicorn 1'}],
				[{label: 'fat dragon 1'}, {label: 'fat dragon 2'}],
			],
			[
				'1',
				[{label: 'fat dragon 1'}, {label: 'fat dragon 2'}, {label: 'unicorn 1'}],
				[{label: 'fat dragon 1'}, {label: 'unicorn 1'}],
			],
			['2', [{label: 'fat dragon 1'}, {label: 'fat dragon 2'}, {label: 'unicorn 1'}], [{label: 'fat dragon 2'}]],
			[
				'search term that matches nothing',
				[{label: 'fat dragon 1'}, {label: 'fat dragon 2'}, {label: 'unicorn 1'}],
				[],
			],
			[
				'',
				[{label: 'fat dragon 1'}, {label: 'fat dragon 2'}, {label: 'unicorn 1'}],
				[{label: 'fat dragon 1'}, {label: 'fat dragon 2'}, {label: 'unicorn 1'}],
			],
			[
				'dragon',
				[{label: 'fat-dragon 1'}, {label: 'fat dragon 2'}],
				[{label: 'fat-dragon 1'}, {label: 'fat dragon 2'}],
			],
			['.', [{label: 'fat.dragon 1'}, {label: 'fat dragon 2'}], [{label: 'fat.dragon 1'}]],
		];
		const groupedOptions: ObIAutocompleteInputOptionGroup[] = [
			{
				groupLabel: 'group 1',
				disabled: false,
				groupOptions: [
					{label: 'unicorn a 1', disabled: false},
					{label: 'fat unicorn b 2', disabled: false},
				],
			},
			{
				groupLabel: 'group 2',
				disabled: false,
				groupOptions: [
					{label: 'rolling unicorn', disabled: false},
					{label: 'fat unicorn c 4', disabled: false},
				],
			},
		];

		beforeEach(() => {
			parentFixture = TestBed.overrideComponent(TestParentComponent, {
				set: {
					template: `<form [formGroup]="parentFormControl"><ob-autocomplete [autocompleteOptions]="autocompleteOptions" formControlName="model"></ob-autocomplete></form>`,
				},
			}).createComponent(TestParentComponent);

			parentComponent = parentFixture.componentInstance;
			component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
			parentComponent.model = new FormControl<string>('');
			parentComponent.searchText = '';
			parentFixture.detectChanges();
		});

		it.each(testData)(
			'should filter for %i',
			(searchTerm: string, options: {label: string}[], expectedOptions: {label: string}[]) => {
				jest.useFakeTimers();
				parentComponent.autocompleteOptions = options;

				let foundOptions: (ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[] = [];
				component.filteredOptions$.subscribe(filteredOptions => {
					foundOptions = filteredOptions;
				});

				component.autocompleteInputControl.setValue(searchTerm);
				parentFixture.detectChanges();
				jest.advanceTimersByTime(300);

				expect(foundOptions).toStrictEqual(expectedOptions);
			}
		);

		it.each(testData)(
			'should show expected amount of results',
			(searchTerm: string, options: {label: string}[], expectedOptions: {label: string}[]) => {
				jest.useFakeTimers();
				parentComponent.autocompleteOptions = options;

				let foundOptions: (ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[] = [];
				component.filteredOptions$.subscribe(filteredOptions => {
					foundOptions = filteredOptions;
				});

				component.autocompleteInputControl.setValue(searchTerm);
				parentFixture.detectChanges();
				jest.advanceTimersByTime(300);

				expect(foundOptions.length).toBe(expectedOptions.length);
			}
		);

		it('should filter grouped options and remove empty groups', () => {
			jest.useFakeTimers();
			parentComponent.autocompleteOptions = groupedOptions;

			let foundOptions: (ObIAutocompleteInputOption | ObIAutocompleteInputOptionGroup)[] = [];
			component.filteredOptions$.subscribe(filteredOptions => {
				foundOptions = filteredOptions;
			});

			component.autocompleteInputControl.setValue('rolling');
			parentFixture.detectChanges();
			jest.advanceTimersByTime(300);

			expect(foundOptions).toStrictEqual([
				{
					groupLabel: 'group 2',
					disabled: false,
					groupOptions: [{label: 'rolling unicorn', disabled: false}],
				},
			]);
		});
	});

	describe('With error messages', () => {
		beforeEach(() => {
			parentFixture = TestBed.overrideComponent(TestParentComponent, {
				set: {
					template: `<form [formGroup]="parentFormControl"><ob-autocomplete formControlName="model" withErrorMessages="true"></ob-autocomplete></form>`,
				},
			}).createComponent(TestParentComponent);
			parentComponent = parentFixture.componentInstance;
			component = parentFixture.debugElement.query(By.directive(ObAutocompleteComponent)).componentInstance;
			parentFixture.detectChanges();
		});

		test('input is invalid', () => {
			const input = parentFixture.debugElement.query(By.css('input'));
			expect(input.classes['ng-invalid']).toBe(true);
		});

		test('error is shown on blur', () => {
			const input = parentFixture.debugElement.query(By.css('input'));

			input.nativeElement.focus();
			input.nativeElement.blur();
			parentFixture.detectChanges();

			expect(parentFixture.debugElement.query(By.css('mat-error'))).toBeTruthy();
		});
	});
});
