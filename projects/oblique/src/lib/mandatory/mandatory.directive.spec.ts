import {Component, DebugElement} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {HarnessLoader} from '@angular/cdk/testing';
import {TestbedHarnessEnvironment} from '@angular/cdk/testing/testbed';
import {MatFormFieldHarness} from '@angular/material/form-field/testing';
import {MatSelectModule} from '@angular/material/select';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {ObMandatoryDirective} from './mandatory.directive';

@Component({
	template: ` <div [formGroup]="testForm">
		<mat-form-field data-test="input-required">
			<mat-label>Test input required</mat-label>
			<input type="text" matInput formControlName="inputRequired" />
		</mat-form-field>
		<mat-form-field data-test="input-dynamic-required">
			<mat-label>Test input dynamic required</mat-label>
			<input type="text" matInput formControlName="inputDynamicRequired" />
		</mat-form-field>
		<mat-form-field data-test="input-non-required">
			<mat-label>Test input non required</mat-label>
			<input type="text" matInput formControlName="inputNonRequired" />
		</mat-form-field>
		<mat-form-field data-test="input-date-required">
			<mat-label>Test input datepicker required</mat-label>
			<input matInput [matDatepicker]="pickerRequired" formControlName="inputDateRequired" />
			<mat-datepicker-toggle matSuffix [for]="pickerRequired"></mat-datepicker-toggle>
			<mat-datepicker #pickerRequired></mat-datepicker>
		</mat-form-field>
		<mat-form-field data-test="input-date-dynamic-required">
			<mat-label>Test input datepicker dynamic required</mat-label>
			<input matInput [matDatepicker]="pickerDynamicRequired" formControlName="inputDateDynamicRequired" />
			<mat-datepicker-toggle matSuffix [for]="pickerDynamicRequired"></mat-datepicker-toggle>
			<mat-datepicker #pickerDynamicRequired></mat-datepicker>
		</mat-form-field>
		<mat-form-field data-test="input-date-non-required">
			<mat-label>Test input datepicker non required</mat-label>
			<input matInput [matDatepicker]="pickerNonRequired" formControlName="inputDateNonRequired" />
			<mat-datepicker-toggle matSuffix [for]="pickerNonRequired"></mat-datepicker-toggle>
			<mat-datepicker #pickerNonRequired></mat-datepicker>
		</mat-form-field>
		<mat-form-field data-test="mat-select-required">
			<mat-label>Test mat-select required</mat-label>
			<mat-select formControlName="matSelectRequired">
				<mat-option [value]="1">One</mat-option>
				<mat-option [value]="2">Two</mat-option>
			</mat-select>
		</mat-form-field>
		<mat-form-field data-test="mat-select-dynamic-required">
			<mat-label>Test mat-select dynamic required</mat-label>
			<mat-select formControlName="matSelectDynamicRequired">
				<mat-option [value]="1">One</mat-option>
				<mat-option [value]="2">Two</mat-option>
			</mat-select>
		</mat-form-field>
		<mat-form-field data-test="mat-select-non-required">
			<mat-label>Test mat-select non required</mat-label>
			<mat-select formControlName="matSelectNonRequired">
				<mat-option [value]="1">One</mat-option>
				<mat-option [value]="2">Two</mat-option>
			</mat-select>
		</mat-form-field>
		<mat-form-field data-test="select-required">
			<mat-label>Test select required</mat-label>
			<select formControlName="selectRequired" matNativeControl>
				<option [value]="1">One</option>
				<option [value]="2">Two</option>
			</select>
		</mat-form-field>
		<mat-form-field data-test="select-dynamic-required">
			<mat-label>Test select dynamic required</mat-label>
			<select formControlName="selectDynamicRequired" matNativeControl>
				<option [value]="1">One</option>
				<option [value]="2">Two</option>
			</select>
		</mat-form-field>
		<mat-form-field data-test="select-non-required">
			<mat-label>Test select non required</mat-label>
			<select formControlName="selectNonRequired" matNativeControl>
				<option [value]="1">One</option>
				<option [value]="2">Two</option>
			</select>
		</mat-form-field>
		<mat-form-field data-test="textarea-required">
			<mat-label>Test textarea required</mat-label>
			<textarea matInput formControlName="textareaRequired"></textarea>
		</mat-form-field>
		<mat-form-field data-test="textarea-dynamic-required">
			<mat-label>Test textarea dynamic required</mat-label>
			<textarea matInput formControlName="textareaDynamicRequired"></textarea>
		</mat-form-field>
		<mat-form-field data-test="textarea-non-required">
			<mat-label>Test textarea non required</mat-label>
			<textarea matInput formControlName="textareaNonRequired"></textarea>
		</mat-form-field>
		<mat-form-field data-test="mat-chip-list-required">
			<mat-label>Test mat-chip-list required</mat-label>
			<mat-chip-list formControlName="matChipListRequired">
				<mat-chip>One</mat-chip>
				<mat-chip>Two</mat-chip>
			</mat-chip-list>
		</mat-form-field>
		<mat-form-field data-test="mat-chip-list-non-required">
			<mat-label>Test mat-chip-list non required</mat-label>
			<mat-chip-list formControlName="matChipListNonRequired">
				<mat-chip>One</mat-chip>
				<mat-chip>Two</mat-chip>
			</mat-chip-list>
		</mat-form-field>
		<mat-form-field data-test="mat-chip-list-dynamic-required">
			<mat-label>Test mat-chip-list dynamic required</mat-label>
			<mat-chip-list formControlName="matChipListDynamicRequired">
				<mat-chip>One</mat-chip>
				<mat-chip>Two</mat-chip>
			</mat-chip-list>
		</mat-form-field>
	</div>`
})
class TestComponent {
	testForm: FormGroup;

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit() {
		this.testForm = this.formBuilder.group({
			inputRequired: ['', Validators.required],
			inputDynamicRequired: '',
			inputNonRequired: '',
			inputDateRequired: ['', Validators.required],
			inputDateDynamicRequired: '',
			inputDateNonRequired: '',
			selectRequired: ['', Validators.required],
			selectDynamicRequired: '',
			selectNonRequired: '',
			matSelectRequired: ['', Validators.required],
			matSelectDynamicRequired: '',
			matSelectNonRequired: '',
			textareaRequired: ['', Validators.required],
			textareaDynamicRequired: '',
			textareaNonRequired: '',
			matChipListRequired: ['', Validators.required],
			matChipListDynamicRequired: '',
			matChipListNonRequired: ''
		});
	}

