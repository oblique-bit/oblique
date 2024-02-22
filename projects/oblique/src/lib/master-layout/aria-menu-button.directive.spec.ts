import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {ObAriaMenuButtonDirective} from './aria-menu-button.directive';

@Component({
	template: `<div obAriaMenuButton="test"></div>`
})
class TestComponent {}

describe(ObAriaMenuButtonDirective.name, () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: HTMLElement;
	let directive: ObAriaMenuButtonDirective;
	const mock = {
		click$: new Subject()
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObAriaMenuButtonDirective],
			providers: [{provide: ObGlobalEventsService, useValue: mock}]
		});

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		component = fixture.componentInstance;
		const debugElement = fixture.debugElement.query(By.directive(ObAriaMenuButtonDirective));
		element = debugElement.nativeElement;
		directive = debugElement.injector.get(ObAriaMenuButtonDirective);
	});

	describe('component', () => {
		it('should create an instance', () => {
			expect(component).toBeTruthy();
		});

		it('should have an aria-popup property', () => {
			expect(element.getAttribute('aria-haspopup')).toBe('true');
		});

		it('should have an aria-expanded property', () => {
			expect(element.getAttribute('aria-expanded')).toBe(null);
		});

		it('should have an aria-controls property', () => {
			expect(element.getAttribute('aria-controls')).toBe('test');
		});

		it('should have an aria-owns property', () => {
			expect(element.getAttribute('aria-owns')).toBe('test');
		});

		it('should expand on click', () => {
			element.click();
			fixture.detectChanges();
			expect(element.getAttribute('aria-expanded')).toBe('true');
		});

		it('should close on escape', () => {
			element.dispatchEvent(new KeyboardEvent('Escape'));
			fixture.detectChanges();
			expect(element.getAttribute('aria-expanded')).toBe(null);
		});
	});

	describe('directive', () => {
		it('should create an instance', () => {
			expect(directive).toBeTruthy();
		});

		it('should have a popup property', () => {
			expect(directive.popup).toBe(true);
		});

		it('should have a target property', () => {
			expect(directive.target).toBe('test');
		});

		it('should have an active property', () => {
			expect(directive.active).toBe(undefined);
		});

		describe('should toggle active on click', () => {
			beforeEach(() => {
				directive.active = undefined;
				directive.onClick();
			});

			it('should set active to true', () => {
				expect(directive.active).toBe(true);
			});

			it('should set active to undefined with another click', () => {
				directive.onClick();
				expect(directive.active).toBe(undefined);
			});

			it('should set active to undefined with an outside click', () => {
				mock.click$.next({});
				fixture.detectChanges();
				expect(directive.active).toBe(undefined);
			});
		});
	});
});
