import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObUseObliqueIcons} from '../icon/icon.model';
import {OBLIQUE_HAS_ROLE_ALERT, ObAlertComponent} from './alert.component';

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
	template: ` <ob-alert role="alert" [type]="'success'">
		The following text should be shown as hyperlink:
		<a href="www.google.com">www.google.com</a></ob-alert
	>`
})
class AlertRoleTestComponent {}

@Component({
	template: ` <ob-alert [type]="'success'">
		The following text should be shown as hyperlink:
		<a href="www.google.com">www.google.com</a></ob-alert
	>`
})
class ConfiguredTestComponent {}

describe('ObAlertComponent', () => {
	let obAlertComponent: ObAlertComponent;
	let fixture: ComponentFixture<DefaultTestComponent | AlertRoleTestComponent>;
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

		it('should have ob-alert class', () => {
			expect(debugElement.nativeElement.classList.contains('ob-alert')).toBe(true);
		});

		it('should have ob-angular class', () => {
			expect(debugElement.nativeElement.classList.contains('ob-angular')).toBe(true);
		});

		it('should not have ob-font-awesome class', () => {
			expect(debugElement.nativeElement.classList.contains('ob-font-awesome')).toBe(false);
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
					expect(debugElement.nativeElement.classList['ob-alert-success']).toBeUndefined();
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

	describe('with FontAwesome icons', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [DefaultTestComponent, ObMockTranslatePipe, ObAlertComponent],
				providers: [
					{provide: TranslateService, useClass: ObMockTranslateService},
					{provide: ObUseObliqueIcons, useValue: false}
				],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(DefaultTestComponent);
			testComponent = fixture.componentInstance;
			fixture.detectChanges();
			debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
		});

		it('should create', () => {
			expect(testComponent).toBeTruthy();
		});

		it('should have ob-font-awesome class', () => {
			expect(debugElement.nativeElement.classList.contains('ob-font-awesome')).toBe(true);
		});
	});

	describe('live region role alert', () => {
		describe('with alert role from user over DOM, undefined token and input', () => {
			beforeEach(async () => {
				TestBed.resetTestingModule();
				await TestBed.configureTestingModule({
					declarations: [AlertRoleTestComponent, ObMockTranslatePipe, ObAlertComponent],
					providers: [{provide: TranslateService, useClass: ObMockTranslateService}],
					schemas: [CUSTOM_ELEMENTS_SCHEMA]
				}).compileComponents();
			});

			beforeEach(() => {
				fixture = TestBed.createComponent(AlertRoleTestComponent);
				testComponent = fixture.componentInstance;
				fixture.detectChanges();
				debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
				obAlertComponent = debugElement.injector.get(ObAlertComponent);
			});

			afterEach(() => {
				obAlertComponent.hasRoleAlert = undefined;
			});

			it('should have the role=alert attribute in HostBinding', () => {
				expect(obAlertComponent.role).toBe('alert');
			});

			it('should have the  value alert in HostBinding if hasRoleAlert true', () => {
				obAlertComponent.hasRoleAlert = true;

				expect(obAlertComponent.role).toBe('alert');
			});

			it('should alert value in HostBinding is undefined if hasRoleAlert is false', () => {
				obAlertComponent.hasRoleAlert = false;
				fixture.detectChanges();

				expect(obAlertComponent.role).toBe(undefined);
			});

			it('should remove role-attribute if hasRoleAlert is false', () => {
				obAlertComponent.hasRoleAlert = false;

				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});
		});

		describe('with config over Input() and undefined token', () => {
			beforeEach(async () => {
				TestBed.resetTestingModule();
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

			afterEach(() => {
				obAlertComponent.hasRoleAlert = undefined;
			});

			it('should not remove role-attribute if hasRoleAlert is false but has already a role that has not type alert', () => {
				debugElement.nativeElement.setAttribute('role', 'log');
				obAlertComponent.hasRoleAlert = false;

				fixture.detectChanges();

				expect(debugElement.nativeElement.getAttribute('role')).toBe('log');
			});

			it('should not remove role-attribute if hasRoleAlert is undefined but already has a role that has no type alert', () => {
				debugElement.nativeElement.setAttribute('role', 'log');
				obAlertComponent.hasRoleAlert = undefined;

				fixture.detectChanges();

				expect(debugElement.nativeElement.getAttribute('role')).toBe('log');
			});

			it('should change role-attribute if hasRoleAlert is true and initial doesn\'t have role="alert"', () => {
				debugElement.nativeElement.setAttribute('role', 'log');
				obAlertComponent.hasRoleAlert = true;

				fixture.detectChanges();

				expect(debugElement.nativeElement.getAttribute('role')).toBe('alert');
			});

			it('should have the  value alert in HostBinding if hasRoleAlert true', () => {
				obAlertComponent.hasRoleAlert = true;
				fixture.detectChanges();

				expect(obAlertComponent.role).toBe('alert');
			});

			it('should alert value in HostBinding is undefined if hasRoleAlert false', () => {
				obAlertComponent.hasRoleAlert = false;
				fixture.detectChanges();

				expect(obAlertComponent.role).toBe(undefined);
			});

			it('should have a role-attribute if hasRoleAlert is true', () => {
				obAlertComponent.hasRoleAlert = true;

				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});

			it('should have a role with value alert if hasRoleAlert is true', () => {
				obAlertComponent.hasRoleAlert = true;

				fixture.detectChanges();

				expect(debugElement.nativeElement.getAttribute('role')).toBe('alert');
			});

			it('should not have an alert role if hasRoleAlert was set as undefined', () => {
				obAlertComponent.hasRoleAlert = undefined;

				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});

			it('should still have hasRoleAlert equals undefined by default config', () => {
				fixture.detectChanges();

				expect(obAlertComponent.hasRoleAlert).toBe(undefined);
			});

			it('should not have a role-attribute if config Input() changed to undefined', () => {
				obAlertComponent.hasRoleAlert = true;
				fixture.detectChanges();
				obAlertComponent.hasRoleAlert = undefined;
				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});
		});

		describe('with config over global token is true', () => {
			beforeEach(async () => {
				TestBed.resetTestingModule();
				await TestBed.configureTestingModule({
					declarations: [DefaultTestComponent, ObMockTranslatePipe, ObAlertComponent],
					providers: [
						{provide: TranslateService, useClass: ObMockTranslateService},
						{provide: OBLIQUE_HAS_ROLE_ALERT, useValue: true}
					],
					schemas: [CUSTOM_ELEMENTS_SCHEMA]
				}).compileComponents();
			});

			beforeEach(() => {
				fixture = TestBed.createComponent(DefaultTestComponent);
				testComponent = fixture.componentInstance;
				fixture.detectChanges();
				debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
				obAlertComponent = debugElement.injector.get(ObAlertComponent);
				fixture.detectChanges();
			});

			it('should have the  value alert in HostBinding if hasRoleAlert true', () => {
				expect(obAlertComponent.role).toBe('alert');
			});

			it('should alert value in HostBinding is undefined if hasRoleAlert false', () => {
				obAlertComponent.hasRoleAlert = false;
				fixture.detectChanges();

				expect(obAlertComponent.role).toBe(undefined);
			});

			it('should have a role-attribute with type alert', () => {
				expect(debugElement.nativeElement.getAttribute('role')).toBe('alert');
			});

			it('should have a role-attribute with config Input() is true', () => {
				obAlertComponent.hasRoleAlert = true;

				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});

			it("shouldn't have a role-attribute with config Input() is false", () => {
				obAlertComponent.hasRoleAlert = false;

				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});

			it('should have a role-attribute with config Input() is default undefined', () => {
				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});

			it('should have a role-attribute with config Input() was set as undefined', () => {
				obAlertComponent.hasRoleAlert = undefined;

				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});
		});

		describe('with config over global token is false', () => {
			beforeEach(async () => {
				TestBed.resetTestingModule();
				await TestBed.configureTestingModule({
					declarations: [DefaultTestComponent, ObMockTranslatePipe, ObAlertComponent],
					providers: [
						{provide: TranslateService, useClass: ObMockTranslateService},
						{provide: OBLIQUE_HAS_ROLE_ALERT, useValue: false}
					],
					schemas: [CUSTOM_ELEMENTS_SCHEMA]
				}).compileComponents();
			});

			beforeEach(() => {
				fixture = TestBed.createComponent(DefaultTestComponent);
				testComponent = fixture.componentInstance;
				fixture.detectChanges();
				debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
				obAlertComponent = debugElement.injector.get(ObAlertComponent);
				fixture.detectChanges();
			});

			it('should have the  value alert in HostBinding if hasRoleAlert true', () => {
				expect(obAlertComponent.role).toBe(undefined);
			});

			it('should alert value in HostBinding is undefined if hasRoleAlert false', () => {
				obAlertComponent.hasRoleAlert = false;
				fixture.detectChanges();

				expect(obAlertComponent.role).toBe(undefined);
			});

			it('should have a role-attribute with config Input() was set as true', () => {
				obAlertComponent.hasRoleAlert = true;

				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});

			it('should not have a role-attribute with config Input() was set as false', () => {
				obAlertComponent.hasRoleAlert = false;

				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});

			it('should not have a role-attribute if config Input() changed to undefined', () => {
				obAlertComponent.hasRoleAlert = true;
				fixture.detectChanges();
				obAlertComponent.hasRoleAlert = undefined;
				fixture.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});

			it('should not have a role-attribute with config Input() is default undefined', () => {
				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});
		});
	});
});
