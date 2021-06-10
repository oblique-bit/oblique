import {Component} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonDirective} from './button.directive';

@Component({
	template: '<button mat-button obButton="primary">Primary</button>'
})
class TestPrimaryComponent {}

@Component({
	template: '<button mat-button obButton="secondary">Secondary</button>'
})
class TestSecondaryComponent {}

@Component({
	template: '<button mat-button obButton="tertiary">Tertiary</button>'
})
class TestTertiaryComponent {}

@Component({
	template: '<button mat-button obButton>Undefined</button>'
})
class TestDefaultComponent {}

@Component({
	template: '<button mat-button obButton="illegal">Illegal</button>'
})
class TestIllegalComponent {}

@Component({
	template: '<button mat-button [obButton]="obButton">Dynamic</button>'
})
class TestDynamicComponent {
	obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';
}

describe('ButtonDirective', () => {
	let name: string;
	let directive: ObButtonDirective;
	let component: TestPrimaryComponent | TestSecondaryComponent | TestTertiaryComponent | TestDefaultComponent | TestIllegalComponent | TestDynamicComponent;
	let fixture:
		| ComponentFixture<TestPrimaryComponent>
		| ComponentFixture<TestSecondaryComponent>
		| ComponentFixture<TestTertiaryComponent>
		| ComponentFixture<TestDefaultComponent>
		| ComponentFixture<TestIllegalComponent>
		| ComponentFixture<TestDynamicComponent>;

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [
					TestPrimaryComponent,
					TestSecondaryComponent,
					TestTertiaryComponent,
					TestDefaultComponent,
					TestIllegalComponent,
					TestDynamicComponent,
					ObButtonDirective
				],
				imports: [MatButtonModule]
			});
		})
	);

	describe('primary button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestPrimaryComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			name = fixture.debugElement.query(By.all()).name;
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			expect(name).toBe('button');
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be default obButton', () => {
			expect(directive.obButton).toBe('primary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should have `.mat-flat-button` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe('secondary button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestSecondaryComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			name = fixture.debugElement.query(By.all()).name;
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			expect(name).toBe('button');
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be secondary obButton', () => {
			expect(directive.obButton).toBe('secondary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-flat-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeNull();
		});

		it('should have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeTruthy();
		});
	});

	describe('tertiary button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestTertiaryComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			name = fixture.debugElement.query(By.all()).name;
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			expect(name).toBe('button');
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be tertiary obButton', () => {
			expect(directive.obButton).toBe('tertiary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-flat-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeNull();
		});

		it('should not have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe('default button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestDefaultComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			name = fixture.debugElement.query(By.all()).name;
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			expect(name).toBe('button');
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be default obButton', () => {
			expect(directive.obButton).toBe('primary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should have `.mat-flat-button` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe('illegal button', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestIllegalComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			name = fixture.debugElement.query(By.all()).name;
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			expect(name).toBe('button');
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be illegal obButton', () => {
			expect(directive.obButton).toBe('illegal');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have class `.mat-flat-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			expect(selectableElement).toBeNull();
		});

		it('should not have class `.mat-stroked-button`', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe('dynamic button', () => {
		const parameters = [
			{
				obButtonBeforeChange: '',
				obButtonAfterChange: '',
				expectedButtonBeforeChange: 'primary',
				expectedButtonAfterChange: 'primary',
				expectedButtonClassBeforeChange: {primary: true, flat: true, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: true, stroked: false}
			},
			{
				obButtonBeforeChange: '',
				obButtonAfterChange: 'primary',
				expectedButtonBeforeChange: 'primary',
				expectedButtonAfterChange: 'primary',
				expectedButtonClassBeforeChange: {primary: true, flat: true, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: true, stroked: false}
			},
			{
				obButtonBeforeChange: '',
				obButtonAfterChange: 'secondary',
				expectedButtonBeforeChange: 'primary',
				expectedButtonAfterChange: 'secondary',
				expectedButtonClassBeforeChange: {primary: true, flat: true, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: false, stroked: true}
			},
			{
				obButtonBeforeChange: '',
				obButtonAfterChange: 'tertiary',
				expectedButtonBeforeChange: 'primary',
				expectedButtonAfterChange: 'tertiary',
				expectedButtonClassBeforeChange: {primary: true, flat: true, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: false, stroked: false}
			},
			{
				obButtonBeforeChange: 'primary',
				obButtonAfterChange: 'primary',
				expectedButtonBeforeChange: 'primary',
				expectedButtonAfterChange: 'primary',
				expectedButtonClassBeforeChange: {primary: true, flat: true, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: true, stroked: false}
			},
			{
				obButtonBeforeChange: 'primary',
				obButtonAfterChange: '',
				expectedButtonBeforeChange: 'primary',
				expectedButtonAfterChange: 'primary',
				expectedButtonClassBeforeChange: {primary: true, flat: true, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: true, stroked: false}
			},
			{
				obButtonBeforeChange: 'primary',
				obButtonAfterChange: 'secondary',
				expectedButtonBeforeChange: 'primary',
				expectedButtonAfterChange: 'secondary',
				expectedButtonClassBeforeChange: {primary: true, flat: true, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: false, stroked: true}
			},
			{
				obButtonBeforeChange: 'primary',
				obButtonAfterChange: 'tertiary',
				expectedButtonBeforeChange: 'primary',
				expectedButtonAfterChange: 'tertiary',
				expectedButtonClassBeforeChange: {primary: true, flat: true, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: false, stroked: false}
			},
			{
				obButtonBeforeChange: 'secondary',
				obButtonAfterChange: 'secondary',
				expectedButtonBeforeChange: 'secondary',
				expectedButtonAfterChange: 'secondary',
				expectedButtonClassBeforeChange: {primary: true, flat: false, stroked: true},
				expectedButtonClassAfterChange: {primary: true, flat: false, stroked: true}
			},
			{
				obButtonBeforeChange: 'secondary',
				obButtonAfterChange: '',
				expectedButtonBeforeChange: 'secondary',
				expectedButtonAfterChange: 'primary',
				expectedButtonClassBeforeChange: {primary: true, flat: false, stroked: true},
				expectedButtonClassAfterChange: {primary: true, flat: true, stroked: false}
			},
			{
				obButtonBeforeChange: 'secondary',
				obButtonAfterChange: 'primary',
				expectedButtonBeforeChange: 'secondary',
				expectedButtonAfterChange: 'primary',
				expectedButtonClassBeforeChange: {primary: true, flat: false, stroked: true},
				expectedButtonClassAfterChange: {primary: true, flat: true, stroked: false}
			},
			{
				obButtonBeforeChange: 'secondary',
				obButtonAfterChange: 'tertiary',
				expectedButtonBeforeChange: 'secondary',
				expectedButtonAfterChange: 'tertiary',
				expectedButtonClassBeforeChange: {primary: true, flat: false, stroked: true},
				expectedButtonClassAfterChange: {primary: true, flat: false, stroked: false}
			},
			{
				obButtonBeforeChange: 'tertiary',
				obButtonAfterChange: 'tertiary',
				expectedButtonBeforeChange: 'tertiary',
				expectedButtonAfterChange: 'tertiary',
				expectedButtonClassBeforeChange: {primary: true, flat: false, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: false, stroked: false}
			},
			{
				obButtonBeforeChange: 'tertiary',
				obButtonAfterChange: '',
				expectedButtonBeforeChange: 'tertiary',
				expectedButtonAfterChange: 'primary',
				expectedButtonClassBeforeChange: {primary: true, flat: false, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: true, stroked: false}
			},
			{
				obButtonBeforeChange: 'tertiary',
				obButtonAfterChange: 'secondary',
				expectedButtonBeforeChange: 'tertiary',
				expectedButtonAfterChange: 'secondary',
				expectedButtonClassBeforeChange: {primary: true, flat: false, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: false, stroked: true}
			},
			{
				obButtonBeforeChange: 'tertiary',
				obButtonAfterChange: 'primary',
				expectedButtonBeforeChange: 'tertiary',
				expectedButtonAfterChange: 'primary',
				expectedButtonClassBeforeChange: {primary: true, flat: false, stroked: false},
				expectedButtonClassAfterChange: {primary: true, flat: true, stroked: false}
			}
		];
		parameters.forEach(parameter => {
			let directive: ObButtonDirective;
			let component: TestDynamicComponent;
			let fixture: ComponentFixture<TestDynamicComponent>;

			beforeEach(() => {
				fixture = TestBed.createComponent(TestDynamicComponent);
				component = fixture.componentInstance;
				(component as TestDynamicComponent).obButton = parameter.obButtonBeforeChange as 'primary' | 'secondary' | 'tertiary';
				fixture.detectChanges();
				const element = fixture.debugElement.query(By.directive(ObButtonDirective));
				name = fixture.debugElement.query(By.all()).name;
				directive = element.injector.get(ObButtonDirective);
			});

			it('should be button', () => {
				expect(name).toBe('button');
			});

			// BEFORE CHANGE TEST
			it('should create an instance', () => {
				expect(component).toBeTruthy();
				expect(directive).toBeTruthy();
			});

			it('should be ' + parameter.expectedButtonBeforeChange + ' obButton', () => {
				expect(directive.obButton).toBe(parameter.expectedButtonBeforeChange);
			});

			it('should ' + (parameter.expectedButtonClassBeforeChange.primary ? 'have ' : 'not have ') + ' `.mat-primary` class', () => {
				const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
				if (parameter.expectedButtonClassBeforeChange.primary) {
					expect(selectableElement).toBeTruthy();
				} else {
					expect(selectableElement).toBeNull();
				}
			});

			it('should ' + (parameter.expectedButtonClassBeforeChange.flat ? 'have ' : 'not have ') + '`.mat-flat-button` class', () => {
				const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
				if (parameter.expectedButtonClassBeforeChange.flat) {
					expect(selectableElement).toBeTruthy();
				} else {
					expect(selectableElement).toBeNull();
				}
			});

			it('should ' + (parameter.expectedButtonClassBeforeChange.stroked ? 'have ' : 'not have ') + '`.mat-stroked-button` class', () => {
				const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
				if (parameter.expectedButtonClassBeforeChange.stroked) {
					expect(selectableElement).toBeTruthy();
				} else {
					expect(selectableElement).toBeNull();
				}
			});

			// AFTER CHANGE TEST
			it('should create an instance', () => {
				(component as TestDynamicComponent).obButton = parameter.obButtonAfterChange as 'primary' | 'secondary' | 'tertiary';
				fixture.detectChanges();
				expect(component).toBeTruthy();
				expect(directive).toBeTruthy();
			});

			it('should be ' + parameter.expectedButtonAfterChange + ' obButton', () => {
				(component as TestDynamicComponent).obButton = parameter.obButtonAfterChange as 'primary' | 'secondary' | 'tertiary';
				fixture.detectChanges();
				expect(directive.obButton).toBe(parameter.expectedButtonAfterChange);
			});

			it('should ' + (parameter.expectedButtonClassAfterChange.primary ? 'have ' : 'not have ') + ' `.mat-primary` class', () => {
				(component as TestDynamicComponent).obButton = parameter.obButtonAfterChange as 'primary' | 'secondary' | 'tertiary';
				fixture.detectChanges();
				const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
				if (parameter.expectedButtonClassAfterChange.primary) {
					expect(selectableElement).toBeTruthy();
				} else {
					expect(selectableElement).toBeNull();
				}
			});

			it('should ' + (parameter.expectedButtonClassAfterChange.flat ? 'have ' : 'not have ') + '`.mat-flat-button` class', () => {
				(component as TestDynamicComponent).obButton = parameter.obButtonAfterChange as 'primary' | 'secondary' | 'tertiary';
				fixture.detectChanges();
				const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
				if (parameter.expectedButtonClassAfterChange.flat) {
					expect(selectableElement).toBeTruthy();
				} else {
					expect(selectableElement).toBeNull();
				}
			});

			it('should ' + (parameter.expectedButtonClassAfterChange.stroked ? 'have ' : 'not have ') + '`.mat-stroked-button` class', () => {
				(component as TestDynamicComponent).obButton = parameter.obButtonAfterChange as 'primary' | 'secondary' | 'tertiary';
				fixture.detectChanges();
				const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
				if (parameter.expectedButtonClassAfterChange.stroked) {
					expect(selectableElement).toBeTruthy();
				} else {
					expect(selectableElement).toBeNull();
				}
			});
		});
	});
});
