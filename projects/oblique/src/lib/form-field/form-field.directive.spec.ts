import {Component, DebugElement, Type} from '@angular/core';
import {ObFormFieldDirective} from './form-field.directive';
import {MatFormFieldModule} from '@angular/material/form-field';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {ObFormFieldModule} from './form-field.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

const imports: (readonly any[] | Type<any>)[] = [FormsModule, MatFormFieldModule, MatInputModule, ObFormFieldModule];

@Component({
	template: `<mat-form-field><input type="text" matInput placeholder="Default" class="mat-mdc-input-element" ngModel /></mat-form-field>`,
	standalone: true,
	imports
})
class DefaultTestComponent {}

@Component({
	template: `<mat-form-field><textarea matInput placeholder="Textarea" class="mat-mdc-input-element" ngModel></textarea></mat-form-field>`,
	standalone: true,
	imports
})
class ContainsTextareaTestComponent {}

@Component({
	template: `<mat-form-field
		><input type="text" matInput placeholder="Mat input server" class="mat-input-server" ngModel
	/></mat-form-field>`,
	standalone: true,
	imports
})
class HasMatInputServerTestComponent {}

@Component({
	template: `<mat-form-field>
		<mat-label>Text prefix</mat-label>
		<input type="text" matInput placeholder="Mat text prefix" ngModel />
		<span matTextPrefix>Mat text prefix</span>
	</mat-form-field>`,
	standalone: true,
	imports
})
class HasTextPrefixTestComponent {}

@Component({
	template: `<mat-form-field>
		<mat-label>Text suffix</mat-label>
		<input type="text" matInput placeholder="Mat text suffix" ngModel />
		<span matTextSuffix>Mat text Suffix</span>
	</mat-form-field>`,
	standalone: true,
	imports
})
class HasTextSuffixTestComponent {}

@Component({
	template: `<mat-form-field
		><input type="text" matInput readonly placeholder="Readonly" class="mat-mdc-input-element" ngModel
	/></mat-form-field>`,
	standalone: true,
	imports
})
class IsReadonlyTestComponent {}

@Component({
	template: `<mat-form-field
		><input type="text" matInput placeholder="Multiline" class="mat-mdc-form-field-required-marker" ngModel
	/></mat-form-field>`,
	standalone: true,
	imports
})
class IsRequiredTestComponent {}

describe(ObFormFieldDirective.name, () => {
	let fixture: ComponentFixture<Component>;
	let debugElement: DebugElement;
	let directive: ObFormFieldDirective;

	describe.each<{propertyToCheck: keyof ObFormFieldDirective; testComponentType: Type<Component>}>([
		{propertyToCheck: 'containsTextarea', testComponentType: ContainsTextareaTestComponent},
		{propertyToCheck: 'hasMatInputServer', testComponentType: HasMatInputServerTestComponent},
		{propertyToCheck: 'hasRequiredMarker', testComponentType: IsRequiredTestComponent},
		{propertyToCheck: 'hasTextPrefix', testComponentType: HasTextPrefixTestComponent},
		{propertyToCheck: 'hasTextSuffix', testComponentType: HasTextSuffixTestComponent},
		{propertyToCheck: 'isReadonly', testComponentType: IsReadonlyTestComponent},
		{propertyToCheck: 'isRequired', testComponentType: IsRequiredTestComponent}
	])('', ({propertyToCheck, testComponentType}) => {
		const readablePropertyName = propertyToCheck
			.replace(/(?<upperCaseLetter>[A-Z])/g, ' $1')
			.replace(/(?<containsHasOrIs>contains|has|is) /, '')
			.toLowerCase();

		test(`that it correctly identifies a non ${readablePropertyName} form field`, async () => {
			await TestBed.configureTestingModule({
				imports: [DefaultTestComponent, NoopAnimationsModule]
			}).compileComponents();

			fixture = TestBed.createComponent(DefaultTestComponent);
			fixture.detectChanges();
			debugElement = fixture.debugElement.query(By.directive(ObFormFieldDirective));
			directive = debugElement.injector.get(ObFormFieldDirective);

			expect(directive[propertyToCheck]).toBeFalsy();
		});

		test(`that it correctly identifies a ${readablePropertyName} form field`, async () => {
			await TestBed.configureTestingModule({
				imports: [testComponentType, NoopAnimationsModule]
			}).compileComponents();

			fixture = TestBed.createComponent(testComponentType);
			fixture.detectChanges();
			debugElement = fixture.debugElement.query(By.directive(ObFormFieldDirective));
			directive = debugElement.injector.get(ObFormFieldDirective);

			expect(directive[propertyToCheck]).toBeTruthy();
		});
	});
});
