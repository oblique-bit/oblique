import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ChangeDetectionStrategy, Component, DebugElement, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {MatInput} from '@angular/material/input';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {ObSchemaRequiredDirective} from './schema-required.directive';
import {ObSchemaValidationDirective} from './schema-validation.directive';

@Component({
	imports: [
		FormsModule,
		ObSchemaValidationDirective,
		ObSchemaRequiredDirective,
		MatFormField,
		MatInput,
		MatLabel,
		ReactiveFormsModule,
	],
	template: `<form [obSchemaValidation]="schema" [formGroup]="form">
		<mat-form-field appearance="outline">
			<mat-label>label</mat-label>
			<input matInput obSchemaValidate type="text" formControlName="text" />
		</mat-form-field>
	</form>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class TestReactiveComponent {
	form = inject(FormBuilder).group({text: ''});
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		required: ['text'],
		properties: {text: {type: 'string'}},
	};
}

@Component({
	imports: [FormsModule, ObSchemaValidationDirective, ObSchemaRequiredDirective, MatFormField, MatInput, MatLabel],
	template: `<form [obSchemaValidation]="schema">
		<mat-form-field appearance="outline">
			<mat-label>label</mat-label>
			<input matInput obSchemaValidate type="text" name="text" [(ngModel)]="text" />
		</mat-form-field>
	</form>`,
})
class TestTemplateComponent {
	text: string;
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		required: ['text'],
		properties: {text: {type: 'string'}},
	};
}

@Component({
	imports: [FormsModule, ObSchemaValidationDirective, ObSchemaRequiredDirective, MatInput],
	template: `<form [obSchemaValidation]="schema">
		<input matInput obSchemaValidate type="text" name="text" [(ngModel)]="text" />
	</form>`,
})
class TestWithoutFormFieldComponent {
	text: string;
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		required: ['text'],
		properties: {text: {type: 'string'}},
	};
}

@Component({
	imports: [FormsModule, ObSchemaValidationDirective, ObSchemaRequiredDirective, MatFormField, MatInput],
	template: `<form [obSchemaValidation]="schema">
		<mat-form-field appearance="outline">
			<input matInput obSchemaValidate type="text" name="text" [(ngModel)]="text" />
		</mat-form-field>
	</form>`,
})
class TestWithoutLabelComponent {
	text: string;
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		required: ['text'],
		properties: {text: {type: 'string'}},
	};
}

@Component({
	imports: [FormsModule, ObSchemaValidationDirective, ObSchemaRequiredDirective, MatFormField, MatInput, MatLabel],
	template: `<form [obSchemaValidation]="schema">
		<mat-form-field appearance="outline">
			<mat-label>label</mat-label>
			<input matInput obSchemaValidate type="text" name="text" [(ngModel)]="text" />
		</mat-form-field>
	</form>`,
})
class TestOptionalTemplateComponent {
	text: string;
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		required: [],
		properties: {text: {type: 'string'}},
	};
}

@Component({
	imports: [FormsModule, ObSchemaValidationDirective, ObSchemaRequiredDirective, MatFormField, MatInput, MatLabel],
	template: `<form [obSchemaValidation]="schema">
		<div ngModelGroup="nested">
			<mat-form-field appearance="outline">
				<mat-label>label</mat-label>
				<input matInput obSchemaValidate type="text" name="text" [(ngModel)]="text" />
			</mat-form-field>
		</div>
	</form>`,
})
class TestNestedTemplateComponent {
	text: string;
	schema = {
		title: 'SampleSchemaValidation',
		type: 'object',
		properties: {
			nested: {
				type: 'object',
				required: ['text'],
				properties: {text: {type: 'string'}},
			},
		},
	};
}

describe(ObSchemaRequiredDirective.name, () => {
	let fixture: ComponentFixture<TestReactiveComponent | TestTemplateComponent>;
	let directive: ObSchemaRequiredDirective;

	describe('Reactive form', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObSchemaRequiredDirective, TestReactiveComponent],
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
				imports: [ObSchemaRequiredDirective, TestTemplateComponent],
			}).compileComponents();

			fixture = TestBed.createComponent(TestTemplateComponent);
			const debugElement = fixture.debugElement.query(By.directive(ObSchemaRequiredDirective));
			directive = debugElement.injector.get(ObSchemaRequiredDirective);
			fixture.detectChanges();
		});

		runTests();
	});

	describe('Optional template driven form', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObSchemaRequiredDirective, TestOptionalTemplateComponent],
			}).compileComponents();

			fixture = TestBed.createComponent(TestOptionalTemplateComponent);
			const debugElement = fixture.debugElement.query(By.directive(ObSchemaRequiredDirective));
			directive = debugElement.injector.get(ObSchemaRequiredDirective);
			fixture.detectChanges();
		});

		test('is required set to "false"', () => {
			expect(directive.required).toBe(false);
		});

		test('span is not inserted', () => {
			expect(fixture.debugElement.query(By.css('label > span'))).toBeNull();
		});
	});

	describe('Required template driven form without mat-form-field', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObSchemaRequiredDirective, TestWithoutFormFieldComponent],
			}).compileComponents();

			fixture = TestBed.createComponent(TestWithoutFormFieldComponent);
			const debugElement = fixture.debugElement.query(By.directive(ObSchemaRequiredDirective));
			directive = debugElement.injector.get(ObSchemaRequiredDirective);
			fixture.detectChanges();
		});

		test('does not insert a marker without a mat-form-field', () => {
			expect(directive.required).toBe(true);
			expect(fixture.debugElement.query(By.css('label > span'))).toBeNull();
		});
	});

	describe('Required template driven form without label', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObSchemaRequiredDirective, TestWithoutLabelComponent],
			}).compileComponents();

			fixture = TestBed.createComponent(TestWithoutLabelComponent);
			const debugElement = fixture.debugElement.query(By.directive(ObSchemaRequiredDirective));
			directive = debugElement.injector.get(ObSchemaRequiredDirective);
			fixture.detectChanges();
		});

		test('does not insert a marker without a label', () => {
			expect(directive.required).toBe(true);
			expect(fixture.debugElement.query(By.css('label > span'))).toBeNull();
		});
	});

	describe('Nested template driven form', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObSchemaRequiredDirective, TestNestedTemplateComponent],
			}).compileComponents();

			fixture = TestBed.createComponent(TestNestedTemplateComponent);
			const debugElement = fixture.debugElement.query(By.directive(ObSchemaRequiredDirective));
			directive = debugElement.injector.get(ObSchemaRequiredDirective);
			fixture.detectChanges();
		});

		test('uses the model group path for required checks', () => {
			expect(directive.required).toBe(true);
		});
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

			test.each(['mat-mdc-form-field-required-marker', 'mdc-floating-label--required'])(
				'span has %s class',
				className => {
					expect(span.nativeElement.classList.contains(className)).toBe(true);
				}
			);
		});
	}
});
