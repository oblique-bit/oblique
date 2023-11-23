import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObNavTreeItemModel} from './nav-tree-item.model';
import {ObNavTreeComponent} from './nav-tree.component';

@Component({
	template: ` <ob-nav-tree [items]="items" [prefix]="prefix" [filterPattern]="filterPattern" [labelFormatter]="labelFormatter" />`
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
						new ObNavTreeItemModel({id: 'B2-3', label: 'B.2.3 - Label'})
					]
				}),
				new ObNavTreeItemModel({id: 'B-3', label: 'B.3 - Label'})
			]
		}),
		new ObNavTreeItemModel({
			id: 'C',
			label: 'C - Label',
			items: [
				new ObNavTreeItemModel({id: 'C-1', label: 'C.1 - Label'}),
				new ObNavTreeItemModel({id: 'C-2', label: 'C.2 - Label'}),
				new ObNavTreeItemModel({id: 'C-3', label: 'C.3 - Label'})
			]
		})
	];

	prefix = 'nav-tree-test';
	filterPattern: string;

	labelFormatter(label: string): string {
		return `${label} - ${this.prefix}`;
	}
}

describe('NavTreeComponent', () => {
	let testComponent: TestComponent;
	let component: ObNavTreeComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ObNavTreeComponent, RouterTestingModule, TranslateModule],
			declarations: [TestComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}],
			schemas: [NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(ObNavTreeComponent));
		component = element.injector.get(ObNavTreeComponent);
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
		testComponent.items.push(new ObNavTreeItemModel({id: 'X', label: 'X - Label'}));
		fixture.detectChanges();

		const navItems = fixture.debugElement.queryAll(By.css('li'));
		expect(navItems.length).toBe(13);
	});

	it('should custom format item labels', () => {
		const suffix = '[custom]';
		component.labelFormatter = (item: ObNavTreeItemModel) => `${item.label} - ${suffix}`;
		fixture.detectChanges();
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
		component.filterPattern = '2'; // Filter on '2' pattern
		fixture.detectChanges();

		// All items containing the string '2' and their respective parents should be visible:
		const navItems = fixture.debugElement.queryAll(By.css('li'));
		expect(navItems.length).toBe(7);
	});

	it('should highlight patterns on filtered navigation items', () => {
		// Restore default label formatter:
		const translate = TestBed.inject(TranslateService);
		component.labelFormatter = ObNavTreeComponent.DEFAULTS.LABEL_FORMATTER(translate);
		component.filterPattern = 'C'; // Filter on 'C' pattern
		fixture.detectChanges();

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
		fixture.detectChanges();

		const collapsed = fixture.debugElement.queryAll(By.css('.collapsed'));
		expect(collapsed.length).toBe(3);
	});

	it('should expand all navigation items', () => {
		component.collapseAll();
		fixture.detectChanges();
		component.expandAll();
		fixture.detectChanges();

		const collapsed = fixture.debugElement.queryAll(By.css('.collapsed'));
		expect(collapsed.length).toBe(0);
	});
});
