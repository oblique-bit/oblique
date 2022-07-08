import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ObMasterLayoutNavigationToggleDirective} from './master-layout-navigation-toggle.directive';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';

@Component({
	template: '<span obMasterLayoutNavigationToggle> test </span>'
})
class TestComponent {}

describe('ObMasterLayoutNavigationToggleDirective', () => {
	let element: HTMLSpanElement;
	let fixture: ComponentFixture<TestComponent>;
	let directive: ObMasterLayoutNavigationToggleDirective;
	const mock = {
		toggleSubMenu: jest.fn()
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObMasterLayoutNavigationToggleDirective],
			providers: [{provide: ObMasterLayoutNavigationItemDirective, useValue: mock}]
		});

		fixture = TestBed.createComponent(TestComponent);
		const debugElement = fixture.debugElement.query(By.directive(ObMasterLayoutNavigationToggleDirective));
		element = debugElement.nativeElement;
		directive = debugElement.injector.get(ObMasterLayoutNavigationToggleDirective);
	});

	it('should create', () => {
		expect(directive).toBeTruthy();
	});

	it('should have ob-master-layout-navigation-toggle class', () => {
		expect(element.classList.contains('ob-master-layout-navigation-toggle')).toBe(true);
	});

	describe('toggle', () => {
		afterEach(() => {
			mock.toggleSubMenu.mockReset();
		});

		describe('click', () => {
			it('should toggle on click', () => {
				element.click();
				expect(mock.toggleSubMenu).toHaveBeenCalled();
			});

			it('should prevent default', () => {
				const event = new MouseEvent('click');
				jest.spyOn(event, 'preventDefault');
				element.dispatchEvent(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});
		});

		describe('keyup', () => {
			let event: KeyboardEvent;
			beforeEach(() => {
				event = new KeyboardEvent('keyup', {key: 'Enter'});
			});

			it('should toggle on Enter', () => {
				element.dispatchEvent(event);
				expect(mock.toggleSubMenu).toHaveBeenCalled();
			});

			it('should prevent default', () => {
				jest.spyOn(event, 'preventDefault');
				element.dispatchEvent(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('should not toggle when triggered on a div', () => {
				Object.defineProperty(event, 'target', {value: {nodeName: 'BUTTON'}});
				element.dispatchEvent(event);
				expect(mock.toggleSubMenu).not.toHaveBeenCalled();
			});

			it('should not toggle on Space', () => {
				element.dispatchEvent(new KeyboardEvent('keyup', {key: 'Space'}));
				expect(mock.toggleSubMenu).not.toHaveBeenCalled();
			});
		});
	});
});
