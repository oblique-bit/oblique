import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {DebugElement, Component, Predicate, Renderer2} from '@angular/core';
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

const FAKE_FOCUS_QUERY: Predicate<DebugElement> = By.css('.fake-focus');

const ITEM_QUERY: (string) => Predicate<DebugElement> = (id: string) => By.css(`#nav-tree-${id}`);



describe('NavTreeFakeFocusDirective', () => {
	let testComponent: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;
	let directive: NavTreeFakeFocusDirective;
	let inputElement: DebugElement;

	const keydown = (key) => inputElement.triggerEventHandler('keydown', {keyCode: key});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, NavTreeComponent, NavTreeFakeFocusDirective],
			imports: [CommonModule, RouterTestingModule, NgbCollapseModule.forRoot()],
			providers: [Renderer2]
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
		expect(element.query(FAKE_FOCUS_QUERY)).toBeNull();
	});

	it ('should disable autocompletion', () => {
		expect(inputElement.nativeElement.getAttribute('autocomplete')).toBe('off');
	});

	it ('should expand a collapsed item', () => {
		let item = testComponent.items[1];
		item.collapsed = false;
		directive.fakeFocus(element.query(ITEM_QUERY('B')));

		expect(item.collapsed).toBeFalsy();
		keydown(NavTreeFakeFocusDirective.KEYS.RIGHT);
		expect(item.collapsed).toBeTruthy();
	});

	it ('should collapse an expanded item', () => {
		let item = testComponent.items[1];
		item.collapsed = true;
		directive.fakeFocus(element.query(ITEM_QUERY('B')));

		expect(item.collapsed).toBeTruthy();
		keydown(NavTreeFakeFocusDirective.KEYS.RIGHT);
		expect(item.collapsed).toBeFalsy();
	});

	it ('should click the link of the fake focused item', () => {
		let targetElement = element.query(ITEM_QUERY('B-1'));
		let targetLink = targetElement.query(By.css('a')).nativeElement;
		spyOn(targetElement.nativeElement, 'querySelector').and.returnValue(targetLink);
		spyOn(targetLink, 'click').and.returnValue(false);

		directive.fakeFocus(targetElement);
		expect(targetLink.click).toHaveBeenCalledTimes(0);
		keydown(NavTreeFakeFocusDirective.KEYS.ENTER);
		expect(targetLink.click).toHaveBeenCalledTimes(1);
	});

	it ('should loose fake focus when input focus is lost', () => {
		directive.fakeFocus(element.query(ITEM_QUERY('A')));

		expect(element.query(FAKE_FOCUS_QUERY)).toBeDefined();
		inputElement.triggerEventHandler('blur', {});
		fixture.detectChanges();
		expect(element.query(FAKE_FOCUS_QUERY)).toBeNull();
	});

	it ('should keep the fake focus context on refocus the input element', () => {
		directive.fakeFocus(element.query(ITEM_QUERY('B-1')));
		inputElement.triggerEventHandler('blur', {});
		inputElement.nativeElement.focus();
		keydown(NavTreeFakeFocusDirective.KEYS.DOWN);
		expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('B.2 - Label');
	});

	describe ('on InitialFocus', () => {

		it ('should fake focus the first element on initial ArrowDown', () => {
			keydown(NavTreeFakeFocusDirective.KEYS.DOWN);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('A - Label');
		});


		it ('should fake focus the last element on initial ArrowUp', () => {
			keydown(NavTreeFakeFocusDirective.KEYS.UP);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('C.3 - Label');
		});

		it ('should skip children of collapsed elements on initial ArrowUp', () => {
			testComponent.items[2].collapsed = true;
			fixture.detectChanges();

			keydown(NavTreeFakeFocusDirective.KEYS.UP);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('C - Label');
		});
	});

	describe ('on FakeFocusNext', () => {

		it ('should fake focus the next descendant', () => {
			directive.fakeFocus(element.query(ITEM_QUERY('B')));
			keydown(NavTreeFakeFocusDirective.KEYS.DOWN);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('B.1 - Label');
		});

		it ('should fake focus the next sibling', () => {
			directive.fakeFocus(element.query(ITEM_QUERY('B-1')));
			keydown(NavTreeFakeFocusDirective.KEYS.DOWN);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('B.2 - Label');
		});

		it ('should fake focus the next parent sibling', () => {
			directive.fakeFocus(element.query(ITEM_QUERY('B-3')));
			keydown(NavTreeFakeFocusDirective.KEYS.DOWN);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('C - Label');
		});

		it ('should fake focus the first element if the end of the list is reached', () => {
			directive.fakeFocus(element.query(ITEM_QUERY('C-3')));
			keydown(NavTreeFakeFocusDirective.KEYS.DOWN);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('A - Label');
		});

		it ('should ignore disabled items', () => {
			testComponent.items[1].items[1].disabled = true;
			fixture.detectChanges();
			directive.fakeFocus(element.query(ITEM_QUERY('B-1')));

			keydown(NavTreeFakeFocusDirective.KEYS.DOWN);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('B.3 - Label');
		});
	});

	describe ('on FakeFocusPrevious', () => {

		it ('should fake focus the previous sibling\'s last child', () => {
			directive.fakeFocus(element.query(ITEM_QUERY('C')));
			keydown(NavTreeFakeFocusDirective.KEYS.UP);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('B.3 - Label');
		});

		it ('should fake focus the previous sibling\'s last child but skip collapsed items', () => {
			testComponent.items[1].collapsed = true;
			fixture.detectChanges();

			directive.fakeFocus(element.query(ITEM_QUERY('C')));
			keydown(NavTreeFakeFocusDirective.KEYS.UP);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('B - Label');
		});

		it ('should fake focus the parent', () => {
			directive.fakeFocus(element.query(ITEM_QUERY('B-1')));
			keydown(NavTreeFakeFocusDirective.KEYS.UP);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('B - Label');
		});

		it ('should fake focus the last element if the beginning of the list is reached', () => {
			directive.fakeFocus(element.query(ITEM_QUERY('A')));
			keydown(NavTreeFakeFocusDirective.KEYS.UP);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('C.3 - Label');
		});

		it ('should ignore disabled items', () => {
			testComponent.items[1].items[1].disabled = true;
			fixture.detectChanges();
			directive.fakeFocus(element.query(ITEM_QUERY('B-3')));

			keydown(NavTreeFakeFocusDirective.KEYS.UP);
			expect(element.query(FAKE_FOCUS_QUERY).nativeElement.textContent.trim()).toBe('B.1 - Label');
		});
	});
});
