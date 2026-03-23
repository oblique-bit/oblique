import {ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Router, RouterModule} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {ObMasterLayoutNavigationComponent} from '../master-layout-navigation/master-layout-navigation.component';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {OB_HAS_LANGUAGE_IN_URL, provideObliqueTestingConfiguration} from '../../utilities';
import {ObMockMasterLayoutNavigationItemDirective} from '../_mocks/mock-master-layout-navigation-item.directive';
import {ObMasterLayoutNavigationSubMenuItemComponent} from './sub-menu-item/master-layout-navigation-sub-menu-item.component';
import {mockLinksWithChildren} from './master-layout-navigation.component.spec-mock-links-with-data';
import {basicMockLinks} from './master-layout-navigation.component.spec-basic-mocks-links';
import {ObNavigationLink} from './navigation-link.model';
import {ObMasterLayoutNavigationGoToChildrenComponent} from './go-to-children/master-layout-navigation-go-to-children.component';
import {ObINavigationLink} from '@oblique/oblique';
import {ObLocalizePipe} from '../../router/ob-localize.pipe';
import {ObEScrollMode} from '../master-layout.model';
import {ObMasterLayoutNavigationService} from './master-layout-navigation.service';
import * as scrollDelta from './scroll-delta';

@Component({
	standalone: false,
	template: '',
})
class DummyFullPathComponent {}

@Component({
	standalone: false,
	template: '',
})
class DummyPrefixPathComponent {}

@Component({
	standalone: false,
	template: '',
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
})
class CustomNavigationHostComponent {}

