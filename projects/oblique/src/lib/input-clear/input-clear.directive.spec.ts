import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component, inject} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule} from '@angular/forms';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {WINDOW} from '../utilities';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObInputClearDirective} from './input-clear.directive';

@Component({
	template: ` <div [formGroup]="testForm">
		<mat-form-field>
			<mat-label>Test input</mat-label>
			<input type="text" matInput formControlName="field1" />
			<button type="button" role="button" [obInputClear]="testForm.get('field1')">
				<span class="ob-screen-reader-only">{{ 'i18n.common.clear' | translate }}</span>
			</button>
		</mat-form-field>
	</div>`
})
class UntypedReactiveFormTestComponent {
	testForm: FormGroup;
	private readonly formBuilder = inject(FormBuilder);

	constructor() {
		this.testForm = this.formBuilder.group({
			field1: ['']
		});
	}
}

@Component({
	template: ` <div [formGroup]="testForm">
		<mat-form-field>
			<mat-label>Test input</mat-label>
			<input type="text" matInput formControlName="field1" />
			<button type="button" role="button" [obInputClear]="testForm.get('field1')">
				<span class="ob-screen-reader-only">{{ 'i18n.common.clear' | translate }}</span>
			</button>
		</mat-form-field>
	</div>`
})
class StronglyTypedReactiveFormTestComponent {
	testForm: FormGroup<{field1: FormControl<string>}>;
	private readonly formBuilder = inject(FormBuilder);

	constructor() {
		this.testForm = this.formBuilder.group({
			field1: ['']
		});
	}
}

@Component({
	template: ` <div>
		<mat-form-field>
			<mat-label>Mandatory</mat-label>
			<input type="text" matInput placeholder="Mandatory" required [(ngModel)]="testModel" #control="ngModel" />
			<button type="button" role="button" [obInputClear]="control">
				<span class="ob-screen-reader-only">{{ 'i18n.common.clear' | translate }}</span>
			</button>
		</mat-form-field>
	</div>`
})
class TemplateDrivenFormTestComponent {
	testModel: string;
}

@Component({
	template: ` <div>
		<mat-form-field>
			<mat-label>Mandatory</mat-label>
			<input type="text" matInput placeholder="Mandatory" required #control />
			<button type="button" role="button" [obInputClear]="control">
				<span class="ob-screen-reader-only">{{ 'i18n.common.clear' | translate }}</span>
			</button>
		</mat-form-field>
	</div>`
})
class HtmlInputTestComponent {}

@Component({
	template: ` <div>
		<mat-form-field>
			<mat-label>Mandatory</mat-label>
			<input type="text" matInput placeholder="Mandatory" required />
			<button type="button" role="button" [obInputClear]="testModel">
				<span class="ob-screen-reader-only">{{ 'i18n.common.clear' | translate }}</span>
			</button>
		</mat-form-field>
	</div>`
})
class WrongConfigurationTestComponent {
	testModel: string;
}

