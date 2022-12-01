import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ObParentFormDirective} from './parent-form.directive';
import {ObNestedFormComponent} from './nested-form.component';
import {UntypedFormControl, UntypedFormGroup, Validators} from '@angular/forms';

describe('NestedFormComponent', () => {
	let component: ObNestedFormComponent;
	let fixture: ComponentFixture<ObNestedFormComponent>;
	let nestedForm: UntypedFormGroup;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [ObNestedFormComponent],
			providers: [ObParentFormDirective]
		}).compileComponents();
		fixture = TestBed.createComponent(ObNestedFormComponent);
		component = fixture.componentInstance;
		nestedForm = new UntypedFormGroup({
			email: new UntypedFormControl('', Validators.required),
			name: new UntypedFormControl('', Validators.required)
		});
		component.nestedForm = nestedForm;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('Method registerOnChange', () => {
		it('should subscribe to valueChanges of the nestedForm once', () => {
			jest.spyOn(nestedForm.valueChanges, 'subscribe');

			component.registerOnChange(null);

			expect(nestedForm.valueChanges.subscribe).toHaveBeenCalledTimes(1);
		});
	});

	describe('Method setDisabledState', () => {
		it('should call disable once when called with true', () => {
			const disableSpy = jest.spyOn(nestedForm, 'disable');

			component.setDisabledState(true);

			expect(disableSpy).toHaveBeenCalledTimes(1);
		});

		it('should call enable once when called with false', () => {
			const enableSpy = jest.spyOn(nestedForm, 'enable');

			component.setDisabledState(false);

			expect(enableSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Method writeValue', () => {
		describe('called with an object', () => {
			let patchValueSpy;
			beforeEach(() => {
				patchValueSpy = jest.spyOn(nestedForm, 'patchValue');

				component.writeValue({field1: 'Field1-Testvalue', field2: 'Field2-Testvalue'});
			});

			it('should call patchValue once', () => {
				expect(patchValueSpy).toHaveBeenCalledTimes(1);
			});

			it('should call patchValue with the correct parameters', () => {
				expect(patchValueSpy).toHaveBeenCalledWith({field1: 'Field1-Testvalue', field2: 'Field2-Testvalue'});
			});
		});

		it('should call reset once when called without object', () => {
			const resetSpy = jest.spyOn(nestedForm, 'reset');

			component.writeValue(null);

			expect(resetSpy).toHaveBeenCalledTimes(1);
		});
	});

	describe('Method validate', () => {
		it('should return null when the form is valid', () => {
			nestedForm.get('email').setValue('test');
			nestedForm.get('name').setValue('test');

			expect(component.validate(nestedForm.get('email'))).toBeNull();
		});

		it('should return errorObject when the form is invalid', () => {
			nestedForm.get('name').setValue('test');

			expect(component.validate(nestedForm.get('email'))).toEqual({email: {required: true}});
		});
	});
});
