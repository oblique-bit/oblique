import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ObIAlertType} from '@oblique/oblique';
import {provideObliqueTestingConfiguration} from '../utilities';
import {OBLIQUE_HAS_ROLE_ALERT, ObAlertComponent} from './alert.component';

@Component({
	template: `
		<ob-alert>
			The following text should be shown as hyperlink:
			<a href="www.google.com">www.google.com</a></ob-alert
		>
	`,
	standalone: false
})
class DefaultTestComponent {}

@Component({
	template: ` <ob-alert role="alert" type="success">
		The following text should be shown as hyperlink:
		<a href="www.google.com">www.google.com</a></ob-alert
	>`,
	standalone: false
})
class AlertRoleTestComponent {}

@Component({
	template: ` <ob-alert type="success">
		The following text should be shown as hyperlink:
		<a href="www.google.com">www.google.com</a></ob-alert
	>`,
	standalone: false
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
				imports: [ObAlertComponent],
				declarations: [DefaultTestComponent],
				providers: [provideObliqueTestingConfiguration()],
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

		it.each(['ob-alert', 'ob-angular'])('should have "%s" class', className => {
			expect(debugElement.nativeElement.classList.contains(className)).toBe(true);
		});

		describe('type', () => {
			describe('with default type', () => {
				it('should have type info ', () => {
					expect(obAlertComponent.type).toBe('info');
				});
				it('should have alert:info icon', () => {
					expect(obAlertComponent.icon).toBe('alert:info');
				});

				it('should have class ob-alert-info', () => {
					expect(debugElement.nativeElement.classList.contains('ob-alert-info')).toBe(true);
				});
			});
			describe.each(['info', 'warning', 'error', 'success'])('with "%s" type', type => {
				beforeEach(() => {
					obAlertComponent.type = type as ObIAlertType;
					fixture.detectChanges();
				});
				it(`should have "alert:${type}" icon`, () => {
					expect(obAlertComponent.icon).toBe(`alert:${type}`);
				});
				it(`should have class ob-alert-${type}`, () => {
					expect(debugElement.nativeElement.classList.contains(`ob-alert-${type}`)).toBe(true);
				});
			});
			describe('with illegal type', () => {
				beforeEach(() => {
					obAlertComponent.type = null;
					fixture.detectChanges();
				});
				it('should have "alert:null" as icon', () => {
					expect(obAlertComponent.icon).toBe('alert:null');
				});
				it('should not have class ob-alert-success', () => {
					expect(debugElement.nativeElement.classList['ob-alert-success']).toBeUndefined();
				});
			});
		});
	});

	describe('with custom inputs', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObAlertComponent],
				declarations: [ConfiguredTestComponent],
				providers: [provideObliqueTestingConfiguration()],
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

		it('should have icon "alert:success" ', () => {
			expect(obAlertComponent.icon).toBe('alert:success');
		});
	});

	describe('live region role alert', () => {
		describe('with alert role from user over DOM, undefined token and input', () => {
			beforeEach(async () => {
				TestBed.resetTestingModule();
				await TestBed.configureTestingModule({
					imports: [ObAlertComponent],
					declarations: [AlertRoleTestComponent],
					providers: [provideObliqueTestingConfiguration()],
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
					imports: [ObAlertComponent],
					declarations: [DefaultTestComponent],
					providers: [provideObliqueTestingConfiguration()],
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
					imports: [ObAlertComponent],
					declarations: [DefaultTestComponent],
					providers: [provideObliqueTestingConfiguration(), {provide: OBLIQUE_HAS_ROLE_ALERT, useValue: true}],
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
					imports: [ObAlertComponent],
					declarations: [DefaultTestComponent],
					providers: [provideObliqueTestingConfiguration(), {provide: OBLIQUE_HAS_ROLE_ALERT, useValue: false}],
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
