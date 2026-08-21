import {ComponentFixture, TestBed} from '@angular/core/testing';
import {
	CUSTOM_ELEMENTS_SCHEMA,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	DebugElement,
	input,
} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ObIAlertType} from '@oblique/oblique';
import {provideObliqueTestingConfiguration} from '../utilities';
import {OBLIQUE_HAS_ROLE_ALERT, ObAlertComponent} from './alert.component';

@Component({
	standalone: false,
	template: `
		<ob-alert [type]="outerType()" [hasRoleAlert]="outerHasRoleAlert()">
			The following text should be shown as hyperlink:
			<a href="www.google.com">www.google.com</a></ob-alert
		>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class DefaultTestComponent {
	readonly outerType = input<ObIAlertType>('info');
	readonly outerHasRoleAlert = input<boolean | undefined>(undefined);
}

@Component({
	standalone: false,
	template: ` <ob-alert role="alert" [hasRoleAlert]="outerHasRoleAlert()" type="success">
		The following text should be shown as hyperlink:
		<a href="www.google.com">www.google.com</a></ob-alert
	>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class AlertRoleTestComponent {
	readonly outerHasRoleAlert = input<boolean | undefined>(undefined);
}

@Component({
	standalone: false,
	template: ` <ob-alert type="success">
		The following text should be shown as hyperlink:
		<a href="www.google.com">www.google.com</a></ob-alert
	>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class ConfiguredTestComponent {}

describe('ObAlertComponent', () => {
	let obAlertComponent: ObAlertComponent;
	let fixture: ComponentFixture<DefaultTestComponent>;
	let testComponent: DefaultTestComponent;
	let debugElement: DebugElement;
	let hostChangeDetector: ChangeDetectorRef;

	describe('with default inputs', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObAlertComponent],
				declarations: [DefaultTestComponent],
				providers: [provideObliqueTestingConfiguration()],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(DefaultTestComponent);
			testComponent = fixture.componentInstance;
			fixture.detectChanges();
			debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
			obAlertComponent = debugElement.injector.get(ObAlertComponent);
			hostChangeDetector = fixture.componentRef.changeDetectorRef;
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
				it('should have a type property with value `info`', () => {
					expect(obAlertComponent.type()).toBe('info');
				});

				it('should have an icon property with value `alert:info`', () => {
					expect(obAlertComponent.icon()).toBe('alert:info');
				});

				it('should have the css class `ob-alert-info`', () => {
					expect(debugElement.nativeElement.classList.contains('ob-alert-info')).toBe(true);
				});
			});
			describe.each(['info', 'warning', 'error', 'success'])('with "%s" type', type => {
				beforeEach(() => {
					fixture.componentRef.setInput('outerType', type);
					hostChangeDetector.detectChanges();
				});

				it(`should have an icon property with value "alert:${type}"`, () => {
					expect(obAlertComponent.icon()).toBe(`alert:${type}`);
				});

				it(`should have a css class \`ob-alert-${type}\``, () => {
					expect(debugElement.nativeElement.classList.contains(`ob-alert-${type}`)).toBe(true);
				});
			});
			describe('with illegal type', () => {
				beforeEach(() => {
					fixture.componentRef.setInput('outerType', null);
					hostChangeDetector.detectChanges();
				});

				it('should have an icon property with value "alert:null"', () => {
					expect(obAlertComponent.icon()).toBe('alert:null');
				});

				it('should not have the css class `ob-alert-success`', () => {
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
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ConfiguredTestComponent);
			testComponent = fixture.componentInstance;
			fixture.detectChanges();
			debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
			obAlertComponent = debugElement.componentInstance;
			hostChangeDetector = fixture.componentRef.changeDetectorRef;
		});

		it('should create', () => {
			expect(testComponent).toBeTruthy();
		});

		it('should create an instance', () => {
			expect(obAlertComponent).toBeTruthy();
		});

		it('should have a css class `ob-alert-success?', () => {
			expect(debugElement.nativeElement.classList.contains('ob-alert-success')).toBe(true);
		});

		it('should have a type attribute with value "success"', () => {
			expect(obAlertComponent.type()).toBe('success');
		});

		it('should have a type attribute with value "success"', () => {
			expect(obAlertComponent.icon()).toBe('alert:success');
		});
	});

	describe('live region role alert', () => {
		describe('with  role from user over DOM, undefined token and input', () => {
			beforeEach(async () => {
				TestBed.resetTestingModule();
				await TestBed.configureTestingModule({
					imports: [ObAlertComponent],
					declarations: [AlertRoleTestComponent],
					providers: [provideObliqueTestingConfiguration()],
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				}).compileComponents();
			});

			beforeEach(() => {
				fixture = TestBed.createComponent(AlertRoleTestComponent);
				testComponent = fixture.componentInstance;
				fixture.detectChanges();
				debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
				obAlertComponent = debugElement.injector.get(ObAlertComponent);
				hostChangeDetector = fixture.componentRef.changeDetectorRef;
			});

			afterEach(() => {
				fixture.componentRef.setInput('outerHasRoleAlert', undefined);
			});

			it('should have a role attribute with value "alert"', () => {
				expect(obAlertComponent.role()).toBe('alert');
			});

			it('should have the value `alert` if hasRoleAlert is true', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();
				expect(obAlertComponent.role()).toBe('alert');
			});

			it('should have the value `undefined` if hasRoleAlert is false', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', false);
				hostChangeDetector.detectChanges();

				expect(obAlertComponent.role()).toBe(undefined);
			});

			it('should remove the role attribute if hasRoleAlert is false', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', false);
				hostChangeDetector.detectChanges();

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
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				}).compileComponents();
			});

			beforeEach(() => {
				fixture = TestBed.createComponent(DefaultTestComponent);
				testComponent = fixture.componentInstance;
				fixture.detectChanges();
				debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
				obAlertComponent = debugElement.injector.get(ObAlertComponent);
				hostChangeDetector = fixture.componentRef.changeDetectorRef;
			});

			afterEach(() => {
				fixture.componentRef.setInput('outerHasRoleAlert', undefined);
				hostChangeDetector.detectChanges();
			});

			it('should not remove the role attribute if hasRoleAlert is false and role has a value different from `alert`', () => {
				debugElement.nativeElement.setAttribute('role', 'log');
				fixture.componentRef.setInput('outerHasRoleAlert', false);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.getAttribute('role')).toBe('log');
			});

			it('should not remove the role attribute if hasRoleAlert is undefined and role has a value different from `alert`', () => {
				debugElement.nativeElement.setAttribute('role', 'log');
				fixture.componentRef.setInput('outerHasRoleAlert', undefined);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.getAttribute('role')).toBe('log');
			});

			it('should change the role attribute if hasRoleAlert is true and and role has a value different from `alert`', () => {
				debugElement.nativeElement.setAttribute('role', 'log');
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.getAttribute('role')).toBe('alert');
			});

			it('should have the value alert in HostBinding if hasRoleAlert true', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();

				expect(obAlertComponent.role()).toBe('alert');
			});

			it('should alert value in HostBinding is undefined if hasRoleAlert false', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', false);
				hostChangeDetector.detectChanges();

				expect(obAlertComponent.role()).toBe(undefined);
			});

			it('should have a role-attribute if hasRoleAlert is true', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});

			it('should have a role with value alert if hasRoleAlert is true', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.getAttribute('role')).toBe('alert');
			});

			it('should not have an alert role if hasRoleAlert was set as undefined', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', undefined);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});

			it('should have hasRoleAlert with value undefined with default config', () => {
				hostChangeDetector.detectChanges();

				expect(obAlertComponent.hasRoleAlert()).toBe(undefined);
			});

			it('should not have a role attribute if hasRoleAlert changed value and again to undefined', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();
				fixture.componentRef.setInput('outerHasRoleAlert', undefined);
				hostChangeDetector.detectChanges();

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
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				}).compileComponents();
			});

			beforeEach(() => {
				fixture = TestBed.createComponent(DefaultTestComponent);
				testComponent = fixture.componentInstance;
				fixture.detectChanges();
				debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
				obAlertComponent = debugElement.injector.get(ObAlertComponent);
				hostChangeDetector = fixture.componentRef.changeDetectorRef;
				fixture.detectChanges();
			});

			it('should have the value `alert` if hasRoleAlert true', () => {
				expect(obAlertComponent.role()).toBe('alert');
			});

			it('should have the value undefined if hasRoleAlert is false', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', false);
				hostChangeDetector.detectChanges();

				expect(obAlertComponent.role()).toBe(undefined);
			});

			it('should have a role attribute with value `alert`', () => {
				expect(debugElement.nativeElement.getAttribute('role')).toBe('alert');
			});

			it('should have a role attribute if hasRoleAlert is true', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});

			it("shouldn't have a role attribute if hasRoleAlert is false", () => {
				fixture.componentRef.setInput('outerHasRoleAlert', false);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});

			it('should have a role-attribute if hasRoleAlert is not undefined', () => {
				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});

			it('should have a role-attribute if hasRoleAlert is set to undefined', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', undefined);
				hostChangeDetector.detectChanges();

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
					schemas: [CUSTOM_ELEMENTS_SCHEMA],
				}).compileComponents();
			});

			beforeEach(() => {
				fixture = TestBed.createComponent(DefaultTestComponent);
				testComponent = fixture.componentInstance;
				fixture.detectChanges();
				debugElement = fixture.debugElement.query(By.directive(ObAlertComponent));
				obAlertComponent = debugElement.injector.get(ObAlertComponent);
				hostChangeDetector = fixture.componentRef.changeDetectorRef;
				fixture.detectChanges();
			});

			it('should have the value undefined if hasRoleAlert is true', () => {
				expect(obAlertComponent.role()).toBe(undefined);
			});

			it('should have the value undefined if hasRoleAlert is false', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', false);
				hostChangeDetector.detectChanges();

				expect(obAlertComponent.role()).toBe(undefined);
			});

			it('should have a role-attribute if hasRoleAlert is true', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();
				expect(debugElement.nativeElement.hasAttribute('role')).toBe(true);
			});

			it('should not have a role attribute if hasRoleAlert is false', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', false);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});

			it('should not have a role attribute if hasRoleAlert is changed to undefined', () => {
				fixture.componentRef.setInput('outerHasRoleAlert', true);
				hostChangeDetector.detectChanges();
				fixture.componentRef.setInput('outerHasRoleAlert', undefined);
				hostChangeDetector.detectChanges();

				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});

			it('should not have a role-attribute if hasRoleAlert is undefined', () => {
				expect(debugElement.nativeElement.hasAttribute('role')).toBe(false);
			});
		});
	});
});
