import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '@oblique/oblique';
import {NewsletterComponent} from './newsletter.component';

describe(NewsletterComponent.name, () => {
	let component: NewsletterComponent;
	let fixture: ComponentFixture<NewsletterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule, RouterTestingModule, NewsletterComponent, ReactiveFormsModule, BrowserAnimationsModule],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(NewsletterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('property formGroup', () => {
		test('that it exists', () => {
			expect(component.formGroup).toBeDefined();
		});

		test('that it is a FormGroup', () => {
			expect(component.formGroup instanceof FormGroup).toBe(true);
		});

		test('that it has 1 control', () => {
			expect(Object.keys(component.formGroup.controls).length).toBe(1);
		});

		test('that formControl email is initialized', () => {
			expect(component.formGroup.controls.email.value).toBe('');
		});
	});

	describe('formControl email validation', () => {
		test('empty string is invalid', () => {
			component.formGroup.controls.email.patchValue('');
			expect(component.formGroup.controls.email.valid).toBe(false);
		});

		test('max.musterbit.admin.ch without @ is invalid', () => {
			component.formGroup.controls.email.patchValue('max.musterbit.admin.ch');
			expect(component.formGroup.controls.email.valid).toBe(false);
		});

		test('max.muster@bit.admin.ch is valid', () => {
			component.formGroup.controls.email.patchValue('max.muster@bit.admin.ch');
			expect(component.formGroup.controls.email.valid).toBe(true);
		});

		test('@bit.admin.ch is invalid', () => {
			component.formGroup.controls.email.patchValue('@bit.admin.ch');
			expect(component.formGroup.controls.email.valid).toBe(false);
		});
	});

	describe('handleRequest()', () => {
		describe.each([
			{unsubscribe: false, email: 'max.muster@bit.admin.ch', successMessage: 'You have successfully subscribed to our newsletter!'},
			{unsubscribe: true, email: 'max.muster@bit.admin.chREMOVE', successMessage: 'You have successfully unsubscribed to our newsletter!'}
		])('with unsubscribe: $unsubscribe', ({unsubscribe, email, successMessage}) => {
			beforeEach(() => {
				jest.spyOn(component, 'sendRequest');
				component.formGroup.controls.email.patchValue('max.muster@bit.admin.ch');
			});

			test(`calls sendRequest() with email: ${email} and successMessage: ${successMessage}`, () => {
				component.handleRequest(unsubscribe);
				expect(component.sendRequest).toHaveBeenCalledWith(email, successMessage);
			});
		});
	});
});