describe(ObMasterLayoutNavigationComponent.name, () => {
	let router: Router;
	let component: ObMasterLayoutNavigationComponent;
	let fixture: ComponentFixture<ObMasterLayoutNavigationComponent>;

	beforeEach(async () => {
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
				TranslateModule,
				RouterModule.forRoot([
					{path: 'defaultPathMatch', component: DummyDefaultPathComponent},
					{path: 'prefix/1/users', component: DummyPrefixPathComponent},
					{path: 'prefix/:id/users', component: DummyPrefixPathComponent},
					{path: 'full/2/users', component: DummyFullPathComponent},
					{path: 'full/:id', component: DummyFullPathComponent},
					{path: '**', redirectTo: 'defaultPathMatch'},
				]),
				ObLocalizePipe,
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				provideObliqueTestingConfiguration(),
				{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService},
				{provide: OB_HAS_LANGUAGE_IN_URL, useValue: false},
			],
		}).compileComponents();
	});

	describe('hasLanguageInUrl=false', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
			component = fixture.componentInstance;

			component.links = basicMockLinks;
			component.ngOnInit();
			component.ngOnChanges();
			router = TestBed.inject(Router);
			router.initialNavigation();
			fixture.detectChanges();
		});

		test('that creation works', () => {
			expect(component).toBeTruthy();
		});

		test.each([null, undefined])('that "%s" is converted to an empty array', value => {
			component.links = value;
			component.ngOnChanges();
			expect(component.initializedLinks).toEqual([]);
		});

		test.each<{idx: number}>([{idx: 0}, {idx: 1}, {idx: 2}])(
			'that property isExternal of Link is set to false at index: $idx',
			({idx}) => {
				fixture.detectChanges();
				expect(component.initializedLinks[idx].isExternal).toBe(false);
			}
		);

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
			beforeEach(fakeAsync(async () => {
				component.links = mockLinksWithChildren;
				component.ngOnChanges();
				fixture.detectChanges();
				await fixture.whenStable();
				expandMainNavItem(linkIndex);
				component.changeCurrentParentLink(component.initializedLinks[linkIndex]);
				fixture.detectChanges();
			}));

			test(`that ${ObMasterLayoutNavigationComponent.prototype.changeCurrentParentLink.name} is called after clicking go to children button`, () => {
				jest.spyOn(component, 'changeCurrentParentLink');
				clickGoToChildrenButton(linkIndex, childIndex);
				expect(component.changeCurrentParentLink).toHaveBeenCalledWith(
					component.initializedLinks[linkIndex].children[childIndex]
				);
			});

			test(`that ${ObMasterLayoutNavigationComponent.prototype.backUpOrCloseSubMenu.name} is called after clicking go to children button & then back button `, fakeAsync(() => {
				jest.spyOn(component, 'backUpOrCloseSubMenu');
				clickGoToChildrenButton(linkIndex, childIndex);
				clickBackButton(linkIndex);
				expect(component.backUpOrCloseSubMenu).toHaveBeenCalledTimes(1);
			}));

			test(`that ${ObMasterLayoutNavigationComponent.prototype.closeSubMenu.name} is called after clicking go to children button & then close button `, fakeAsync(() => {
				jest.spyOn(component, 'closeSubMenu');
				clickGoToChildrenButton(linkIndex, childIndex);
				clickCloseButton(linkIndex);
				expect(component.closeSubMenu).toHaveBeenCalledTimes(1);
			}));

			test(`that ${
				(ObMasterLayoutNavigationComponent.prototype as unknown as {isLinkInCurrentParentAncestors: {name: string}})
					.isLinkInCurrentParentAncestors.name
			} is called with correct link after clicking go to children button when child is not in currentParentAncestors`, () => {
				fixture.detectChanges();
				jest.spyOn(
					component as unknown as {isLinkInCurrentParentAncestors: (link: ObNavigationLink) => void},
					'isLinkInCurrentParentAncestors'
				);
				clickGoToChildrenButton(linkIndex, childIndex);
				expect(
					(component as unknown as {isLinkInCurrentParentAncestors: (link: ObNavigationLink) => void})
						.isLinkInCurrentParentAncestors
				).toHaveBeenNthCalledWith(1, component.initializedLinks[linkIndex].children[childIndex]);
			});

			test(`that ${
				(ObMasterLayoutNavigationComponent.prototype as unknown as {isLinkInCurrentParentAncestors: {name: string}})
					.isLinkInCurrentParentAncestors.name
			} is called with correct link after clicking go to children button when child is already in currentParentAncestors`, () => {
				(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void}).addCurrentParentAncestor(
					component.initializedLinks[linkIndex].children[childIndex]
				);
				fixture.detectChanges();
				jest.spyOn(
					component as unknown as {isLinkInCurrentParentAncestors: (link: ObNavigationLink) => void},
					'isLinkInCurrentParentAncestors'
				);
				clickGoToChildrenButton(linkIndex, childIndex);
				expect(
					(component as unknown as {isLinkInCurrentParentAncestors: (link: ObNavigationLink) => void})
						.isLinkInCurrentParentAncestors
				).toHaveBeenNthCalledWith(1, component.initializedLinks[linkIndex].children[childIndex]);
			});

			test(`that ${
				(ObMasterLayoutNavigationComponent.prototype as unknown as {addCurrentParentAncestor: {name: string}})
					.addCurrentParentAncestor.name
			} is not called after clicking go to children button when child is already in currentParentAncestors`, () => {
				(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void}).addCurrentParentAncestor(
					component.initializedLinks[linkIndex].children[childIndex]
				);
				fixture.detectChanges();
				jest.spyOn(
					component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void},
					'addCurrentParentAncestor'
				);
				clickGoToChildrenButton(linkIndex, childIndex);
				expect(
					(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void})
						.addCurrentParentAncestor
				).not.toHaveBeenCalled();
			});

			test(`that ${
				(ObMasterLayoutNavigationComponent.prototype as unknown as {addCurrentParentAncestor: {name: string}})
					.addCurrentParentAncestor.name
			} is called with correct link after clicking go to children button when child is not in currentParentAncestors`, () => {
				fixture.detectChanges();
				jest.spyOn(
					component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void},
					'addCurrentParentAncestor'
				);
				clickGoToChildrenButton(linkIndex, childIndex);
				expect(
					(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void})
						.addCurrentParentAncestor
				).toHaveBeenNthCalledWith(1, component.initializedLinks[linkIndex].children[childIndex]);
			});
		});

		describe('removeItem', () => {
			const mockMouseEvent = {preventDefault: jest.fn()} as any as MouseEvent;
			let emittedValue: ObINavigationLink[];
			beforeEach(done => {
				component.linksChanged.subscribe(list => {
					emittedValue = list;
					done();
				});
				component.removeMenuItem(component.initializedLinks[0], mockMouseEvent);
			});

			test('first item is removed from initialized links', () => {
				expect(component.initializedLinks.length).toBe(3);
			});

			test('first item is removed from links', () => {
				expect(component.links.length).toBe(3);
			});

			test('preventDefault has been called', () => {
				expect(mockMouseEvent.preventDefault).toHaveBeenCalled();
			});

			test('linksChanged emits the updated links', () => {
				expect(emittedValue).toEqual(component.links);
			});
		});

		describe('scrolling', () => {
			test('click on right scroll button', () => {
				component.isScrollable = true;
				component.maxScroll = 100;
				fixture.detectChanges();

				jest.useFakeTimers();
				fixture.debugElement.query(By.css('#ob-navigation-scrollable-control-right')).nativeElement.click();
				jest.runAllTimers();
				fixture.detectChanges();
				expect(component.currentScroll).toBe(95);
				jest.useRealTimers();
			});

			test('click on left scroll button', () => {
				component.isScrollable = true;
				component.currentScroll = 15;
				component.maxScroll = 100;
				fixture.detectChanges();

				jest.useFakeTimers();
				fixture.debugElement.query(By.css('#ob-navigation-scrollable-control-left')).nativeElement.click();
				jest.runAllTimers();
				fixture.detectChanges();
				expect(component.currentScroll).toBe(0);
				jest.useRealTimers();
			});

			test('focusing an element scrolls it into view', () => {
				component.isScrollable = true;
				component.maxScroll = 100;
				fixture.detectChanges();
				jest.spyOn(scrollDelta, 'getScrollIntoViewDelta').mockReturnValue(42);
				component.toggleFocus('ob-main-nav-item-', 'full', true);
				expect(component.currentScroll).toBe(42);
			});
		});
	});

	describe('hasLanguageInUrl=true', () => {
		beforeEach(() => {
			TestBed.overrideProvider(OB_HAS_LANGUAGE_IN_URL, {useValue: true});
			fixture = TestBed.createComponent(ObMasterLayoutNavigationComponent);
			component = fixture.componentInstance;

			component.links = basicMockLinks;
			component.ngOnInit();
			component.ngOnChanges();
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
	});

	describe('with projected custom navigation', () => {
		test('refresh computes scrollability for projected navigation when links are empty', () => {
			jest.useFakeTimers();
			const hostFixture = TestBed.createComponent(CustomNavigationHostComponent);
			hostFixture.detectChanges();
			const hostDebugElement = hostFixture.debugElement.query(By.directive(ObMasterLayoutNavigationComponent));
			const projectedNavigation = hostFixture.nativeElement.querySelector('.ob-main-nav') as HTMLElement;
			const projectedNavigationChildren = projectedNavigation.children as HTMLCollectionOf<HTMLElement>;
			const projectedNavigationComponent = hostDebugElement.componentInstance as ObMasterLayoutNavigationComponent;
			const navigationService = TestBed.inject(ObMasterLayoutNavigationService);

			Object.defineProperty(projectedNavigation, 'clientWidth', {value: 120});
			Object.defineProperty(projectedNavigationChildren[0], 'clientWidth', {value: 110});
			Object.defineProperty(projectedNavigationChildren[1], 'clientWidth', {value: 110});
			jest.spyOn(navigationService, 'scrollMode', 'get').mockReturnValue(ObEScrollMode.AUTO);

			navigationService.refresh();
			jest.advanceTimersToNextFrame();

			expect(projectedNavigationComponent.isScrollable).toBe(true);
			expect(projectedNavigationComponent.maxScroll).toBeGreaterThan(0);
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
		getHTMLSelectElementByQueryCSS(`#${uniquePartOfId}-${component.initializedLinks[linkIndex].id}`).click();
	}

	function clickChildButton(linkIndex: number, childIndex: number, uniquePartOfId: string): void {
		getHTMLSelectElementByQueryCSS(
			`#${uniquePartOfId}-${component.initializedLinks[linkIndex].children[childIndex].id}`
		).click();
	}

	function clickGoToChildrenButton(linkIndex: number, childIndex: number): void {
		clickChildButton(linkIndex, childIndex, 'ob-master-layout-navigation-go-to-children-button');
	}

	function expandMainNavItem(linkIndex: number): void {
		getHTMLSelectElementByQueryCSS(`#ob-main-nav-item-${component.initializedLinks[linkIndex].id}`).classList.add(
			'ob-expanded'
		);
	}
});
