import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, OnInit, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {ObFocusInvalidDirective} from './focus-invalid.directive';

@Component({
	template: `
		<form [formGroup]="focusInvalidFormGroup" obFocusInvalid>
			<mat-form-field>
				<mat-label>Text</mat-label>
				<input type="text" matInput id="text" formControlName="text" />
			</mat-form-field>

			<mat-form-field>
				<mat-label>Datepicker</mat-label>
				<input matInput [matDatepicker]="defaultDatepicker" id="datepicker" formControlName="datepicker" />
				<mat-hint>DD.MM.YYYY</mat-hint>
				<mat-datepicker-toggle matIconSuffix [for]="defaultDatepicker" />
				<mat-datepicker #defaultDatepicker />
			</mat-form-field>

			<mat-form-field>
				<mat-label>Select</mat-label>
				<mat-select formControlName="select" id="select">
					<mat-option [value]="1">One</mat-option>
					<mat-option [value]="2">Two</mat-option>
					<mat-option [value]="3">Three</mat-option>
					<mat-option [value]="4">Four</mat-option>
					<mat-option [value]="5">Five</mat-option>
				</mat-select>
			</mat-form-field>

			<mat-checkbox formControlName="checkbox" id="checkbox">Checkbox</mat-checkbox>

			<mat-form-field>
				<mat-label>Textarea</mat-label>
				<textarea matInput id="textarea" formControlName="textarea"></textarea>>
			</mat-form-field>

			<mat-radio-group formControlName="radio" id="radio">
				<mat-radio-button value="1">one</mat-radio-button>
				<mat-radio-button value="2">two</mat-radio-button>
			</mat-radio-group>

			<button type="submit">submit</button>
		</form>
	`,
	standalone: false
})
class UntypedReactiveFormTestComponent implements OnInit {
	focusInvalidFormGroup: FormGroup;
	private readonly formBuilder: FormBuilder = inject(FormBuilder);

	ngOnInit(): void {
		this.focusInvalidFormGroup = this.formBuilder.group({
			text: ['', Validators.required],
			datepicker: ['', Validators.required],
			select: [undefined, Validators.required],
			checkbox: [false, Validators.requiredTrue],
			textarea: ['', Validators.required],
			radio: [undefined, Validators.required]
		});
	}
}

describe(ObFocusInvalidDirective.name, () => {
	const values = {
		text: 'some text',
		datepicker: '2024.01.01',
		select: 2,
		checkbox: true,
		textarea: 'some text',
		radio: '1'
	};
	let fixture: ComponentFixture<UntypedReactiveFormTestComponent>;
	let component: UntypedReactiveFormTestComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [UntypedReactiveFormTestComponent],
			imports: [
				ObFocusInvalidDirective,
				ReactiveFormsModule,
				MatFormFieldModule,
				MatInputModule,
				MatSelectModule,
				MatCheckboxModule,
				MatRadioModule
			]
		}).compileComponents();

		fixture = TestBed.createComponent(UntypedReactiveFormTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('the text field is focused when no fields received a value', () => {
		fixture.nativeElement.querySelector('button').click();
		expect(document.activeElement.id).toBe('text');
	});

	test.each([
		{setValues: ['text'], result: 'datepicker'},
		{setValues: ['text', 'datepicker'], result: 'select'},
		{setValues: ['text', 'datepicker', 'select'], result: 'checkbox', id: 'checkbox-input'},
		{setValues: ['text', 'datepicker', 'select', 'checkbox'], result: 'textarea'},
		{setValues: ['text', 'datepicker', 'select', 'checkbox', 'textarea'], result: 'radio', id: 'mat-radio-a10-input'}
	])('the $result field is focused when all preceding fields received a value', ({setValues, result, id}) => {
		component.focusInvalidFormGroup.patchValue(setValues.reduce((patchValues, key) => ({...patchValues, [key]: values[key]}), {}));
		fixture.detectChanges();
		fixture.nativeElement.querySelector('button').click();
		expect(document.activeElement.id).toBe(id ?? result);
	});

	test('no field is focused when all fields received a value', () => {
		component.focusInvalidFormGroup.patchValue(values);
		fixture.detectChanges();
		fixture.nativeElement.querySelector('button').click();
		expect(document.activeElement.id).toBe('');
	});
});
