import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {ObOffCanvasContainerDirective} from './off-canvas-container.directive';
import {ObOffCanvasService} from './off-canvas.service';

@Component({
	imports: [ObOffCanvasContainerDirective],
	template: `<div class="ob-off-canvas"></div>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class TestComponent {}

describe(ObOffCanvasContainerDirective.name, () => {
	let fixture: ComponentFixture<TestComponent>;
	let element: HTMLElement;
	let directive: ObOffCanvasContainerDirective;
	let opened$: Subject<boolean>;

	beforeEach(() => {
		opened$ = new Subject<boolean>();
		TestBed.configureTestingModule({
			imports: [TestComponent],
			providers: [{provide: ObOffCanvasService, useValue: {opened$}}],
		});

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		const debugElement = fixture.debugElement.query(By.directive(ObOffCanvasContainerDirective));
		element = debugElement.nativeElement;
		directive = debugElement.injector.get(ObOffCanvasContainerDirective);
	});

	afterEach(() => {
		fixture.destroy();
	});

	it('should create an instance', () => {
		expect(directive).toBeTruthy();
	});

	it('should not have the ob-off-canvas-in class initially', () => {
		expect(element.classList.contains('ob-off-canvas-in')).toBe(false);
	});

	describe('when the off-canvas is opened', () => {
		beforeEach(() => {
			opened$.next(true);
			fixture.detectChanges();
		});

		it('should be open', () => {
			expect(directive.open).toBe(true);
		});

		it('should have the ob-off-canvas-in class', () => {
			expect(element.classList.contains('ob-off-canvas-in')).toBe(true);
		});
	});

	describe('when the off-canvas is closed again', () => {
		beforeEach(() => {
			opened$.next(true);
			fixture.detectChanges();
			opened$.next(false);
			fixture.detectChanges();
		});

		it('should not be open', () => {
			expect(directive.open).toBe(false);
		});

		it('should not have the ob-off-canvas-in class', () => {
			expect(element.classList.contains('ob-off-canvas-in')).toBe(false);
		});
	});

	describe('ngOnDestroy', () => {
		it('should stop listening when the host is destroyed', () => {
			fixture.destroy();
			opened$.next(true);
			expect(directive.open).toBe(false);
		});

		it('should not react to further emissions after destroy', () => {
			opened$.next(true);
			fixture.detectChanges();
			expect(directive.open).toBe(true);

			fixture.destroy();
			opened$.next(false);
			expect(directive.open).toBe(true);
		});
	});
});