describe('InputClear', () => {
	describe('with reactive forms', () => {
		let component: UntypedReactiveFormTestComponent;
		let fixture: ComponentFixture<UntypedReactiveFormTestComponent>;
		let input: HTMLInputElement;
		let directive: ObInputClearDirective;

		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [UntypedReactiveFormTestComponent, ObMockTranslatePipe, ObInputClearDirective],
				imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(UntypedReactiveFormTestComponent);
			component = fixture.componentInstance;
			directive = fixture.debugElement.query(By.directive(ObInputClearDirective)).injector.get(ObInputClearDirective);
			fixture.detectChanges();
		});

		describe('onClick', () => {
			beforeEach(() => {
				input = fixture.nativeElement.querySelector('input');
				input.value = 'testInput';
				input.dispatchEvent(new Event('input'));
				jest.spyOn(directive, 'onClick');
				fixture.nativeElement.querySelector('button').click();
				fixture.detectChanges();
			});

			test('that it calls the directive on button click', () => {
				expect(directive.onClick).toHaveBeenCalled();
			});

			test('that it clears the FormControl', () => {
				expect(component.testForm.get('field1').value).toBeNull();
			});

			test('that it clears the input field', () => {
				expect(input.value).toBe('');
			});
		});
	});

	describe('with strongly typed reactive forms', () => {
		let component: StronglyTypedReactiveFormTestComponent;
		let fixture: ComponentFixture<StronglyTypedReactiveFormTestComponent>;
		let input: HTMLInputElement;
		let directive: ObInputClearDirective;

		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [StronglyTypedReactiveFormTestComponent, ObMockTranslatePipe, ObInputClearDirective],
				imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(StronglyTypedReactiveFormTestComponent);
			component = fixture.componentInstance;
			directive = fixture.debugElement.query(By.directive(ObInputClearDirective)).injector.get(ObInputClearDirective);
			fixture.detectChanges();
		});

		describe('onClick', () => {
			beforeEach(() => {
				input = fixture.nativeElement.querySelector('input');
				input.value = 'testInput';
				input.dispatchEvent(new Event('input'));
				jest.spyOn(directive, 'onClick');
				fixture.nativeElement.querySelector('button').click();
				fixture.detectChanges();
			});

			test('that it calls the directive on button click', () => {
				expect(directive.onClick).toHaveBeenCalled();
			});

			test('that it clears the FormControl', () => {
				expect(component.testForm.get('field1').value).toBeNull();
			});

			test('that it clears the input field', () => {
				expect(input.value).toBe('');
			});
		});
	});

	describe('with template-driven forms', () => {
		let component: TemplateDrivenFormTestComponent;
		let fixture: ComponentFixture<TemplateDrivenFormTestComponent>;
		let input: HTMLInputElement;
		let directive: ObInputClearDirective;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [TemplateDrivenFormTestComponent, ObMockTranslatePipe, ObInputClearDirective],
				imports: [FormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(TemplateDrivenFormTestComponent);
			component = fixture.componentInstance;
			directive = fixture.debugElement.query(By.directive(ObInputClearDirective)).injector.get(ObInputClearDirective);
			fixture.detectChanges();
		});

		beforeEach(() => {
			input = fixture.nativeElement.querySelector('input');
			input.value = 'testInput';
			fixture.detectChanges();
			input.dispatchEvent(new Event('input'));
			jest.spyOn(directive, 'onClick');
			fixture.nativeElement.querySelector('button').click();
		});

		test('that it calls the directive on button click', () => {
			expect(directive.onClick).toHaveBeenCalled();
		});

		test('that it clears the input field', () => {
			expect(input.value).toBe('');
		});

		test('that it clears the model', () => {
			expect(component.testModel).toBeNull();
		});
	});

	describe('with html input only', () => {
		let fixture: ComponentFixture<HtmlInputTestComponent>;
		let input: HTMLInputElement;
		let directive: ObInputClearDirective;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [HtmlInputTestComponent, ObMockTranslatePipe, ObInputClearDirective],
				imports: [FormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(HtmlInputTestComponent);
			directive = fixture.debugElement.query(By.directive(ObInputClearDirective)).injector.get(ObInputClearDirective);
			fixture.detectChanges();
		});

		describe('onClick', () => {
			beforeEach(() => {
				input = fixture.nativeElement.querySelector('input');
				input.value = 'testInput';
				input.dispatchEvent(new Event('input'));
				jest.spyOn(directive, 'onClick');
				fixture.nativeElement.querySelector('button').click();
				fixture.detectChanges();
			});

			test('that it calls the directive on button click', () => {
				expect(directive.onClick).toHaveBeenCalled();
			});

			test('that it clears the input field', () => {
				expect(input.value).toBe('');
			});
		});
	});

	describe('with wrong configuration', () => {
		let fixture: ComponentFixture<WrongConfigurationTestComponent>;
		let input: HTMLInputElement;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [WrongConfigurationTestComponent, ObMockTranslatePipe, ObInputClearDirective],
				imports: [FormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		});

		beforeEach(() => {
			jest.spyOn(console, 'warn');
			fixture = TestBed.createComponent(WrongConfigurationTestComponent);
			fixture.detectChanges();
		});

		describe('onClick', () => {
			beforeEach(() => {
				input = fixture.nativeElement.querySelector('input');
				input.value = 'testInput';
				fixture.detectChanges();
				input.dispatchEvent(new Event('input'));
				fixture.nativeElement.querySelector('button').click();
			});

			test('that it does not clear the input field', () => {
				expect(input.value).toEqual('testInput');
			});

			test('that it writes a warning message in the console', () => {
				expect(console.warn).toHaveBeenCalledWith(
					`${ObInputClearDirective.name}: illegal value for obInputClear Input, please use one of the following: [${AbstractControl.name}, ${HTMLInputElement.name}, ${NgModel.name}].`
				);
			});
		});
	});
});
