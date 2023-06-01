import {ComponentFixture, TestBed, fakeAsync, tick, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMasterLayoutNavigationComponent} from '../master-layout-navigation/master-layout-navigation.component';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {WINDOW} from '../../utilities';
import {ObMockMasterLayoutNavigationItemDirective} from '../_mocks/mock-master-layout-navigation-item.directive';
import {ObMasterLayoutNavigationSubMenuItemComponent} from './sub-menu-item/master-layout-navigation-sub-menu-item.component';
import {basicMockLinks, mockLinksWithChildren} from './master-layout-navigation.component.spec-data';
import {ObNavigationLink} from './navigation-link.model';

@Component({template: ''})
class DummyFullPathComponent {}

@Component({template: ''})
class DummyPrefixPathComponent {}

@Component({template: ''})
class DummyDefaultPathComponent {}

describe(ObMasterLayoutNavigationComponent.name, () => {
	let router: Router;
	let component: ObMasterLayoutNavigationComponent;
	let fixture: ComponentFixture<ObMasterLayoutNavigationComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [
				ObMasterLayoutNavigationComponent,
				ObMasterLayoutNavigationSubMenuItemComponent,
				ObMockMasterLayoutNavigationItemDirective,
				ObMockTranslatePipe,
				DummyFullPathComponent,
				DummyPrefixPathComponent,
				DummyDefaultPathComponent
			],
			imports: [
				RouterTestingModule.withRoutes([
					{path: 'defaultPathMatch', component: DummyDefaultPathComponent},
					{path: 'prefix/1/users', component: DummyPrefixPathComponent},
					{path: 'prefix/:id/users', component: DummyPrefixPathComponent},
					{path: 'full/2/users', component: DummyFullPathComponent},
					{path: 'full/:id', component: DummyFullPathComponent},
					{path: '**', redirectTo: 'defaultPathMatch'}
				])
			],
			schemas: [NO_ERRORS_SCHEMA],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService},
				{provide: WINDOW, useValue: window}
			]
		}).compileComponents();
	}));

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

	test.each<{idx: number}>([{idx: 0}, {idx: 1}, {idx: 2}])('that property isExternal of Link is set to false at index: $idx', ({idx}) => {
		fixture.detectChanges();
		expect(component.initializedLinks[idx].isExternal).toBe(false);
	});

	test.each<{route: string; label: string}>([
		{route: 'defaultPathMatch', label: 'default'},
		{route: 'full/2/users', label: 'ItemFull'}
	])(
		'that after routing to: $route, the textContent of the active element contains: $label',
		fakeAsync(({route, label}) => {
			router.navigate([route]);
			tick();
			expect(getElementByQueryAllCSS('.active')[0].nativeElement.textContent).toContain(label);
		})
	);

	test.each<{route: string; length: number}>([
		{route: 'defaultPathMatch', length: 1},
		{route: 'prefix/2/users', length: 1},
		{route: 'prefix/3/users', length: 0},
		{route: 'full/1/users', length: 1},
		{route: 'full/1', length: 0}
	])(
		'that $length element(s) have class active after routing to: $route',
		fakeAsync(({route, length}) => {
			router.navigate([route]);
			tick();
			const prefixLink = getElementByQueryAllCSS('.active');
			expect(prefixLink.length).toBe(length);
		})
	);

	describe('HTMLSelectElement in template pathMatch with navigation elements', () => {
		describe.each<{id: string; label: string}>([
			{id: 'prefix', label: 'ItemPrefix'},
			{id: 'full', label: 'ItemFull'},
			{id: 'default', label: 'default'}
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
			test('that link has active attribute', () => {
				expect(element.getAttribute('ng-reflect-router-link-active')).toBe('active');
			});
		});
	});

	describe.each<{linkIndex: number; childIndex: number}>([
		{linkIndex: 2, childIndex: 0},
		{linkIndex: 2, childIndex: 1},
		{linkIndex: 3, childIndex: 0},
		{linkIndex: 3, childIndex: 1},
		{linkIndex: 3, childIndex: 2}
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
			expect(component.changeCurrentParentLink).toHaveBeenCalledWith(component.initializedLinks[linkIndex].children[childIndex]);
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
				(component as unknown as {isLinkInCurrentParentAncestors: (link: ObNavigationLink) => void}).isLinkInCurrentParentAncestors
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
				(component as unknown as {isLinkInCurrentParentAncestors: (link: ObNavigationLink) => void}).isLinkInCurrentParentAncestors
			).toHaveBeenNthCalledWith(1, component.initializedLinks[linkIndex].children[childIndex]);
		});

		test(`that ${
			(ObMasterLayoutNavigationComponent.prototype as unknown as {addCurrentParentAncestor: {name: string}}).addCurrentParentAncestor.name
		} is not called after clicking go to children button when child is already in currentParentAncestors`, () => {
			(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void}).addCurrentParentAncestor(
				component.initializedLinks[linkIndex].children[childIndex]
			);
			fixture.detectChanges();
			jest.spyOn(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void}, 'addCurrentParentAncestor');
			clickGoToChildrenButton(linkIndex, childIndex);
			expect(
				(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void}).addCurrentParentAncestor
			).not.toHaveBeenCalled();
		});

		test(`that ${
			(ObMasterLayoutNavigationComponent.prototype as unknown as {addCurrentParentAncestor: {name: string}}).addCurrentParentAncestor.name
		} is called with correct link after clicking go to children button when child is not in currentParentAncestors`, () => {
			fixture.detectChanges();
			jest.spyOn(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void}, 'addCurrentParentAncestor');
			clickGoToChildrenButton(linkIndex, childIndex);
			expect(
				(component as unknown as {addCurrentParentAncestor: (link: ObNavigationLink) => void}).addCurrentParentAncestor
			).toHaveBeenNthCalledWith(1, component.initializedLinks[linkIndex].children[childIndex]);
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
		getHTMLSelectElementByQueryCSS(`#${uniquePartOfId}-${component.initializedLinks[linkIndex].children[childIndex].id}`).click();
	}

	function clickGoToChildrenButton(linkIndex: number, childIndex: number): void {
		clickChildButton(linkIndex, childIndex, 'ob-sub-menu-go-to-children-button');
	}

	function expandMainNavItem(linkIndex: number): void {
		getHTMLSelectElementByQueryCSS(`#ob-main-nav-item-${component.initializedLinks[linkIndex].id}`).classList.add('ob-expanded');
	}
});
