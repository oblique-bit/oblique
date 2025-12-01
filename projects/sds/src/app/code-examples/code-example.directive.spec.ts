import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {CodeExampleDirective} from './code-example.directive';

@Component({
	standalone: true,
	template: 'Hello World',
})
class DummyComponent {}

@Component({
	imports: [CodeExampleDirective],
	standalone: true,
	template: '<div appCodeExample [codeExampleComponent]="component"></div>',
})
class CodeExampleDirectiveTestComponent {
	component = DummyComponent;
}

describe(CodeExampleDirective.name, () => {
	let fixture: ComponentFixture<CodeExampleDirectiveTestComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CodeExampleDirectiveTestComponent, CodeExampleDirective, DummyComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CodeExampleDirectiveTestComponent);
		fixture.detectChanges();
	});

	describe('codeExampleComponent', () => {
		it('should inject the component passed as a parameter', () => {
			const element = fixture.debugElement.query(By.directive(DummyComponent));
			expect(element).toBeTruthy();
		});

		it('should remove the component when no ', () => {
			fixture.componentInstance.component = null;
			fixture.detectChanges();
			const element = fixture.debugElement.query(By.directive(DummyComponent));

			expect(element).toBeFalsy();
		});
	});
});
