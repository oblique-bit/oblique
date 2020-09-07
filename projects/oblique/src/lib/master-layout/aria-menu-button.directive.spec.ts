import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ObAriaMenuButtonDirective} from './aria-menu-button.directive';

@Component({
	template: `<div obAriaMenuButton="test"></div>`
})
class TestComponent {}

describe('AriaMenuButtonDirective', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element;
	let directive: ObAriaMenuButtonDirective;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObAriaMenuButtonDirective]
		});

		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		component = fixture.componentInstance;
		element = fixture.debugElement.query(By.directive(ObAriaMenuButtonDirective));
		directive = element.injector.get(ObAriaMenuButtonDirective) as ObAriaMenuButtonDirective;
	});

	describe('component', () => {
		it('should create an instance', () => {
			expect(component).toBeTruthy();
		});

		it('should have an aria-popup property', () => {
			expect(element.attributes['aria-haspopup']).toBe('true');
		});

		it('should have an aria-expanded property', () => {
			expect(element.attributes['aria-expanded']).toBe(null);
		});

		it('should have an aria-controls property', () => {
			expect(element.attributes['aria-controls']).toBe('test');
		});

		it('should have an aria-owns property', () => {
			expect(element.attributes['aria-owns']).toBe('test');
		});

		it('should expand on click', () => {
			element.nativeElement.click();
			fixture.detectChanges();
			expect(element.attributes['aria-expanded']).toBe('true');
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

		it('should toggle active on click', () => {
			directive.onClick();
			expect(directive.active).toBe(true);
			directive.onClick();
			expect(directive.active).toBe(undefined);
		});
	});
});
