import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObAlertComponent} from './alert.component';

@Component({
	template: `
		<ob-alert>
			The following text should be shown as hyperlink:
			<a href="www.google.com">www.google.com</a></ob-alert
		>
	`
})
class DefaultTestComponent {}

@Component({
	template: ` <ob-alert [type]="'success'">
		The following text should be shown as hyperlink:
		<a href="www.google.com">www.google.com</a></ob-alert
	>`
})
class ConfiguredTestComponent {}

describe('ObAlertComponent', () => {
	let obAlertComponent: ObAlertComponent;
	let fixture: ComponentFixture<DefaultTestComponent>;
	let testComponent: DefaultTestComponent;
	let debugElement: DebugElement;

	describe('with default inputs', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [DefaultTestComponent, ObMockTranslatePipe, ObAlertComponent],
				providers: [{provide: TranslateService, useClass: ObMockTranslateService}],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(DefaultTestComponent);
			testComponent = fixture.componentInstance;
			fixture.detectChanges();
			debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
			obAlertComponent = debugElement.injector.get(ObAlertComponent);
		});

		it('should create', () => {
			expect(testComponent).toBeTruthy();
		});

		it('should create an instance', () => {
			expect(obAlertComponent).toBeTruthy();
		});

		it('should hav ob-alert class', () => {
			expect(debugElement.nativeElement.classList.contains('ob-alert')).toBe(true);
		});

		it('should hav ob-angular class', () => {
			expect(debugElement.nativeElement.classList.contains('ob-angular')).toBe(true);
		});

		it('should add class ob-alert-link', () => {
			const anchor: HTMLElement = debugElement.query(By.css('a')).nativeElement;
			expect(anchor.classList.contains('ob-alert-link')).toBe(true);
		});

		describe('type', () => {
			describe('with default type', () => {
				it('should have type info ', () => {
					expect(obAlertComponent.type).toBe('info');
				});
				it('should have info icon', () => {
					expect(obAlertComponent.icon).toBe('info');
				});

				it('should have class ob-alert-info', () => {
					expect(debugElement.nativeElement.classList.contains('ob-alert-info')).toBe(true);
				});
			});
			describe('with info type', () => {
				beforeEach(() => {
					obAlertComponent.type = 'info';
					fixture.detectChanges();
				});
				it('should have info icon', () => {
					expect(obAlertComponent.icon).toBe('info');
				});
				it('should have class ob-alert-info', () => {
					expect(debugElement.nativeElement.classList.contains('ob-alert-info')).toBe(true);
				});
			});
			describe('with warning type', () => {
				beforeEach(() => {
					obAlertComponent.type = 'warning';
					fixture.detectChanges();
				});
				it('should have warning icon', () => {
					expect(obAlertComponent.icon).toBe('warning');
				});
				it('should have class ob-alert-warning', () => {
					expect(debugElement.nativeElement.classList.contains('ob-alert-warning')).toBe(true);
				});
			});
			describe('with error type', () => {
				beforeEach(() => {
					obAlertComponent.type = 'error';
					fixture.detectChanges();
				});
				it('should have cancel icon', () => {
					expect(obAlertComponent.icon).toBe('cancel');
				});
				it('should have class ob-alert-error', () => {
					expect(debugElement.nativeElement.classList.contains('ob-alert-error')).toBe(true);
				});
			});
			describe('with success type', () => {
				beforeEach(() => {
					obAlertComponent.type = 'success';
					fixture.detectChanges();
				});
				it('should have cancel icon', () => {
					expect(obAlertComponent.icon).toBe('checkmark');
				});
				it('should have class ob-alert-success', () => {
					expect(debugElement.nativeElement.classList.contains('ob-alert-success')).toBe(true);
				});
			});
			describe('with illegal type', () => {
				beforeEach(() => {
					obAlertComponent.type = null;
					fixture.detectChanges();
				});
				it('should have no icon', () => {
					expect(obAlertComponent.icon).toBe('');
				});
				it('should have class ob-alert-success', () => {
					expect(Object.keys(debugElement.nativeElement.classList).length).toBe(2);
				});
			});
		});
	});

	describe('with custom inputs', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [ConfiguredTestComponent, ObMockTranslatePipe, ObAlertComponent],
				providers: [{provide: TranslateService, useClass: ObMockTranslateService}],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ConfiguredTestComponent);
			testComponent = fixture.componentInstance;
			fixture.detectChanges();
			debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
			obAlertComponent = debugElement.componentInstance;
		});

		it('should create', () => {
			expect(testComponent).toBeTruthy();
		});

		it('should create an instance', () => {
			expect(obAlertComponent).toBeTruthy();
		});

		it('should have class ob-alert-success', () => {
			expect(debugElement.nativeElement.classList.contains('ob-alert-success')).toBe(true);
		});

		it('should have type success ', () => {
			expect(obAlertComponent.type).toBe('success');
		});

		it('should have icon success ', () => {
			expect(obAlertComponent.icon).toBe('checkmark');
		});
	});
});
