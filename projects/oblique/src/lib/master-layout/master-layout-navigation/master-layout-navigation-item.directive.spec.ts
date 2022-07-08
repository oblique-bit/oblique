import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {ObMockMasterLayoutComponentService} from '../_mocks/mock-master-layout.component.service';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';
import {ObMasterLayoutNavigationMenuDirective} from './master-layout-navigation-menu.directive';

@Component({
	template: '<li role="presentation" obMasterLayoutNavigationItem> test </li>'
})
class TestComponent {}

describe('ObMasterLayoutNavigationItemDirective', () => {
	let element: HTMLElement;
	let fixture: ComponentFixture<TestComponent>;
	let directive: ObMasterLayoutNavigationItemDirective;
	let masterLayoutService: ObMasterLayoutComponentService;
	const mock = {
		menuOpened: jest.fn(),
		menuClosed: jest.fn()
	};
	const clickSubject = new Subject<MouseEvent>();
	const keyUpSubject = new Subject<KeyboardEvent>();
	const globalEventMock = {
		click$: clickSubject.asObservable(),
		keyUp$: keyUpSubject.asObservable()
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObMasterLayoutNavigationItemDirective],
			providers: [
				{provide: ObMasterLayoutComponentService, useClass: ObMockMasterLayoutComponentService},
				{provide: ObGlobalEventsService, useValue: globalEventMock},
				{provide: ObMasterLayoutNavigationMenuDirective, useValue: mock}
			]
		});

		fixture = TestBed.createComponent(TestComponent);
		masterLayoutService = TestBed.inject(ObMasterLayoutComponentService);
		const debugElement = fixture.debugElement.query(By.directive(ObMasterLayoutNavigationItemDirective));
		element = debugElement.nativeElement;
		directive = debugElement.injector.get(ObMasterLayoutNavigationItemDirective);
		fixture.detectChanges();
	});

	afterEach(() => {
		mock.menuOpened.mockReset();
		mock.menuClosed.mockReset();
	});

	it('should create', () => {
		expect(directive).toBeDefined();
	});

	it('should have ob-master-layout-navigation-item class', () => {
		expect(element.classList.contains('ob-master-layout-navigation-item')).toBe(true);
	});
	it('should not be expanded', () => {
		expect(directive.isExpanded).toBe(false);
	});

	it('should not have ob-expanded class', () => {
		expect(element.classList.contains('ob-expanded')).toBe(false);
	});

	describe('ngOnInit', () => {
		beforeEach(() => {
			directive.isExpanded = true;
		});

		it('should collapse on mouse click', () => {
			clickSubject.next(new MouseEvent('click'));
			expect(directive.isExpanded).toBe(false);
		});

		it('should collapse on Escape key', () => {
			keyUpSubject.next(new KeyboardEvent('keyup', {key: 'Escape'}));
			expect(directive.isExpanded).toBe(false);
		});

		it('should not collapse on Space key', () => {
			keyUpSubject.next(new KeyboardEvent('keyup', {key: 'Space'}));
			expect(directive.isExpanded).toBe(true);
		});
	});

	describe('toggleSubMenu', () => {
		beforeEach(() => {
			directive.isExpanded = false;
		});

		describe('expand', () => {
			beforeEach(() => {
				directive.isExpanded = false;
				directive.openSubMenu();
			});

			it('should be expanded', () => {
				expect(directive.isExpanded).toBe(true);
			});
		});

		describe('collapse', () => {
			beforeEach(() => {
				directive.toggleSubMenu();
				directive.toggleSubMenu();
			});

			it('should not be expanded', () => {
				expect(directive.isExpanded).toBe(false);
			});
		});
	});

	describe('openSubMenu', () => {
		beforeEach(() => {
			directive.isExpanded = false;
			directive.openSubMenu();
			fixture.detectChanges();
		});

		it('should be expanded', () => {
			expect(directive.isExpanded).toBe(true);
		});

		it('should have ob-expanded class', () => {
			expect(element.classList.contains('ob-expanded')).toBe(true);
		});

		it('should open the menu', () => {
			expect(mock.menuOpened).toHaveBeenCalled();
		});
	});

	describe.each([undefined, true, false])('closeSubMenu with %s', value => {
		beforeEach(() => {
			masterLayoutService.isMenuOpened = true;
			directive.isExpanded = false;
			directive.openSubMenu();
			directive.closeSubMenu(value);
			fixture.detectChanges();
		});

		it('should not be expanded', () => {
			expect(directive.isExpanded).toBe(false);
		});

		it('should not have ob-expanded class', () => {
			expect(element.classList.contains('ob-expanded')).toBe(false);
		});

		it('should close the menu', () => {
			expect(mock.menuClosed).toHaveBeenCalled();
		});

		it('should expand / collapse the hamburger menu', () => {
			expect(masterLayoutService.isMenuOpened).toBe(!(value ?? true));
		});
	});
});
