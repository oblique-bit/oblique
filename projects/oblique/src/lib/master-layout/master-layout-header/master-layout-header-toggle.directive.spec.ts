import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {ObMasterLayoutHeaderToggleDirective} from './master-layout-header-toggle.directive';

@Component({
	template: '<a obMasterLayoutHeaderToggle> test </a>'
})
class TestComponent {}

describe('ObMasterLayoutHeaderToggleDirective', () => {
	let component: TestComponent;
	let element: DebugElement;
	let fixture: ComponentFixture<TestComponent>;
	let masterLayout: ObMasterLayoutComponentService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObMasterLayoutHeaderToggleDirective],
			providers: [{provide: ObMasterLayoutComponentService, useValue: {isMenuOpened: false}}]
		});

		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		element = fixture.debugElement.query(By.directive(ObMasterLayoutHeaderToggleDirective));
		masterLayout = TestBed.inject(ObMasterLayoutComponentService);
	});

	it('should create component', () => {
		expect(component).toBeDefined();
	});

	it('should have ob-master-layout-header-toggle class', () => {
		expect(element.nativeElement.classList.contains('ob-master-layout-header-toggle')).toBe(true);
	});

	describe('toggle', () => {
		beforeEach(() => {
			masterLayout.isMenuOpened = false;
		});

		describe('click', () => {
			it('should toggle on click', () => {
				element.nativeElement.click();
				expect(masterLayout.isMenuOpened).toBe(true);
			});

			it('should prevent default', () => {
				const event = new MouseEvent('click');
				jest.spyOn(event, 'preventDefault');
				element.nativeElement.dispatchEvent(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});
		});

		describe('keyup', () => {
			let event: KeyboardEvent;
			beforeEach(() => {
				event = new KeyboardEvent('keyup', {key: 'Enter'});
			});

			it('should toggle on Enter', () => {
				element.nativeElement.dispatchEvent(event);
				expect(masterLayout.isMenuOpened).toBe(true);
			});

			it('should prevent default', () => {
				jest.spyOn(event, 'preventDefault');
				element.nativeElement.dispatchEvent(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('should not toggle when triggered on a div', () => {
				Object.defineProperty(event, 'target', {value: {nodeName: 'BUTTON'}});
				element.nativeElement.dispatchEvent(event);
				expect(masterLayout.isMenuOpened).toBe(false);
			});

			it('should not toggle on Space', () => {
				element.nativeElement.dispatchEvent(new KeyboardEvent('keyup', {key: 'Space'}));
				expect(masterLayout.isMenuOpened).toBe(false);
			});
		});
	});
});
