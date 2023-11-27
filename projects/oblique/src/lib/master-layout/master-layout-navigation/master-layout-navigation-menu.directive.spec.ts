import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';

@Component({
	template: '<span obMasterLayoutNavigationMenu> test </span>'
})
class TestComponent {}

describe(ObMasterLayoutNavigationMenuDirective.name, () => {
	let element: HTMLSpanElement;
	let fixture: ComponentFixture<TestComponent>;
	let directive: ObMasterLayoutNavigationMenuDirective;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObMasterLayoutNavigationMenuDirective]
		});

		fixture = TestBed.createComponent(TestComponent);
		const debugElement = fixture.debugElement.query(By.directive(ObMasterLayoutNavigationMenuDirective));
		element = debugElement.nativeElement;
		directive = debugElement.injector.get(ObMasterLayoutNavigationMenuDirective);
	});

	it('should create', () => {
		expect(directive).toBeDefined();
	});

	it('should have ob-master-layout-navigation-toggle class', () => {
		expect(element.classList.contains('ob-master-layout-navigation-menu')).toBe(true);
	});

	it('should open the menu when menuOpened called once', () => {
		directive.menuOpened();
		expect(directive.hasOpenedMenu).toBe(true);
	});

	it('should close the menu when menuOpened called once', () => {
		directive.menuClosed();
		expect(directive.hasOpenedMenu).toBe(false);
	});

	it('should open the menu when menuOpened called more than menuClosed', () => {
		directive.menuOpened();
		directive.menuOpened();
		directive.menuClosed();
		expect(directive.hasOpenedMenu).toBe(true);
	});
});
