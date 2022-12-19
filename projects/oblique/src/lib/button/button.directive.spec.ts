import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {ObButtonDirective} from './button.directive';

@Component({
	template: ''
})
class ButtonDirectiveTestComponent {
	obButton: 'primary' | 'secondary' | 'tertiary' = 'primary';
}

interface ButtonDirectiveTestParameter {
	obButtonBeforeChange: 'primary' | 'secondary' | 'tertiary';
	obButtonAfterChange: 'primary' | 'secondary' | 'tertiary';
	expectedButtonBeforeChange: string;
	expectedButtonAfterChange: string;
	expectedButtonClassBeforeChange: {primary: boolean; flat: boolean; stroked: boolean};
	expectedButtonClassAfterChange: {primary: boolean; flat: boolean; stroked: boolean};
}

describe('ButtonDirective', () => {
	let directive: ObButtonDirective;
	let component: ButtonDirectiveTestComponent;
	let fixture: ComponentFixture<ButtonDirectiveTestComponent>;

	beforeEach(async () => {
		TestBed.resetTestingModule();
		await TestBed.configureTestingModule({
			declarations: [ButtonDirectiveTestComponent, ObButtonDirective],
			imports: [MatButtonModule]
		}).compileComponents();
	});

	describe('primary button', () => {
		beforeEach(() => {
			fixture = TestBed.overrideComponent(ButtonDirectiveTestComponent, {
				set: {
					template: '<button mat-button obButton="primary">Primary</button>'
				}
			}).createComponent(ButtonDirectiveTestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			const {name} = fixture.debugElement.query(By.all());
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
			fixture = TestBed.overrideComponent(ButtonDirectiveTestComponent, {
				set: {
					template: '<button mat-button obButton="secondary">Secondary</button>'
				}
			}).createComponent(ButtonDirectiveTestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			const {name} = fixture.debugElement.query(By.all());
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
			fixture = TestBed.overrideComponent(ButtonDirectiveTestComponent, {
				set: {
					template: '<button mat-button obButton="tertiary">Tertiary</button>'
				}
			}).createComponent(ButtonDirectiveTestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			const {name} = fixture.debugElement.query(By.all());
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
			fixture = TestBed.overrideComponent(ButtonDirectiveTestComponent, {
				set: {
					template: '<button mat-button obButton>Undefined</button>'
				}
			}).createComponent(ButtonDirectiveTestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			const {name} = fixture.debugElement.query(By.all());
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
			fixture = TestBed.overrideComponent(ButtonDirectiveTestComponent, {
				set: {
					template: '<button mat-button obButton="illegal">Illegal</button>'
				}
			}).createComponent(ButtonDirectiveTestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			const {name} = fixture.debugElement.query(By.all());
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

	describe('error button', () => {
		beforeEach(() => {
			jest.spyOn(console, 'error');
			fixture = TestBed.overrideComponent(ButtonDirectiveTestComponent, {
				set: {
					template: '<button mat-raised-button obButton="primary">Raised button</button>'
				}
			}).createComponent(ButtonDirectiveTestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		afterEach(() => {
			jest.resetAllMocks();
		});

		it('should be button', () => {
			const {name} = fixture.debugElement.query(By.all());
			expect(name).toBe('button');
		});

		it('should output an error message', () => {
			expect(console.error).toHaveBeenCalledWith(
				'The obButton directive is meant to be used with mat-button or mat-icon-button exclusively. An instance of mat-raised-button, which can lead to unexpected effects, has been detected, please change it to one of the supported variant.'
			);
		});

		it('should output an error once', () => {
			expect(console.error).toHaveBeenCalledTimes(1);
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it('should be primary obButton', () => {
			expect(directive.obButton).toBe('primary');
		});

		it('should have `.mat-primary` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			expect(selectableElement).toBeTruthy();
		});

		it('should have `.mat-raised-button` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-raised-button'));
			expect(selectableElement).toBeTruthy();
		});

		it('should not have `.mat-stroked-button` class', () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			expect(selectableElement).toBeNull();
		});
	});

	describe.each([
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
	])('dynamic button', (parameter: ButtonDirectiveTestParameter) => {
		beforeEach(() => {
			fixture = TestBed.overrideComponent(ButtonDirectiveTestComponent, {
				set: {
					template: '<button mat-button [obButton]="obButton">Dynamic</button>'
				}
			}).createComponent(ButtonDirectiveTestComponent);
			component = fixture.componentInstance;
			component.obButton = parameter.obButtonBeforeChange;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(ObButtonDirective));
			directive = element.injector.get(ObButtonDirective);
		});

		it('should be button', () => {
			const {name} = fixture.debugElement.query(By.all());
			expect(name).toBe('button');
		});

		// BEFORE CHANGE TEST
		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it(`should be ${parameter.expectedButtonBeforeChange} obButton`, () => {
			expect(directive.obButton).toBe(parameter.expectedButtonBeforeChange);
		});

		it(`should ${parameter.expectedButtonClassBeforeChange.primary ? 'have ' : 'not have '} \`.mat-primary\` class`, () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			if (parameter.expectedButtonClassBeforeChange.primary) {
				expect(selectableElement).toBeTruthy();
			} else {
				expect(selectableElement).toBeNull();
			}
		});

		it(`should ${parameter.expectedButtonClassBeforeChange.flat ? 'have ' : 'not have '}\`.mat-flat-button\` class`, () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			if (parameter.expectedButtonClassBeforeChange.flat) {
				expect(selectableElement).toBeTruthy();
			} else {
				expect(selectableElement).toBeNull();
			}
		});

		it(`should ${parameter.expectedButtonClassBeforeChange.stroked ? 'have ' : 'not have '}\`.mat-stroked-button\` class`, () => {
			const selectableElement = fixture.debugElement.query(By.css('.mat-stroked-button'));
			if (parameter.expectedButtonClassBeforeChange.stroked) {
				expect(selectableElement).toBeTruthy();
			} else {
				expect(selectableElement).toBeNull();
			}
		});

		// AFTER CHANGE TEST
		it('should create an instance', () => {
			component.obButton = parameter.obButtonAfterChange;
			fixture.detectChanges();
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
		});

		it(`should be ${parameter.expectedButtonAfterChange} obButton`, () => {
			component.obButton = parameter.obButtonAfterChange;
			fixture.detectChanges();
			expect(directive.obButton).toBe(parameter.expectedButtonAfterChange);
		});

		it(`should ${parameter.expectedButtonClassAfterChange.primary ? 'have ' : 'not have '} \`.mat-primary\` class`, () => {
			component.obButton = parameter.obButtonAfterChange;
			fixture.detectChanges();
			const selectableElement = fixture.debugElement.query(By.css('.mat-primary'));
			if (parameter.expectedButtonClassAfterChange.primary) {
				expect(selectableElement).toBeTruthy();
			} else {
				expect(selectableElement).toBeNull();
			}
		});

		it(`should ${parameter.expectedButtonClassAfterChange.flat ? 'have ' : 'not have '}\`.mat-flat-button\` class`, () => {
			component.obButton = parameter.obButtonAfterChange;
			fixture.detectChanges();
			const selectableElement = fixture.debugElement.query(By.css('.mat-flat-button'));
			if (parameter.expectedButtonClassAfterChange.flat) {
				expect(selectableElement).toBeTruthy();
			} else {
				expect(selectableElement).toBeNull();
			}
		});

		it(`should ${parameter.expectedButtonClassAfterChange.stroked ? 'have ' : 'not have '}\`.mat-stroked-button\` class`, () => {
			component.obButton = parameter.obButtonAfterChange;
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
