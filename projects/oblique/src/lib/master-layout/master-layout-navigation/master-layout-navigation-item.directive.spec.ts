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

describe(ObMasterLayoutNavigationItemDirective.name, () => {
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

	test('that creation works', () => {
		expect(directive).toBeDefined();
	});

	test('that it has ob-master-layout-navigation-item class', () => {
		expect(element.classList.contains('ob-master-layout-navigation-item')).toBe(true);
	});
	test('that it is not expanded', () => {
		expect(directive.isExpanded).toBe(false);
	});

	test('that it does not have ob-expanded class', () => {
		expect(element.classList.contains('ob-expanded')).toBe(false);
	});

	describe('ngOnInit', () => {
		beforeEach(() => {
			directive.ngOnInit();
			directive.isExpanded = true;
		});

		test('that it collapses on mouse click', () => {
			clickSubject.next(new MouseEvent('click'));
			expect(directive.isExpanded).toBe(false);
		});

		test('that it collapses on Escape key', () => {
			keyUpSubject.next(new KeyboardEvent('keyup', {key: 'Escape'}));
			expect(directive.isExpanded).toBe(false);
		});

		test('that it does not collapse on Space key', () => {
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

			test('that it is expanded', () => {
				expect(directive.isExpanded).toBe(true);
			});
		});

		describe('collapse', () => {
			beforeEach(() => {
				directive.toggleSubMenu();
				directive.toggleSubMenu();
			});

			test('that it is not expanded', () => {
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

		test('that it is expanded', () => {
			expect(directive.isExpanded).toBe(true);
		});

		test('that it has ob-expanded class', () => {
			expect(element.classList.contains('ob-expanded')).toBe(true);
		});

		test('that it opens the menu', () => {
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

		test('that it is not expanded', () => {
			expect(directive.isExpanded).toBe(false);
		});

		test('that it does not have ob-expanded class', () => {
			expect(element.classList.contains('ob-expanded')).toBe(false);
		});

		test('that it closes the menu', () => {
			expect(mock.menuClosed).toHaveBeenCalled();
		});

		test('that it expands / collapses the hamburger menu', () => {
			expect(masterLayoutService.isMenuOpened).toBe(!(value ?? true));
		});
	});
});
