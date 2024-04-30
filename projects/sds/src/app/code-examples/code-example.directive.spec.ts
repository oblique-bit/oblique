import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {CodeExampleDirective} from './code-example.directive';

@Component({
	standalone: true,
	template: 'Hello World'
})
class DummyComponent {}

@Component({
	standalone: true,
	imports: [CodeExampleDirective],
	template: '<div appCodeExample></div>'
})
class CodeExampleDirectiveTestComponent {}

describe(CodeExampleDirective.name, () => {
	let directive: CodeExampleDirective;
	let fixture: ComponentFixture<CodeExampleDirectiveTestComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CodeExampleDirectiveTestComponent, CodeExampleDirective, DummyComponent]
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CodeExampleDirectiveTestComponent);
		const element = fixture.debugElement.query(By.directive(CodeExampleDirective));
		directive = element.injector.get(CodeExampleDirective);
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	describe('codeExampleComponent', () => {
		beforeEach(() => {
			directive.codeExampleComponent = DummyComponent;
			directive.ngOnChanges();
		});

		it('should inject the component passed as a parameter', () => {
			const element = fixture.debugElement.query(By.directive(DummyComponent));
			expect(element).toBeTruthy();
		});

		it('should remove the component when no ', () => {
			directive.codeExampleComponent = null;
			directive.ngOnChanges();
			const element = fixture.debugElement.query(By.directive(DummyComponent));

			expect(element).toBeFalsy();
		});
	});
});
