import {Component, inject} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {provideObliqueTestingConfiguration} from '../../public_api';
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
	readonly form = inject(FormBuilder).group({control: ['', Validators.required]});
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

		it('should clear error when input is valid', () => {
			const control = component.form.get('control');
			control.setValue('abcd');
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
