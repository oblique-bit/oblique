import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {ObSchemaRequiredDirective} from './schema-required.directive';
import {ObSchemaValidationDirective} from './schema-validation.directive';

@Component({
	imports: [FormsModule, ObSchemaValidationDirective, ObSchemaRequiredDirective, MatFormField, MatInput, MatLabel, ReactiveFormsModule],
	template: `<form [obSchemaValidation]="schema" [formGroup]="form">
		<mat-form-field appearance="outline">
			<mat-label>label</mat-label>
			<input matInput obSchemaValidate type="text" formControlName="text" />
		</mat-form-field>
	</form>`
})
class TestReactiveComponent {
	form = inject(FormBuilder).group({text: ''});
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		required: ['text'],
		properties: {text: {type: 'string'}}
	};
}

@Component({
	imports: [FormsModule, ObSchemaValidationDirective, ObSchemaRequiredDirective, MatFormField, MatInput, MatLabel],
	template: `<form [obSchemaValidation]="schema">
		<mat-form-field appearance="outline">
			<mat-label>label</mat-label>
			<input matInput obSchemaValidate type="text" name="text" [(ngModel)]="text" />
		</mat-form-field>
	</form>`
})
class TestTemplateComponent {
	text: string;
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		required: ['text'],
		properties: {text: {type: 'string'}}
	};
}

describe(ObSchemaRequiredDirective.name, () => {
	let fixture: ComponentFixture<TestReactiveComponent | TestTemplateComponent>;
	let directive: ObSchemaRequiredDirective;

	describe('Reactive form', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObSchemaRequiredDirective, TestReactiveComponent]
			}).compileComponents();
			fixture = TestBed.createComponent(TestReactiveComponent);
			const debugElement = fixture.debugElement.query(By.directive(ObSchemaRequiredDirective));
			directive = debugElement.injector.get(ObSchemaRequiredDirective);
			fixture.detectChanges();
		});

		runTests();
	});

	describe('Template driven form', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObSchemaRequiredDirective, TestTemplateComponent]
			}).compileComponents();

			fixture = TestBed.createComponent(TestTemplateComponent);
			const debugElement = fixture.debugElement.query(By.directive(ObSchemaRequiredDirective));
			directive = debugElement.injector.get(ObSchemaRequiredDirective);
			fixture.detectChanges();
		});

		runTests();
	});

	function runTests(): void {
		test('directive creation', () => {
			expect(directive).toBeTruthy();
		});

		test('is required set to "true"', () => {
			expect(directive.required).toBe(true);
		});

		describe('marker insertion', () => {
			let span: DebugElement;
			beforeEach(() => {
				span = fixture.debugElement.query(By.css('label > span'));
			});

			test('span insertion', () => {
				expect(span).toBeTruthy();
			});

			test('span has aria-hidden=true', () => {
				expect(span.nativeElement.getAttribute('aria-hidden')).toBe('true');
			});

			test.each(['mat-mdc-form-field-required-marker', 'mdc-floating-label--required'])('span has %s class', className => {
				expect(span.nativeElement.classList.contains(className)).toBe(true);
			});
		});
	}
});
