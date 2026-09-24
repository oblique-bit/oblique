import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {ActivatedRoute, RouterLinkActive, RouterModule} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
import {ObNavTreeItemModel} from './nav-tree-item.model';
import {ObNavTreeComponent, defaultPatternMatcherFactory} from './nav-tree.component';
import {provideObliqueTestingConfiguration} from '../utilities';

@Component({
	standalone: false,
	template: ` <ob-nav-tree
		[items]="items"
		[prefix]="prefix"
		[hasFilter]="hasFilter"
		[filterPattern]="filterPattern"
		[labelFormatter]="labelFormatter"
		[patternMatcher]="patternMatcher"
	/>`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class TestComponent {
	items = [
		new ObNavTreeItemModel({id: 'A', label: 'A - Label', fragment: 'fragment', queryParams: {foo: 'bar'}}),
		new ObNavTreeItemModel({
			id: 'B',
			label: 'B - Label',
			items: [
				new ObNavTreeItemModel({id: 'B-1', label: 'B.1 - Label'}),
				new ObNavTreeItemModel({
					id: 'B-2',
					label: 'B.2 - Label',
					items: [
						new ObNavTreeItemModel({id: 'B2-1', label: 'B.2.1 - Label'}),
						new ObNavTreeItemModel({id: 'B2-2', label: 'B.2.2 - Label'}),
						new ObNavTreeItemModel({id: 'B2-3', label: 'B.2.3 - Label'}),
					],
				}),
				new ObNavTreeItemModel({id: 'B-3', label: 'B.3 - Label'}),
			],
		}),
		new ObNavTreeItemModel({
			id: 'C',
			label: 'C - Label',
			items: [
				new ObNavTreeItemModel({id: 'C-1', label: 'C.1 - Label'}),
				new ObNavTreeItemModel({id: 'C-2', label: 'C.2 - Label'}),
				new ObNavTreeItemModel({id: 'C-3', label: 'C.3 - Label'}),
			],
		}),
	];

	prefix = 'nav-tree-test';
	hasFilter = true;
	filterPattern: string;

	labelFormatter: (item: ObNavTreeItemModel, filterPattern?: string) => string;
	patternMatcher: (item: ObNavTreeItemModel, pattern?: string) => boolean;
}

@Component({
	standalone: false,
	template: ` <ob-nav-tree [items]="items" />`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class TestComponentDefault {
	items = [
		new ObNavTreeItemModel({id: 'A', label: 'A - Label', fragment: 'fragment', queryParams: {foo: 'bar'}}),
		new ObNavTreeItemModel({
			id: 'B',
			label: 'B - Label',
			items: [
				new ObNavTreeItemModel({id: 'B-1', label: 'B.1 - Label'}),
				new ObNavTreeItemModel({
					id: 'B-2',
					label: 'B.2 - Label',
					items: [
						new ObNavTreeItemModel({id: 'B2-1', label: 'B.2.1 - Label'}),
						new ObNavTreeItemModel({id: 'B2-2', label: 'B.2.2 - Label'}),
						new ObNavTreeItemModel({id: 'B2-3', label: 'B.2.3 - Label'}),
					],
				}),
				new ObNavTreeItemModel({id: 'B-3', label: 'B.3 - Label'}),
			],
		}),
		new ObNavTreeItemModel({
			id: 'C',
			label: 'C - Label',
			items: [
				new ObNavTreeItemModel({id: 'C-1', label: 'C.1 - Label'}),
				new ObNavTreeItemModel({id: 'C-2', label: 'C.2 - Label'}),
				new ObNavTreeItemModel({id: 'C-3', label: 'C.3 - Label'}),
			],
		}),
	];
}

describe(ObNavTreeComponent.name, () => {
	let testComponent: TestComponent;
	let component: ObNavTreeComponent;
	let fixture: ComponentFixture<TestComponent>;
	let fixtureDefault: ComponentFixture<TestComponentDefault>;
	let element: DebugElement;
	let hostChangeDetector: ChangeDetectorRef;
	let activeRouterLink: RouterLinkActive;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObNavTreeComponent, RouterModule.forRoot([])],
			declarations: [TestComponent, TestComponentDefault],
			providers: [provideObliqueTestingConfiguration()],
			schemas: [NO_ERRORS_SCHEMA],
		}).compileComponents();
	});

	describe('NavTree with custom formats', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponent);
			testComponent = fixture.componentInstance;
			testComponent.labelFormatter = (item: ObNavTreeItemModel) => `${item.label} - Default}`;
			testComponent.patternMatcher = defaultPatternMatcherFactory(TestBed.inject(TranslateService));
			fixture.detectChanges();
			element = fixture.debugElement.query(By.directive(ObNavTreeComponent));
			component = element.injector.get(ObNavTreeComponent);
			hostChangeDetector = fixture.componentRef.changeDetectorRef;
			activeRouterLink = Object.create(RouterLinkActive.prototype);
			Object.defineProperty(activeRouterLink, 'isActive', {get: () => true});
		});

		it('should be created', () => {
			expect(component).toBeTruthy();
		});

		it('should create 4 navigation trees after recursive rendering', () => {
			const navTrees = fixture.debugElement.queryAll(By.css('ul'));
			expect(navTrees.length).toBe(4);
		});

		it('should create 12 navigation items after recursive rendering', () => {
			const navItems = fixture.debugElement.queryAll(By.css('li'));
			expect(navItems.length).toBe(12);
		});

		it('should detect changes if another `NavTreeItemModel is added`', () => {
			testComponent.items = [...testComponent.items, new ObNavTreeItemModel({id: 'X', label: 'X - Label'})];
			hostChangeDetector.detectChanges();

			const navItems = fixture.debugElement.queryAll(By.css('li'));
			expect(navItems.length).toBe(13);
		});

		it('should custom format item labels', () => {
			const suffix = '[custom]';
			testComponent.labelFormatter = (item: ObNavTreeItemModel) => `${item.label} - ${suffix}`;
			hostChangeDetector.detectChanges();
			const firstNavItem = fixture.debugElement.query(By.css('li'));
			expect(firstNavItem.nativeElement.innerHTML).toContain(suffix);
		});

		it('should add URL fragment to `href` attribute', () => {
			const fragment = `#${testComponent.items[0].fragment}`;

			// [routerLink] directive adds `[href]` attribute to nav item links:
			const firstNavItem = fixture.debugElement.query(By.css('a.ob-nav-link'));
			expect(firstNavItem.nativeElement.attributes.getNamedItem('href')).toBeDefined();
			expect(firstNavItem.nativeElement.attributes.getNamedItem('href').value).toContain(fragment);
		});

		it('should add URL query params to `href` attribute', () => {
			const urlQueryParams = `foo=${testComponent.items[0].queryParams.foo as string}`;

			// [routerLink] directive adds `[href]` attribute to nav item links:
			const firstNavItem = fixture.debugElement.query(By.css('a.ob-nav-link'));
			expect(firstNavItem.nativeElement.attributes.getNamedItem('href')).toBeDefined();
			expect(firstNavItem.nativeElement.attributes.getNamedItem('href').value).toContain(urlQueryParams);
		});

		it('should filter navigation items', () => {
			component.filterPattern.set('2'); // Filter on '2' pattern
			hostChangeDetector.detectChanges();

			// All items containing the string '2' and their respective parents should be visible:
			const navItems = fixture.debugElement.queryAll(By.css('li'));
			expect(navItems.length).toBe(7);
		});

		it('should update the filter pattern on input', () => {
			const input = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
			input.value = '2';
			input.dispatchEvent(new Event('input'));
			hostChangeDetector.detectChanges();

			expect(component.filterPattern()).toBe('2');
			// All items containing the string '2' and their respective parents should be visible:
			const navItems = fixture.debugElement.queryAll(By.css('li'));
			expect(navItems.length).toBe(7);
		});

		it('should highlight patterns on filtered navigation items', () => {
			// Restore default label formatter:
			const translate = TestBed.inject(TranslateService);
			testComponent.labelFormatter = ObNavTreeComponent.DEFAULTS.LABEL_FORMATTER(translate);
			component.filterPattern.set('C'); // Filter on 'C' pattern
			hostChangeDetector.detectChanges();

			// All items containing the string 'C' and their respective parents should be visible:
			const navItems = fixture.debugElement.queryAll(By.css('li'));
			expect(navItems.length).toBe(4);

			// ...and filter patterns highlighted:
			navItems.forEach(item => {
				expect(item.nativeElement.innerHTML).toContain(ObNavTreeComponent.DEFAULTS.HIGHLIGHT);
			});
		});

		it('should collapse all navigation items', () => {
			component.collapseAll();
			hostChangeDetector.detectChanges();

			const collapsed = fixture.debugElement.queryAll(By.css('.collapsed'));
			expect(collapsed.length).toBe(3);
		});

		it('should expand all navigation items', () => {
			component.collapseAll();
			hostChangeDetector.detectChanges();
			component.expandAll();
			hostChangeDetector.detectChanges();

			const collapsed = fixture.debugElement.queryAll(By.css('.collapsed'));
			expect(collapsed.length).toBe(0);
		});

		it('should not match an item without matching text or children', () => {
			expect(component.patternMatcher()!(new ObNavTreeItemModel({id: 'X', label: 'X - Label'}), 'missing')).toBe(false);
		});

		it('should use an empty pattern by default', () => {
			expect(component.patternMatcher()!(new ObNavTreeItemModel({id: 'X', label: 'X - Label'}))).toBe(true);
		});

		it('should make a parent visible when a child matches the filter pattern', () => {
			const item = new ObNavTreeItemModel({
				id: 'parent',
				label: 'Parent',
				collapsed: true,
				items: [new ObNavTreeItemModel({id: 'child', label: 'Matching child'})],
			});

			expect(component.patternMatcher()!(item, 'Matching')).toBe(true);
			expect(item.collapsed).toBe(false);
		});

		it('should show all items without a filter pattern', () => {
			component.filterPattern.set('');

			expect(component.visible(new ObNavTreeItemModel({id: 'X', label: 'X - Label'}))).toBe(true);
		});

		it('should check active links with matching fragments', () => {
			component.activeFragment.set('fragment');

			expect(component.isLinkActive(activeRouterLink, testComponent.items[0])).toBe(true);
		});

		it('should reject active links with different fragments', () => {
			component.activeFragment.set('other-fragment');

			expect(component.isLinkActive(activeRouterLink, testComponent.items[0])).toBe(false);
		});

		it('should use RouterLinkActive state without a fragment', () => {
			expect(component.isLinkActive(activeRouterLink, testComponent.items[1])).toBe(true);
		});

		it('should collapse only the first level without the all flag', () => {
			testComponent.items[1].items[1].collapsed = false;

			component.changeCollapsed(testComponent.items, true);

			expect(testComponent.items[1].collapsed).toBe(true);
			expect(testComponent.items[1].items[1].collapsed).not.toBe(true);
		});
	});

	describe('NavTree with default formats', () => {
		beforeEach(() => {
			fixtureDefault = TestBed.createComponent(TestComponentDefault);
			fixtureDefault.detectChanges();
			element = fixtureDefault.debugElement.query(By.directive(ObNavTreeComponent));
			component = element.injector.get(ObNavTreeComponent);
		});

		it('should be created', () => {
			expect(component).toBeTruthy();
		});

		it('should use default labelFormatter', () => {
			const formattedLabel = 'A - Label';
			const firstNavItem = fixtureDefault.debugElement.query(By.css('li'));
			expect(firstNavItem.nativeElement.innerHTML).toContain(formattedLabel);
		});

		it('should use the default pattern matcher when no custom matcher is provided', () => {
			component.filterPattern.set('B.2');
			fixtureDefault.detectChanges();

			// Item B contains 'B.2' in its subtree, so the default matcher should match it:
			expect(component.visible(fixtureDefault.componentInstance.items[1])).toBe(true);
			// Item A does not contain 'B.2':
			expect(component.visible(fixtureDefault.componentInstance.items[0])).toBe(false);
		});
	});

	describe('NavTree fragment subscription cleanup', () => {
		let fragment$: BehaviorSubject<string | null>;

		beforeEach(async () => {
			fragment$ = new BehaviorSubject<string | null>(null);
			await TestBed.configureTestingModule({
				imports: [ObNavTreeComponent, RouterModule.forRoot([])],
				declarations: [TestComponentDefault],
				providers: [provideObliqueTestingConfiguration(), {provide: ActivatedRoute, useValue: {fragment: fragment$}}],
				schemas: [NO_ERRORS_SCHEMA],
			}).compileComponents();
		});

		it('should stop updating the active fragment after destroy', () => {
			const cleanupFixture = TestBed.createComponent(TestComponentDefault);
			const cleanupElement = cleanupFixture.debugElement.query(By.directive(ObNavTreeComponent));
			const cleanupComponent = cleanupElement.injector.get(ObNavTreeComponent);

			cleanupFixture.detectChanges();
			fragment$.next('fragment');
			expect(cleanupComponent.activeFragment()).toBe('fragment');

			cleanupFixture.destroy();
			fragment$.next('other-fragment');
			expect(cleanupComponent.activeFragment()).toBe('fragment');
		});
	});
});
