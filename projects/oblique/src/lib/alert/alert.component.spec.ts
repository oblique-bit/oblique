import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
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
				providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
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

		it('should add class ob-alert-link', () => {
			const anchor: HTMLElement = debugElement.query(By.css('a')).nativeElement;
			expect(anchor.classList.contains('ob-alert-link')).toBe(true);
		});

		describe('type', () => {
			it('should have type info ', () => {
				expect(obAlertComponent.type).toBe('info');
			});

			it('should have class ob-alert-info', () => {
				expect(debugElement.nativeElement.classList.contains('ob-alert-info')).toBe(true);
			});

			it('should have class ob-alert-warning', () => {
				obAlertComponent.type = 'warning';
				fixture.detectChanges();
				expect(debugElement.nativeElement.classList.contains('ob-alert-warning')).toBe(true);
			});

			it('should have class ob-alert-error', () => {
				obAlertComponent.type = 'error';
				fixture.detectChanges();
				expect(debugElement.nativeElement.classList.contains('ob-alert-error')).toBe(true);
			});

			it('should have class ob-alert-success', () => {
				obAlertComponent.type = 'success';
				fixture.detectChanges();
				expect(debugElement.nativeElement.classList.contains('ob-alert-success')).toBe(true);
			});
		});
	});

	describe('with custom inputs', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [ConfiguredTestComponent, ObMockTranslatePipe, ObAlertComponent],
				providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
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
	});
});
