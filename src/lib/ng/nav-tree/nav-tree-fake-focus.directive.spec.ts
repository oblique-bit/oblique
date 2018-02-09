import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement, Component} from '@angular/core';
import {NgbCollapseModule} from '@ng-bootstrap/ng-bootstrap';
import {NavTreeComponent} from './nav-tree.component';
import {NavTreeItemModel} from './nav-tree-item.model';
import {NavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';

@Component({
	template: `
		<input #inputControl />
		<or-nav-tree [items]="items"
					 [orNavTreeFakeFocus]="inputControl"
		></or-nav-tree>`
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
}

describe('NavTreeFakeFocusDirective', () => {
	let testComponent: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;
	let directive: NavTreeFakeFocusDirective;
	let inputElement: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, NavTreeComponent, NavTreeFakeFocusDirective],
			imports: [CommonModule, RouterTestingModule, NgbCollapseModule.forRoot()]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(NavTreeFakeFocusDirective));
		directive = element.injector.get(NavTreeFakeFocusDirective);
		inputElement = fixture.debugElement.query(By.css('input'));
	});

	it('should be created', () => {
		expect(directive).toBeTruthy();
		expect(element.query(By.css('.fake-focus'))).toBeNull();
	});

	it ('should disable autocompletion', () => {
		expect(inputElement.nativeElement.getAttribute('autocomplete')).toBe('off');
	});

	it ('should fake focus the first element on initial ArrowDown', () => {
		inputElement.triggerEventHandler('keydown.ArrowDown', {});
		expect(element.query(By.css('.fake-focus')).nativeElement.textContent.trim()).toBe('A - Label');
	});

	it ('should fake focus the last element on initial ArrowUp', () => {
		inputElement.triggerEventHandler('keydown.ArrowUp', {});
		expect(element.query(By.css('.fake-focus')).nativeElement.textContent.trim()).toBe('C.3 - Label');
	});

	describe ('InitialFocus', () => {

		it ('should skip children of collapsed elements on initial ArrowUp', () => {
			testComponent.items[2].collapsed = true;
			fixture.detectChanges();

			inputElement.triggerEventHandler('keydown.ArrowUp', {});
			expect(element.query(By.css('.fake-focus')).nativeElement.textContent.trim()).toBe('C - Label');
		});

	});
});