	setRequired(field: string): void {
		this.testForm.get(field).clearValidators();
		this.testForm.get(field).setValidators(Validators.required);
	}
}

describe('ObMandatoryDirective', () => {
	let directive: ObMandatoryDirective;
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let element: DebugElement;
	let loader: HarnessLoader;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [TestComponent, ObMandatoryDirective],
				imports: [
					ReactiveFormsModule,
					MatFormFieldModule,
					MatInputModule,
					MatSelectModule,
					MatChipsModule,
					MatDatepickerModule,
					MatNativeDateModule,
					NoopAnimationsModule
				]
			});
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		loader = TestbedHarnessEnvironment.loader(fixture);
		component = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(ObMandatoryDirective));
		directive = element.injector.get(ObMandatoryDirective);
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	it('should have an asterisk in the label of required input field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="input-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test input required *');
	});

	it('should have no asterisk in the label of non required input field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="input-non-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test input non required');
	});

	it('should have no asterisk in the label of dynamic non required input field and no validator is added', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="input-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test input dynamic required');
	});

	it('should have  asterisk in the label of dynamic required input field and validator is added', async () => {
		component.setRequired('inputDynamicRequired');
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="input-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test input dynamic required *');
	});

	it('should have an asterisk in the label of required input datepicker field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="input-date-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test input datepicker required *');
	});

	it('should have no asterisk in the label of non required input datepicker field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="input-date-non-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test input datepicker non required');
	});

	it('should have no asterisk in the label of dynamic non required input datepicker field and no validator is added', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="input-date-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test input datepicker dynamic required');
	});

	it('should have  asterisk in the label of dynamic required input datepicker field and validator is added', async () => {
		component.setRequired('inputDateDynamicRequired');
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="input-date-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test input datepicker dynamic required *');
	});

	it('should have an asterisk in the label of required mat-select field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="mat-select-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test mat-select required *');
	});

	it('should have no asterisk in the label of non required mat-select field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="mat-select-non-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test mat-select non required');
	});

	it('should have no asterisk in the label of dynamic non required mat-select field and no validator is added', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="mat-select-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test mat-select dynamic required');
	});

	it('should have  asterisk in the label of dynamic required mat-select field and validator is added', async () => {
		component.setRequired('matSelectDynamicRequired');
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="mat-select-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test mat-select dynamic required *');
	});

	it('should have an asterisk in the label of required select field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="select-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test select required *');
	});

	it('should have no asterisk in the label of non required select field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="select-non-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test select non required');
	});

	it('should have no asterisk in the label of dynamic non required select field and no validator is added', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="select-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test select dynamic required');
	});

	it('should have  asterisk in the label of dynamic required select field and validator is added', async () => {
		component.setRequired('selectDynamicRequired');
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="select-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test select dynamic required *');
	});

	it('should have an asterisk in the label of required textarea field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="textarea-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test textarea required *');
	});

	it('should have no asterisk in the label of non required textarea field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="textarea-non-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test textarea non required');
	});

	it('should have no asterisk in the label of dynamic non required textarea field and no validator is added', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="textarea-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test textarea dynamic required');
	});

	it('should have  asterisk in the label of dynamic required textarea field and validator is added', async () => {
		component.setRequired('textareaDynamicRequired');
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="textarea-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test textarea dynamic required *');
	});

	it('should have an asterisk in the label of required mat-chip-list field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="mat-chip-list-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test mat-chip-list required *');
	});

	it('should have no asterisk in the label of non required mat-chip-list field', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="mat-chip-list-non-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test mat-chip-list non required');
	});

	it('should have no asterisk in the label of dynamic non required mat-chip-list field and no validator is added', async () => {
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="mat-chip-list-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test mat-chip-list dynamic required');
	});

	it('should have  asterisk in the label of dynamic required mat-chip-list field and validator is added', async () => {
		component.setRequired('matChipListDynamicRequired');
		const formField = await loader.getHarness<MatFormFieldHarness>(MatFormFieldHarness.with({selector: '[data-test="mat-chip-list-dynamic-required"]'}));
		const label = await formField.getLabel();
		expect(label).toBe('Test mat-chip-list dynamic required *');
	});
});
