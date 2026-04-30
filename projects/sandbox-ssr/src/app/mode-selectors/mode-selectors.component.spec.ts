import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {ModeSelectorComponent} from './mode-selectors.component';
import {DOCUMENT} from '@angular/core';
import {MatButtonToggle} from '@angular/material/button-toggle';
import {TranslateModule} from '@ngx-translate/core';

describe(ModeSelectorComponent.name, () => {
	let fixture: ComponentFixture<ModeSelectorComponent>;
	let modeSelectorComponent: ModeSelectorComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ModeSelectorComponent, TranslateModule.forRoot(), MatButtonToggle],
		}).compileComponents();
		fixture = TestBed.createComponent(ModeSelectorComponent);
		fixture.detectChanges();
		modeSelectorComponent = fixture.componentInstance;
	});

	test('app creation', () => {
		expect(modeSelectorComponent).toBeTruthy();
	});

	describe(`toggleBodyStyles`, () => {
		let document: Document;
		let body: HTMLElement | null;

		beforeEach(() => {
			document = TestBed.inject(DOCUMENT);
			body = document.querySelector('body');
			modeSelectorComponent.form.controls.lightnessDark.setValue('');
			modeSelectorComponent.form.controls.motionDisabled.setValue('');
		});

		test(`document has body element`, () => {
			expect(body).toBeTruthy();
		});

		test('should add class to the body', () => {
			modeSelectorComponent.form.controls.lightnessDark.setValue('ob-test-class');
			expect(body.classList.contains('ob-test-class')).toBeTruthy();
			expect(body.classList.length).toBe(1);
		});

		test('should add more than one class to the body', () => {
			modeSelectorComponent.form.controls.lightnessDark.setValue('ob-test-class');
			modeSelectorComponent.form.controls.motionDisabled.setValue('ob-test-class-2');
			expect(body.classList.contains('ob-test-class')).toBeTruthy();
			expect(body.classList.contains('ob-test-class-2')).toBeTruthy();
			expect(body.classList.length).toBe(2);
		});

		test('should remove specific class from the body', () => {
			modeSelectorComponent.form.controls.lightnessDark.setValue('ob-test-class');
			modeSelectorComponent.form.controls.motionDisabled.setValue('ob-test-class-2');
			modeSelectorComponent.form.controls.motionDisabled.setValue('');
			expect(body.classList.contains('ob-test-class')).toBeTruthy();
			expect(body.classList.contains('ob-test-class-2')).toBeFalsy();
			expect(body.classList.length).toBe(1);
		});

		test('should remove class from the body', () => {
			modeSelectorComponent.form.controls.lightnessDark.setValue('ob-test-class');
			modeSelectorComponent.form.controls.lightnessDark.setValue('');
			expect(body.classList.contains('ob-test-class')).toBeFalsy();
			expect(body.classList.length).toBe(0);
		});

		test('should not remove class without ob prefix from the body', () => {
			modeSelectorComponent.form.controls.lightnessDark.setValue('test-class');
			expect(body.classList.contains('test-class')).toBeTruthy();
			expect(body.classList.length).toBe(1);
			body.classList.remove('test-class');
		});
	});

	describe('document.defaultView is available', () => {
		let document: Document;
		let body: HTMLElement | null;

		beforeEach(() => {
			document = TestBed.inject(DOCUMENT);
			body = document.querySelector('body');
			modeSelectorComponent.form.controls.lightnessDark.setValue('');
		});

		test('should set lightness class ob-lightness-dark automatically', () => {
			jest.spyOn(window, 'matchMedia').mockReturnValue({matches: true} as MediaQueryList);
			modeSelectorComponent.ngOnInit();
			expect(modeSelectorComponent.form.controls.lightnessDark.value).toBe('ob-lightness-dark');
			expect(body.classList.contains('ob-lightness-dark')).toBeTruthy();
			expect(body.classList.length).toBe(1);
		});
	});

	describe('document.defaultView is undefined ', () => {
		let document: Document;
		let body: HTMLElement | null;

		beforeEach(() => {
			document = TestBed.inject(DOCUMENT);
			body = document.querySelector('body');
			modeSelectorComponent.form.controls.lightnessDark.setValue('');
		});

		test('should not set lightness class ob-lightness-dark', () => {
			jest.spyOn(document, 'defaultView', 'get').mockReturnValue(undefined);
			modeSelectorComponent.ngOnInit();
			expect(modeSelectorComponent.form.controls.lightnessDark.value).toBe('');
			expect(body.classList.contains('ob-lightness-dark')).toBeFalsy();
			expect(body.classList.length).toBe(0);
		});
	});
});
