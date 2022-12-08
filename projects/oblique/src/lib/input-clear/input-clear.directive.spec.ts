import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
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
class ReactiveFormTestComponent {
	testForm: FormGroup;

	constructor(private readonly formBuilder: FormBuilder) {
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
		let component: ReactiveFormTestComponent;
		let fixture: ComponentFixture<ReactiveFormTestComponent>;
		let input: HTMLInputElement;
		let directive: ObInputClearDirective;

		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ReactiveFormTestComponent, ObMockTranslatePipe, ObInputClearDirective],
				imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(ReactiveFormTestComponent);
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

			it('should call the directive on button click', () => {
				expect(directive.onClick).toHaveBeenCalled();
			});

			it('should clear the FormControl', () => {
				expect(component.testForm.get('field1').value).toBeNull();
			});

			it('should clear the input field', () => {
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

		it('should call the directive on button click', () => {
			expect(directive.onClick).toHaveBeenCalled();
		});

		it('should clear the input field', () => {
			expect(input.value).toBe('');
		});

		it('should clear the model', () => {
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

			it('should call the directive on button click', () => {
				expect(directive.onClick).toHaveBeenCalled();
			});

			it('should clear the input field', () => {
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

			it('should not clear the input field', () => {
				expect(input.value).toEqual('testInput');
			});

			it('should write an warn message in the console', () => {
				expect(console.warn).toHaveBeenCalledWith(
					'ObInputClearDirective: illegal value for obInputClear Input, please use one of the following: HTMLInputElement, FormControl or NgModel.'
				);
			});
		});
	});
});
