import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ChangeDetectionStrategy, Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Router, RouterModule} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {ObMasterLayoutNavigationComponent} from '../master-layout-navigation/master-layout-navigation.component';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {provideObliqueTestingConfiguration} from '../../utilities';
import {ObMockMasterLayoutNavigationItemDirective} from '../_mocks/mock-master-layout-navigation-item.directive';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';
import {ObMasterLayoutNavigationSubMenuItemComponent} from './sub-menu-item/master-layout-navigation-sub-menu-item.component';
import {mockLinksWithChildren} from './master-layout-navigation.component.spec-mock-links-with-data';
import {basicMockLinks} from './master-layout-navigation.component.spec-basic-mocks-links';
import {ObNavigationLink} from './navigation-link.model';
import {ObMasterLayoutNavigationGoToChildrenComponent} from './go-to-children/master-layout-navigation-go-to-children.component';
import {
	OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION,
	ObEMasterLayoutEventValues,
	ObEScrollMode,
	ObIMasterLayoutEvent,
	ObINavigationLink,
} from '../master-layout.model';
import {ObLocalizePipe} from '../../router/ob-localize.pipe';
import {ObMasterLayoutNavigationService} from './master-layout-navigation.service';
import * as scrollDelta from './scroll-delta';
import {ObMasterLayoutService} from '../master-layout.service';
import {OB_HAS_LANGUAGE_IN_URL} from '../../language/language.provider';

@Component({
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
})
class DummyFullPathComponent {}

@Component({
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
})
class DummyPrefixPathComponent {}

@Component({
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
})
class DummyDefaultPathComponent {}

