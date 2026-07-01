import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {ChangeDetectionStrategy, Component, provideZonelessChangeDetection} from '@angular/core';
import {By} from '@angular/platform-browser';
import {CodeExampleDirective} from './code-example.directive';

@Component({
	template: 'Hello World',
	changeDetection: ChangeDetectionStrategy.Eager,
})
class DummyComponent {}

@Component({
	imports: [CodeExampleDirective],
	template: '<div appCodeExample [codeExampleComponent]="component"></div>',
	changeDetection: ChangeDetectionStrategy.Eager,
})
class CodeExampleDirectiveTestComponent {
	component = DummyComponent;
}

describe(CodeExampleDirective.name, () => {
	let fixture: ComponentFixture<CodeExampleDirectiveTestComponent>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [provideZonelessChangeDetection()],
			imports: [CodeExampleDirectiveTestComponent, CodeExampleDirective, DummyComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CodeExampleDirectiveTestComponent, {});
	});

	describe('codeExampleComponent', () => {
		it('should inject the component passed as a parameter', async () => {
			fixture.detectChanges();
			await fixture.whenStable();

			const element = fixture.debugElement.query(By.directive(DummyComponent));

			expect(element).toBeTruthy();
		});

		it('should remove the component when no ', async () => {
			const emptyFixture = TestBed.createComponent(CodeExampleDirectiveTestComponent);
			emptyFixture.componentInstance.component = null;
			fixture.detectChanges();
			await fixture.whenStable();

			const element = emptyFixture.debugElement.query(By.directive(DummyComponent));

			expect(element).toBeFalsy();
		});
	});
});
