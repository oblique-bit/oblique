import {Component, inject} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {provideObliqueTestingConfiguration} from '../../public_api';
import {OB_MAT_ERROR_PREFIX} from '../utilities';
import {ObMatErrorDirective} from './mat-error.directive';
import {ObErrorMessagesDirective} from './error-messages.directive';

@Component({
	imports: [MatFormFieldModule, MatInputModule, ObErrorMessagesDirective, ObMatErrorDirective, ReactiveFormsModule],
	template: `<form [formGroup]="form">
		<mat-form-field obErrorMessages>
			<mat-label>Required field</mat-label>
			<input matInput type="text" formControlName="control" />
			<mat-error />
		</mat-form-field>
	</form>`,
})
class HostComponent {
	readonly form = inject(FormBuilder).group({control: ['', [Validators.required, this.customValidator()]]});
	private customValidator(): ValidatorFn {
		return (control: AbstractControl<string>) => (control.value?.toLowerCase().includes('a') ? {forbidA: true} : null);
	}
}

describe(ObMatErrorDirective.name, () => {
	let fixture: ComponentFixture<HostComponent>;
	let component: HostComponent;
	let matErrorEl: HTMLElement;
	let translate: TranslateService;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HostComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();
	});

	describe('with ObErrorMessagesDirective', () => {
		describe('without prefix, without token', () => {
			describe('with Oblique error', () => {
				beforeEach(() => {
					fixture = TestBed.createComponent(HostComponent);
					component = fixture.componentInstance;
					fixture.detectChanges();
					translate = TestBed.inject(TranslateService);
					translate.setTranslation('en', {'i18n.validation.required': 'This is required'});
					translate.setTranslation('fr', {'i18n.validation.required': 'requis'});
					translate.use('en');
				});

				it('should display required error', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('This is required');
				});

				it('should display forbidA error', () => {
					const control = component.form.get('control');
					control.setValue('a');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('i18n.validation.forbidA');
				});

				it('should clear error when input is valid', () => {
					const control = component.form.get('control');
					control.setValue('42');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl).toBeNull();
				});

				it('should translate error when language changes', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();
					translate.use('fr');
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('requis');
				});
			});

			describe('with custom error', () => {
				beforeEach(() => {
					fixture = TestBed.createComponent(HostComponent);
					component = fixture.componentInstance;
					fixture.detectChanges();
					translate = TestBed.inject(TranslateService);
					translate.setTranslation('en', {});
					translate.setTranslation('fr', {});
					translate.use('en');
				});

				it('should display required error', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('i18n.validation.required');
				});

				it('should display forbidA error', () => {
					const control = component.form.get('control');
					control.setValue('a');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('i18n.validation.forbidA');
				});
			});
		});

		describe('without prefix, with token', () => {
			beforeEach(() => {
				TestBed.overrideProvider(OB_MAT_ERROR_PREFIX, {useValue: 'custom.token.'});
			});

			describe('with Oblique error', () => {
				beforeEach(() => {
					fixture = TestBed.createComponent(HostComponent);
					component = fixture.componentInstance;
					fixture.detectChanges();
					translate = TestBed.inject(TranslateService);
					translate.setTranslation('en', {'i18n.validation.required': 'This is required'});
					translate.setTranslation('fr', {'i18n.validation.required': 'requis'});
					translate.use('en');
				});

				it('should display required error', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('This is required');
				});

				it('should display forbidA error', () => {
					const control = component.form.get('control');
					control.setValue('a');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('custom.token.forbidA');
				});

				it('should clear error when input is valid', () => {
					const control = component.form.get('control');
					control.setValue('42');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl).toBeNull();
				});

				it('should translate error when language changes', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();
					translate.use('fr');
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('requis');
				});
			});

			describe('with custom error', () => {
				beforeEach(() => {
					fixture = TestBed.createComponent(HostComponent);
					component = fixture.componentInstance;
					fixture.detectChanges();
					translate = TestBed.inject(TranslateService);
					translate.setTranslation('en', {});
					translate.setTranslation('fr', {});
					translate.use('en');
				});

				it('should display required error', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('custom.token.required');
				});

				it('should display forbidA error', () => {
					const control = component.form.get('control');
					control.setValue('a');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('custom.token.forbidA');
				});
			});
		});

		describe('with prefix, with token', () => {
			beforeEach(() => {
				TestBed.overrideProvider(OB_MAT_ERROR_PREFIX, {useValue: 'custom.token.'});
				TestBed.overrideTemplate(
					HostComponent,
					`<form [formGroup]="form">
		<mat-form-field obErrorMessages prefix="custom.input.">
			<mat-label>Required field</mat-label>
			<input matInput type="text" formControlName="control" />
			<mat-error />
		</mat-form-field>
		<button type="submit">Submit</button>
	</form>`
				);
			});

			describe('with Oblique error', () => {
				beforeEach(() => {
					fixture = TestBed.createComponent(HostComponent);
					component = fixture.componentInstance;
					fixture.detectChanges();
					translate = TestBed.inject(TranslateService);
					translate.setTranslation('en', {'i18n.validation.required': 'This is required'});
					translate.setTranslation('fr', {'i18n.validation.required': 'requis'});
					translate.use('en');
				});

				it('should display required error', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('This is required');
				});

				it('should display forbidA error', () => {
					const control = component.form.get('control');
					control.setValue('a');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('custom.input.forbidA');
				});

				it('should clear error when input is valid', () => {
					const control = component.form.get('control');
					control.setValue('42');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl).toBeNull();
				});

				it('should translate error when language changes', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();
					translate.use('fr');
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('requis');
				});
			});

			describe('with custom error', () => {
				beforeEach(() => {
					fixture = TestBed.createComponent(HostComponent);
					component = fixture.componentInstance;
					fixture.detectChanges();
					translate = TestBed.inject(TranslateService);
					translate.setTranslation('en', {});
					translate.setTranslation('fr', {});
					translate.use('en');
				});

				it('should display required error', () => {
					const control = component.form.get('control');
					control.setValue('');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('custom.input.required');
				});

				it('should display forbidA error', () => {
					const control = component.form.get('control');
					control.setValue('a');
					control.markAsTouched();
					fixture.detectChanges();

					matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
					expect(matErrorEl.innerText).toBe('custom.input.forbidA');
				});
			});
		});
	});

	describe('without ObErrorMessagesDirective', () => {
		beforeEach(() => {
			TestBed.overrideTemplate(
				HostComponent,
				`<form [formGroup]="form">
		<mat-form-field>
			<mat-label>Required field</mat-label>
			<input matInput type="text" formControlName="control" />
			<mat-error/>
		</mat-form-field>
	</form>`
			);
			fixture = TestBed.createComponent(HostComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should display an empty error', () => {
			const control = component.form.get('control');
			control.setValue('');
			control.markAsTouched();
			fixture.detectChanges();

			matErrorEl = fixture.debugElement.nativeElement.querySelector('mat-error');
			expect(matErrorEl.innerText).toBeUndefined();
		});
	});
});
