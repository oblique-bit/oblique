/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement, Component} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {NavTreeComponent} from './nav-tree.component';
import {NavTreeItemModel} from './nav-tree-item.model';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';

@Component({
	template: `
		<or-nav-tree [items]="items"
		             [prefix]="prefix"
		             [variant]="variant"
		             [filterPattern]="filterPattern"
		             [labelFormatter]="labelFormatter"
		             [rlaOptions]="rlaOptions"></or-nav-tree>`
})
class TestComponent {
	items = [
		new NavTreeItemModel({id: 'A', label: 'A - Label', fragment: 'fragment', queryParams: {foo: 'bar'}}),
		new NavTreeItemModel({
			id: 'B', label: 'B - Label',
			items: [
				new NavTreeItemModel({id: 'B-1', label: 'B.1 - Label'}),
				new NavTreeItemModel({
					id: 'B-2', label: 'B.2 - Label',
					items: [
						new NavTreeItemModel({id: 'B2-1', label: 'B.2.1 - Label'}),
						new NavTreeItemModel({id: 'B2-2', label: 'B.2.2 - Label'}),
						new NavTreeItemModel({id: 'B2-3', label: 'B.2.3 - Label'})
					]
				}),
				new NavTreeItemModel({id: 'B-3', label: 'B.3 - Label'})
			]
		}),
		new NavTreeItemModel({
			id: 'C', label: 'C - Label',
			items: [
				new NavTreeItemModel({id: 'C-1', label: 'C.1 - Label'}),
				new NavTreeItemModel({id: 'C-2', label: 'C.2 - Label'}),
				new NavTreeItemModel({id: 'C-3', label: 'C.3 - Label'})
			]
		})
	];

	prefix = 'nav-tree-test';
	variant = NavTreeComponent.DEFAULTS.VARIANT;
	filterPattern: string;
	public rlaOptions: any = {
		exact: true
	};

	labelFormatter(label: string): string {
		return `${label} - ${this.prefix}`;
	};
}

describe('NavTreeComponent', () => {
	let testComponent: TestComponent;
	let component: NavTreeComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, NavTreeComponent],
			imports: [CommonModule, RouterTestingModule, NgbCollapseModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(NavTreeComponent));
		component = element.injector.get(NavTreeComponent);
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});

	it('should create 4 navigation trees after recursive rendering', () => {
		let navTrees = fixture.debugElement.queryAll(By.directive(NavTreeComponent));
		expect(navTrees.length).toBe(4);
	});

	it('should create 12 navigation items after recursive rendering', () => {
		let navItems = fixture.debugElement.queryAll(By.css('li.nav-item'));
		expect(navItems.length).toBe(12);
	});

	it('should detect changes if another `NavTreeItemModel is added`', () => {
		testComponent.items.push(new NavTreeItemModel({id: 'X', label: 'X - Label'}));
		fixture.detectChanges();

		let navItems = fixture.debugElement.queryAll(By.css('li.nav-item'));
		expect(navItems.length).toBe(13);
	});

	it('should add a variant CSS class to the navigation trees', () => {
		testComponent.variant = 'nav-custom';
		fixture.detectChanges();

		let navTrees = fixture.debugElement.queryAll(By.css('.nav-tree.nav-custom'));
		expect(navTrees.length).toBe(4);
	});

	// fit('should activate one navigation item on click', () => {
	// 	let firstNavItem = fixture.debugElement.query(By.css('a.nav-link'));
	// 	firstNavItem.nativeElement.click();
	//
	// 	expect(firstNavItem.classes['active']).toBeDefined();
	// });

	it('should custom format item labels', () => {
		let suffix = '[custom]';
		component.labelFormatter = (item: NavTreeItemModel, filterPattern: string) => {
			return `${item.label} - ${suffix}`;
		};
		fixture.detectChanges();
		let firstNavItem = fixture.debugElement.query(By.css('li.nav-item'));
		expect(firstNavItem.nativeElement.innerHTML).toContain(suffix);
	});

	it('should add URL fragment to `href` attribute', () => {
		let fragment = '#' + testComponent.items[0].fragment;

		// [routerLink] directive adds `[href]` attribute to nav item links:
		let firstNavItem = fixture.debugElement.query(By.css('a.nav-link'));
		expect(firstNavItem.nativeElement.attributes.getNamedItem('href')).toBeDefined();
		expect(firstNavItem.nativeElement.attributes.getNamedItem('href').value).toContain(fragment);
	});

	it('should add URL query params to `href` attribute', () => {
		let urlQueryParams = 'foo=' + testComponent.items[0].queryParams.foo;

		// [routerLink] directive adds `[href]` attribute to nav item links:
		let firstNavItem = fixture.debugElement.query(By.css('a.nav-link'));
		expect(firstNavItem.nativeElement.attributes.getNamedItem('href')).toBeDefined();
		expect(firstNavItem.nativeElement.attributes.getNamedItem('href').value).toContain(urlQueryParams);
	});

	it('should filter navigation items', () => {
		component.filterPattern = '2';  // Filter on '2' pattern
		fixture.detectChanges();

		// All items containing the string '2' and their respective parents should be visible:
		let navItems = fixture.debugElement.queryAll(By.css('li.nav-item'));
		expect(navItems.length).toBe(7);
	});

	it('should highlight patterns on filtered navigation items', () => {
		// Restore default label formatter:
		component.labelFormatter = NavTreeComponent.DEFAULTS.LABEL_FORMATTER();
		component.filterPattern = 'C'; // Filter on 'C' pattern
		fixture.detectChanges();

		// All items containing the string 'C' and their respective parents should be visible:
		let navItems = fixture.debugElement.queryAll(By.css('li.nav-item'));
		expect(navItems.length).toBe(4);

		// ...and filter patterns highlighted:
		navItems.forEach((item) => {
			expect(item.nativeElement.innerHTML).toContain(NavTreeComponent.DEFAULTS.HIGHLIGHT);
		});
	});

	it('should collapse all navigation items', () => {
		component.collapseAll();
		fixture.detectChanges();

		let collapsed = fixture.debugElement.queryAll(By.css('.collapsed'));
		expect(collapsed.length).toBe(3);
	});

	it('should expand all navigation items', () => {
		component.collapseAll();
		fixture.detectChanges();
		component.expandAll();
		fixture.detectChanges();

		let collapsed = fixture.debugElement.queryAll(By.css('.collapsed'));
		expect(collapsed.length).toBe(0);
	});
});