@Component({
	standalone: false,
	template: `
		<ob-master-layout-navigation [links]="[]">
			<ul class="ob-main-nav">
				<li id="custom-main-nav-item-1"></li>
				<li id="custom-main-nav-item-2"></li>
			</ul>
		</ob-master-layout-navigation>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class CustomNavigationHostComponent {}

describe(ObMasterLayoutNavigationComponent.name, () => {
	let router: Router;
	let component: ObMasterLayoutNavigationComponent;
	let fixture: ComponentFixture<ObMasterLayoutNavigationComponent>;
	let keyUp$: Subject<KeyboardEvent>;
	let keyDown$: Subject<KeyboardEvent>;
	let resize$: Subject<UIEvent>;

	beforeEach(async () => {
		keyUp$ = new Subject<KeyboardEvent>();
		keyDown$ = new Subject<KeyboardEvent>();
		resize$ = new Subject<UIEvent>();
		await TestBed.configureTestingModule({
			declarations: [
				ObMasterLayoutNavigationComponent,
				ObMasterLayoutNavigationSubMenuItemComponent,
				ObMockMasterLayoutNavigationItemDirective,
				DummyFullPathComponent,
				DummyPrefixPathComponent,
				DummyDefaultPathComponent,
				CustomNavigationHostComponent,
			],
			imports: [
				ObMasterLayoutNavigationGoToChildrenComponent,
				TranslatePipe,
				RouterModule.forRoot([
					{path: 'defaultPathMatch', component: DummyDefaultPathComponent},
					{path: 'prefix/1/users', component: DummyPrefixPathComponent},
					{path: 'prefix/:id/users', component: DummyPrefixPathComponent},
					{path: 'full/2/users', component: DummyFullPathComponent},
					{path: 'full/:id', component: DummyFullPathComponent},
					{path: ':language/full/2/users', component: DummyFullPathComponent},
					{path: '**', redirectTo: 'defaultPathMatch'},
				]),
				ObLocalizePipe,
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				provideObliqueTestingConfiguration(),
				{provide: ObGlobalEventsService, useValue: {keyUp$, keyDown$, resize$}},
				{provide: OB_HAS_LANGUAGE_IN_URL, useValue: false},
			],
		}).compileComponents();
	});

	describe('hasLanguageInUrl=false', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
			component = fixture.componentInstance;

			fixture.componentRef.setInput('links', basicMockLinks);
			component.ngOnInit();
			router = TestBed.inject(Router);
			router.initialNavigation();
			fixture.detectChanges();
		});

		test('that creation works', () => {
			expect(component).toBeTruthy();
		});

		test.each([null, undefined])('that "%s" is converted to an empty array', value => {
			fixture.componentRef.setInput('links', value);
			expect(component.navigationLinks()).toEqual([]);
		});

		test.each<{idx: number}>([{idx: 0}, {idx: 1}, {idx: 2}])(
			'that property isExternal of Link is set to false at index: $idx',
			({idx}) => {
				fixture.detectChanges();
				expect(component.navigationLinks()[idx].isExternal).toBe(false);
			}
		);

		it('should close the navigation menu on escape', () => {
			const masterLayout = TestBed.inject(ObMasterLayoutService);
			masterLayout.layout.isMenuOpened = true;

			keyUp$.next(new KeyboardEvent('keyup', {key: 'Escape'}));

			expect(masterLayout.layout.isMenuOpened).toBe(false);
		});

		test.each<{route: string; label: string}>([
			{route: 'defaultPathMatch', label: 'default'},
			{route: 'full/2/users', label: 'ItemFull'},
		])(
			'that after routing to: $route, the textContent of the active element contains: $label',
			async ({route, label}) => {
				await router.navigate([route]);
				expect(getElementByQueryAllCSS('.active')[0].nativeElement.textContent).toContain(label);
			}
		);

		test.each<{route: string; length: number}>([
			{route: 'defaultPathMatch', length: 1},
			{route: 'prefix/2/users', length: 1},
			{route: 'prefix/3/users', length: 0},
			{route: 'full/1/users', length: 1},
			{route: 'full/1', length: 0},
		])('that $length element(s) have class active after routing to: $route', async ({route, length}) => {
			await router.navigate([route]);
			const prefixLink = getElementByQueryAllCSS('.active');
			expect(prefixLink.length).toBe(length);
		});

		it('marks the currently active main navigation link as active', async () => {
			fixture.componentRef.setInput('links', mockLinksWithChildren);
			fixture.detectChanges();

			await router.navigate(['full/2/users']);
			fixture.detectChanges();

			expect(component.activeLinks().has(component.navigationLinks()[3])).toBe(true);
			expect(getHTMLSelectElementByQueryCSS('#full').classList).toContain('active');
		});

		describe('HTMLAnchorElement in template pathMatch with navigation elements', () => {
			describe.each<{id: string; label: string}>([
				{id: 'prefix', label: 'ItemPrefix'},
				{id: 'full', label: 'ItemFull'},
				{id: 'default', label: 'default'},
			])('with $id pathMatch strategy', ({id, label}) => {
				let element: HTMLElement;
				beforeAll(() => {
					element = getHTMLSelectElementByQueryCSS(`#${id}`);
				});
				test('that there is a link with id: $id', () => {
					expect(element).toBeTruthy();
				});
				test('that link text contains $label', () => {
					expect(element.textContent).toContain(label);
				});
			});
		});

		describe.each<{linkIndex: number; childIndex: number}>([
			{linkIndex: 2, childIndex: 0},
			{linkIndex: 2, childIndex: 1},
			{linkIndex: 3, childIndex: 0},
			{linkIndex: 3, childIndex: 1},
			{linkIndex: 3, childIndex: 2},
		])('with children link index: $linkIndex & child index: $childIndex', ({linkIndex, childIndex}) => {
			beforeEach(async () => {
				fixture.componentRef.setInput('links', mockLinksWithChildren);
				fixture.componentRef.changeDetectorRef.detectChanges();
				await fixture.whenStable();
				expandMainNavItem(linkIndex);
				component.changeCurrentParentLink(component.navigationLinks()[linkIndex]);
				fixture.componentRef.changeDetectorRef.detectChanges();
			});

			test(`that ${ObMasterLayoutNavigationComponent.prototype.changeCurrentParentLink.name} is called after clicking go to children button`, () => {
				jest.spyOn(component, 'changeCurrentParentLink');
				clickGoToChildrenButton(linkIndex, childIndex);
				expect(component.changeCurrentParentLink).toHaveBeenCalledWith(
					component.navigationLinks()[linkIndex].children![childIndex]
				);
			});

			test(`that ${ObMasterLayoutNavigationComponent.prototype.backUpOrCloseSubMenu.name} is called after clicking go to children button & then back button `, () => {
				jest.spyOn(component, 'backUpOrCloseSubMenu');
				clickGoToChildrenButton(linkIndex, childIndex);
				clickBackButton(linkIndex);
				expect(component.backUpOrCloseSubMenu).toHaveBeenCalledTimes(1);
			});

			test(`that ${ObMasterLayoutNavigationComponent.prototype.closeSubMenu.name} is called after clicking go to children button & then close button `, () => {
				jest.spyOn(component, 'closeSubMenu');
				clickGoToChildrenButton(linkIndex, childIndex);
				clickCloseButton(linkIndex);
				expect(component.closeSubMenu).toHaveBeenCalledTimes(1);
			});

			test('that clicking go to children updates the current menu state', () => {
				clickGoToChildrenButton(linkIndex, childIndex);

				expect(component.currentParentLink()).toBe(component.navigationLinks()[linkIndex].children[childIndex]);
			});

			test('that selecting an existing ancestor returns to that menu level', () => {
				const parentLink = component.navigationLinks()[linkIndex];
				const childLink = parentLink.children![childIndex];

				component.changeCurrentParentLink(childLink);
				component.changeCurrentParentLink(parentLink);

				expect(component.currentParentLink()).toBe(parentLink);
				expect(component.currentParentRouterLinkBase()).toBe('');
			});
		});

		describe('removeItem (legacy)', () => {
			const mockMouseEvent = new MouseEvent('click');
			let emittedValue: ObINavigationLink[];
			beforeEach(done => {
				jest.spyOn(mockMouseEvent, 'preventDefault');
				component.linksChanged.subscribe(list => {
					emittedValue = list;
					done();
				});
				component.removeMenuItem(component.navigationLinks()[0], mockMouseEvent);
			});

			test('first item is removed from initialized links', () => {
				expect(component.navigationLinks().length).toBe(3);
			});

			test('first item is removed from links', () => {
				expect(component.links().length).toBe(3);
			});

			test('preventDefault has been called', () => {
				expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
			});

			test('linksChanged emits the updated links', () => {
				expect(emittedValue).toEqual(component.links());
			});

			test('removing an item from null links emits an empty list', () => {
				fixture.componentRef.setInput('links', null);
				const mouseEvent = new MouseEvent('click');

				component.removeMenuItem(new ObNavigationLink({id: 'missing', label: ''}), mouseEvent);

				expect(component.links()).toEqual([]);
			});
		});

		describe('removeItem', () => {
			const mockMouseEvent = new MouseEvent('click');
			let emittedValue: ObINavigationLink[];
			beforeEach(done => {
				jest.spyOn(mockMouseEvent, 'preventDefault');
				component.links.subscribe(list => {
					emittedValue = list;
					done();
				});
				component.removeMenuItem(component.navigationLinks()[0], mockMouseEvent);
			});

			test('first item is removed from initialized links', () => {
				expect(component.navigationLinks().length).toBe(3);
			});

			test('first item is removed from links', () => {
				expect(component.links().length).toBe(3);
			});

			test('preventDefault has been called', () => {
				expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
			});

			test('linksChange emits the updated links', () => {
				expect(emittedValue).toEqual(component.links());
			});

			test('removing an item from null links emits an empty list', () => {
				fixture.componentRef.setInput('links', null);
				const mouseEvent = new MouseEvent('click');

				component.removeMenuItem(new ObNavigationLink({id: 'missing', label: ''}), mouseEvent);

				expect(component.links()).toEqual([]);
			});
		});

		describe('sub menu state', () => {
			let itemDirective: ObMasterLayoutNavigationItemDirective;
			let parent: ObNavigationLink;
			let child: ObNavigationLink;

			beforeEach(() => {
				fixture.componentRef.setInput('links', mockLinksWithChildren);
				fixture.componentRef.changeDetectorRef.detectChanges();
				parent = component.navigationLinks()[2];
				child = parent.children![0];
				itemDirective = {
					closeSubMenu: () => {},
					toggleSubMenu: () => {},
				} as unknown as ObMasterLayoutNavigationItemDirective;
			});

			it('should close the current parent menu', () => {
				jest.spyOn(component, 'closeSubMenu');
				component.changeCurrentParentLink(parent);

				component.backUpOrCloseSubMenu(parent, itemDirective);

				expect(component.closeSubMenu).toHaveBeenCalledWith(itemDirective, parent);
			});

			it('should back up to the grandparent menu', () => {
				component.changeCurrentParentLink(parent);
				component.changeCurrentParentLink(child);

				component.backUpOrCloseSubMenu(parent, itemDirective);

				expect(component.currentParentLink()).toBe(parent);
			});

			it('should reset the current parent when backing up from the root menu', () => {
				component.changeCurrentParentLink(parent);

				component.backUpOrCloseSubMenu(child, itemDirective);

				expect(component.currentParentLink().id).toBe('');
				expect(component.currentParentRouterLinkBase()).toBe('');
			});

			it('should build the current parent router link base', () => {
				component.changeCurrentParentLink(parent);
				component.changeCurrentParentLink(child);

				expect(component.currentParentRouterLinkBase()).toBe('/prefix/2/users');
			});

			it('should throw when backing up without a current parent ancestor', () => {
				expect(() => component.backUpOrCloseSubMenu(parent, itemDirective)).toThrow(
					`parentIndex is: -1 in ${ObMasterLayoutNavigationComponent.name}.backUpSubMenu`
				);
			});

			it('should reset ancestor properties when a sub menu is collapsed', () => {
				component.changeCurrentParentLink(parent);
				itemDirective.isExpanded = false;

				component.toggleSubMenu(itemDirective, parent);

				expect(component.currentParentLink().id).toBe('');
			});

			it('should change the current parent when a sub menu is expanded', () => {
				itemDirective.isExpanded = true;

				component.toggleSubMenu(itemDirective, parent);

				expect(component.currentParentLink()).toBe(parent);
			});

			it('should toggle a sub menu', () => {
				itemDirective.isExpanded = true;
				jest.spyOn(itemDirective, 'toggleSubMenu');

				component.toggleSubMenu(itemDirective, parent);

				expect(itemDirective.toggleSubMenu).toHaveBeenCalled();
				expect(component.currentParentLink()).toBe(parent);
			});
		});

		describe('scrolling', () => {
			test('click on right scroll button', () => {
				jest.useFakeTimers();
				makeNavigationScrollable();
				getHTMLSelectElementByQueryCSS('#ob-navigation-scrollable-control-right').click();
				jest.runAllTimers();
				expect(getFirstNavigationItemMarginLeft()).toBe('-95px');
				jest.useRealTimers();
			});

			test('click on left scroll button', () => {
				jest.useFakeTimers();
				makeNavigationScrollable();
				TestBed.inject(ObMasterLayoutNavigationService).scrollRight(15);
				jest.advanceTimersToNextFrame();
				const leftControl = getHTMLSelectElementByQueryCSS('#ob-navigation-scrollable-control-left');
				leftControl.click();
				jest.runAllTimers();
				fixture.detectChanges();
				expect(getFirstNavigationItemMarginLeft()).toBe('0px');
				jest.useRealTimers();
			});

			test('focusing an element scrolls it into view', () => {
				jest.useFakeTimers();
				makeNavigationScrollable();
				jest.spyOn(scrollDelta, 'getScrollIntoViewDelta').mockReturnValue(42);
				component.focusIn('ob-main-nav-item-', 'full');
				expect(getFirstNavigationItemMarginLeft()).toBe('-42px');
				jest.useRealTimers();
			});

			test('focus handling tolerates a missing navigation container', () => {
				// adding the sub nav class hides the main navigation from getNav()
				getHTMLSelectElementByQueryCSS('#navigation').classList.add('ob-sub-nav');

				expect(() => component.focusIn('ob-main-nav-item-', 'full')).not.toThrow();
			});

			test('focusing a keyboard-focused element marks the navigation item', () => {
				const focusedElement = getHTMLSelectElementByQueryCSS('#full');
				focusedElement.classList.add('cdk-keyboard-focused');

				component.focusIn('ob-main-nav-item-', 'full');

				expect(getHTMLSelectElementByQueryCSS('#ob-main-nav-item-full').classList).toContain(
					'ob-has-keyboard-focused-child'
				);
			});

			test("focusing out of an element doesn't scroll it", () => {
				jest.useFakeTimers();
				makeNavigationScrollable();
				jest.spyOn(scrollDelta, 'getScrollIntoViewDelta').mockReturnValue(42);
				component.focusOut('ob-main-nav-item-', 'full');
				expect(getFirstNavigationItemMarginLeft()).toBe('0px');
				jest.useRealTimers();
			});

			test('ignores focus changes for missing navigation elements', () => {
				expect(() => component.focusIn('ob-main-nav-item-', 'missing')).not.toThrow();
			});

			test('isFullWidth follows the navigation service', () => {
				const navigationService = TestBed.inject(ObMasterLayoutNavigationService);

				navigationService.isFullWidth = true;

				expect(component.isFullWidth()).toBe(true);
			});

			test('scrollMode changes refresh the navigation', () => {
				const navigationService = TestBed.inject(ObMasterLayoutNavigationService);
				jest.spyOn(navigationService, 'refresh');

				navigationService.scrollMode = ObEScrollMode.ENABLED;

				expect(navigationService.refresh).toHaveBeenCalled();
			});

			test('shift-tab from the right control focuses the last navigation item without scrolling', () => {
				jest.useFakeTimers();
				makeNavigationScrollable();
				const event = new KeyboardEvent('keydown', {code: 'Tab', shiftKey: true});
				const rightControl = getHTMLSelectElementByQueryCSS('#ob-navigation-scrollable-control-right');
				const lastNavigationLink = getHTMLSelectElementByQueryCSS('#navigation').lastElementChild
					.firstElementChild as HTMLElement;
				Object.defineProperty(event, 'target', {value: rightControl});
				jest.spyOn(event, 'preventDefault');
				jest.spyOn(lastNavigationLink, 'focus');

				keyDown$.next(event);

				expect(event.preventDefault).toHaveBeenCalled();
				expect(lastNavigationLink.focus).toHaveBeenCalledWith({preventScroll: true});
				jest.useRealTimers();
			});

			test('shift-tab from the right control tolerates an empty navigation', () => {
				const emptyFixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
				emptyFixture.detectChanges();
				const event = new KeyboardEvent('keydown', {code: 'Tab', shiftKey: true});
				Object.defineProperty(event, 'target', {value: {id: 'ob-navigation-scrollable-control-right'}});
				jest.spyOn(event, 'preventDefault');

				keyDown$.next(event);

				expect(event.preventDefault).toHaveBeenCalled();
			});

			test('refresh should reset the current scroll when scrolling is disabled', () => {
				jest.useFakeTimers();
				const navigationService = TestBed.inject(ObMasterLayoutNavigationService);
				makeNavigationScrollable();
				navigationService.scrollRight(42);
				jest.advanceTimersToNextFrame();
				expect(getFirstNavigationItemMarginLeft()).toBe('-42px');

				navigationService.scrollMode = ObEScrollMode.DISABLED;
				navigationService.refresh();
				jest.advanceTimersToNextFrame();
				fixture.detectChanges();

				// #ob-navigation-scrollable-control-left is null if isScrollable() is false
				expect(fixture.debugElement.query(By.css('#ob-navigation-scrollable-control-left'))).toBeNull();
				expect(getFirstNavigationItemMarginLeft()).toBe('0px');
				jest.useRealTimers();
			});

			test('refresh should force scrollability when scrolling is enabled', () => {
				jest.useFakeTimers();
				const navigationService = TestBed.inject(ObMasterLayoutNavigationService);
				navigationService.scrollMode = ObEScrollMode.ENABLED;
				navigationService.refresh();
				jest.advanceTimersToNextFrame();
				fixture.detectChanges();

				// #ob-navigation-scrollable-control-left is not null if isScrollable() is true
				expect(fixture.debugElement.query(By.css('#ob-navigation-scrollable-control-right'))).toBeTruthy();
				jest.useRealTimers();
			});

			test('scroll updates tolerate an empty navigation fixture', () => {
				jest.useFakeTimers();
				const emptyFixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
				emptyFixture.detectChanges();
				const navigationService = TestBed.inject(ObMasterLayoutNavigationService);

				expect(() => {
					navigationService.scrollRight(42);
					jest.runAllTimers();
				}).not.toThrow();
				jest.useRealTimers();
			});
		});
	});

	describe('hasLanguageInUrl=true', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_HAS_LANGUAGE_IN_URL, {useValue: true});
			fixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
			component = fixture.componentInstance;

			fixture.componentRef.setInput('links', basicMockLinks);
			component.ngOnInit();
			router = TestBed.inject(Router);
			router.initialNavigation();
			fixture.detectChanges();
		});

		test.each<{route: string; label: string}>([{route: 'defaultPathMatch', label: 'default'}])(
			'that after routing to: $route, the textContent of the active element contains: $label',
			async ({route, label}) => {
				await router.navigate([route]);
				expect(getElementByQueryAllCSS('.active')[0].nativeElement.textContent).toContain(label);
			}
		);

		it('marks the currently active main navigation link as active', async () => {
			fixture.componentRef.setInput('links', mockLinksWithChildren);
			fixture.detectChanges();

			await router.navigate(['de', 'full', '2', 'users']);
			fixture.detectChanges();

			expect(component.activeLinks().has(component.navigationLinks()[3])).toBe(true);
			expect(getHTMLSelectElementByQueryCSS('#full').classList).toContain('active');
		});
	});

	describe('hideExternalLinks=false', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION, {useValue: false});
			fixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
			component = fixture.componentInstance;
		});

		test('that external links are not hidden', () => {
			expect(component.hideExternalLinks).toBe(false);
		});
	});

	describe('full-width events', () => {
		let configEvents$: Subject<ObIMasterLayoutEvent>;

		beforeEach(() => {
			configEvents$ = new Subject<ObIMasterLayoutEvent>();
			TestBed.overrideProvider(ObMasterLayoutNavigationService, {
				useValue: {
					isFullWidth: false,
					refreshed: new Subject<void>(),
					scrolled: new Subject<number>(),
					configEvents$,
					refresh: () => {},
					scrollLeft: () => {},
					scrollRight: () => {},
				},
			});
			fixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		});

		test('ignores full-width events without a value', () => {
			const initialValue = component.isFullWidth();

			configEvents$.next({name: ObEMasterLayoutEventValues.NAVIGATION_IS_FULL_WIDTH});

			expect(component.isFullWidth()).toBe(initialValue);
		});
	});

	describe('with projected custom navigation', () => {
		test('refresh ignores missing navigation content', () => {
			jest.useFakeTimers();
			const emptyFixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
			emptyFixture.detectChanges();
			const navigationService = TestBed.inject(ObMasterLayoutNavigationService);

			expect(() => {
				navigationService.refresh();
				jest.advanceTimersToNextFrame();
			}).not.toThrow();
			jest.useRealTimers();
		});

		test('refresh computes scrollability for projected navigation when links are empty', () => {
			jest.useFakeTimers();
			const hostFixture = TestBed.createComponent(CustomNavigationHostComponent);
			hostFixture.detectChanges();
			const projectedNavigation = hostFixture.nativeElement.querySelector('.ob-main-nav') as HTMLElement;
			const projectedNavigationChildren = projectedNavigation.children as HTMLCollectionOf<HTMLElement>;
			const navigationService = TestBed.inject(ObMasterLayoutNavigationService);

			Object.defineProperty(projectedNavigation, 'clientWidth', {value: 120});
			Object.defineProperty(projectedNavigationChildren[0], 'clientWidth', {value: 110});
			Object.defineProperty(projectedNavigationChildren[1], 'clientWidth', {value: 110});
			jest.spyOn(navigationService, 'scrollMode', 'get').mockReturnValue(ObEScrollMode.AUTO);

			navigationService.refresh();
			jest.advanceTimersToNextFrame();

			// #ob-navigation-scrollable-control-right is disabled if isScrollable it true
			expect(hostFixture.nativeElement.querySelector('#ob-navigation-scrollable-control-right').disabled).toBe(false);
			jest.useRealTimers();
		});
	});

	function getElementByQueryAllCSS(selector: string): DebugElement[] {
		return fixture.debugElement.queryAll(By.css(selector));
	}

	function getHTMLSelectElementByQueryCSS(selector: string): HTMLElement {
		return fixture.debugElement.query(By.css(selector)).nativeElement;
	}

	function clickBackButton(linkIndex: number): void {
		clickLinkButton(linkIndex, 'ob-sub-menu-back-button');
	}

	function clickCloseButton(linkIndex: number): void {
		clickLinkButton(linkIndex, 'ob-sub-menu-close-button');
	}

	function clickLinkButton(linkIndex: number, uniquePartOfId: string): void {
		getHTMLSelectElementByQueryCSS(`#${uniquePartOfId}-${component.navigationLinks()[linkIndex].id}`).click();
	}

	function clickChildButton(linkIndex: number, childIndex: number, uniquePartOfId: string): void {
		getHTMLSelectElementByQueryCSS(
			`#${uniquePartOfId}-${component.navigationLinks()[linkIndex].children[childIndex].id}`
		).click();
	}

	function clickGoToChildrenButton(linkIndex: number, childIndex: number): void {
		clickChildButton(linkIndex, childIndex, 'ob-master-layout-navigation-go-to-children-button');
	}

	function expandMainNavItem(linkIndex: number): void {
		getHTMLSelectElementByQueryCSS(`#ob-main-nav-item-${component.navigationLinks()[linkIndex].id}`).classList.add(
			'ob-expanded'
		);
	}

	function makeNavigationScrollable(): void {
		// tests suppose a maxScroll of 100, since it's a private property, it can only be set indirectly.
		// maxScroll is computed as -(nav.clientWidth - childWidth - 2 * MasterLayoutNavigationComponentBase.buttonWidth)
		// with MasterLayoutNavigationComponentBase.buttonWidth being 40
		// Since there are 4 children is basicMockLinks, we get 4 * childClientWidth - clientWidth = 20
		// arbitrarily setting childClientWidth to 50 gives a clientWidth to 180
		const navigationService = TestBed.inject(ObMasterLayoutNavigationService);
		const navigation = getHTMLSelectElementByQueryCSS('#navigation');
		Object.defineProperty(navigation, 'clientWidth', {value: 180});
		Array.from(navigation.children).forEach(item => Object.defineProperty(item, 'clientWidth', {value: 50}));
		navigationService.scrollMode = ObEScrollMode.ENABLED;
		navigationService.refresh();
		jest.advanceTimersToNextFrame();
		fixture.detectChanges();
	}

	function getFirstNavigationItemMarginLeft(): string {
		return fixture.debugElement.query(By.css('#navigation > li')).nativeElement.style.marginLeft;
	}
});
