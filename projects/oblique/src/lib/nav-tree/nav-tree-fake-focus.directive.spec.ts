import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {By} from '@angular/platform-browser';
import {Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NavTreeComponent, NavTreeFakeFocusDirective, NavTreeItemModel} from 'oblique';
import {MockTranslatePipe} from 'tests';

@Component({
	template: `
		<input #inputControl/>
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

const CSS_QUERIES = {
	FAKE_FOCUS: By.css(NavTreeFakeFocusDirective.CSS_SELECTORS.FAKE_FOCUS),
	ITEM_BY_ID: (id: string) => By.css(`#nav-tree-${id}`)
};

describe('NavTreeFakeFocusDirective', () => {
	let testComponent: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;
	let directive: NavTreeFakeFocusDirective;
	let inputElement: DebugElement;
	const translateMock = {
		instant: jest.fn().mockImplementation(key => key)
	};

	const keydown = (code: string) => {
		inputElement.triggerEventHandler(
			NavTreeFakeFocusDirective.INPUT_EVENTS.KEY_DOWN,
			{
				code,
				// FIXME: remove when https://github.com/ariya/phantomjs/issues/11289
				preventDefault: () => {
				} // tslint:disable-line
			}
		);
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [TestComponent, NavTreeComponent, NavTreeFakeFocusDirective, MockTranslatePipe],
			providers: [{provide: TranslateService, useValue: translateMock}],
			schemas: [NO_ERRORS_SCHEMA]
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
		expect(element.query(CSS_QUERIES.FAKE_FOCUS)).toBeNull();
	});

	it('should disable autocompletion', () => {
		expect(inputElement.nativeElement.getAttribute('autocomplete')).toBe('off');
	});

	it('should expand a collapsed item', () => {
		const item = testComponent.items[1];
		item.collapsed = false;
		directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B')));

		expect(item.collapsed).toBeFalsy();
		keydown(NavTreeFakeFocusDirective.KEY_CODES.RIGHT);
		expect(item.collapsed).toBeTruthy();
	});

	it('should collapse an expanded item', () => {
		const item = testComponent.items[1];
		item.collapsed = true;
		directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B')));

		expect(item.collapsed).toBeTruthy();
		keydown(NavTreeFakeFocusDirective.KEY_CODES.RIGHT);
		expect(item.collapsed).toBeFalsy();
	});

	it('should click the link of the fake focused item', () => {
		const targetElement = element.query(CSS_QUERIES.ITEM_BY_ID('B-1'));
		const targetLink = targetElement.query(By.css('a')).nativeElement;
		spyOn(targetElement.nativeElement, 'querySelector').and.returnValue(targetLink);
		spyOn(targetLink, 'click').and.returnValue(false);

		directive.fakeFocus(targetElement);
		expect(targetLink.click).toHaveBeenCalledTimes(0);
		keydown(NavTreeFakeFocusDirective.KEY_CODES.ENTER);
		expect(targetLink.click).toHaveBeenCalledTimes(1);
	});

	it('should loose fake focus when input focus is lost', () => {
		directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('A')));

		expect(element.query(CSS_QUERIES.FAKE_FOCUS)).toBeDefined();
		inputElement.triggerEventHandler('blur', {});
		fixture.detectChanges();
		expect(element.query(CSS_QUERIES.FAKE_FOCUS)).toBeNull();
	});

	it('should *not* keep the fake focus context when refocusing the input element', () => {
		directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B-1')));
		inputElement.triggerEventHandler('blur', {});
		inputElement.nativeElement.focus();
		keydown(NavTreeFakeFocusDirective.KEY_CODES.DOWN);
		const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
		expect(fakeFocusElement).toBeDefined();
		expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('A - Label');
	});

	describe('on InitialFocus', () => {

		it('should fake focus the first element on initial ArrowDown', () => {
			keydown(NavTreeFakeFocusDirective.KEY_CODES.DOWN);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('A - Label');
		});

		it('should fake focus the last element on initial ArrowUp', () => {
			keydown(NavTreeFakeFocusDirective.KEY_CODES.UP);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('C.3 - Label');
		});

		it('should skip children of collapsed elements on initial ArrowUp', () => {
			testComponent.items[2].collapsed = true;
			fixture.detectChanges();

			keydown(NavTreeFakeFocusDirective.KEY_CODES.UP);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('C - Label');
		});
	});

	describe('on FakeFocusNext', () => {

		it('should fake focus the next descendant', () => {
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B')));
			keydown(NavTreeFakeFocusDirective.KEY_CODES.DOWN);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('B.1 - Label');
		});

		it('should fake focus the next sibling', () => {
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B-1')));
			keydown(NavTreeFakeFocusDirective.KEY_CODES.DOWN);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('B.2 - Label');
		});

		it('should fake focus the next parent sibling', () => {
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B-3')));
			keydown(NavTreeFakeFocusDirective.KEY_CODES.DOWN);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('C - Label');
		});

		it('should fake focus the first element if the end of the list is reached', () => {
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('C-3')));
			keydown(NavTreeFakeFocusDirective.KEY_CODES.DOWN);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('A - Label');
		});

		it('should ignore disabled items', () => {
			testComponent.items[1].items[1].disabled = true;
			fixture.detectChanges();
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B-1')));

			keydown(NavTreeFakeFocusDirective.KEY_CODES.DOWN);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('B.3 - Label');
		});
	});

	describe('on FakeFocusPrevious', () => {

		it('should fake focus the previous sibling\'s last child', () => {
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('C')));
			keydown(NavTreeFakeFocusDirective.KEY_CODES.UP);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('B.3 - Label');
		});

		it('should fake focus the previous sibling\'s last child but skip collapsed items', () => {
			testComponent.items[1].collapsed = true;
			fixture.detectChanges();

			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('C')));
			keydown(NavTreeFakeFocusDirective.KEY_CODES.UP);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('B - Label');
		});

		it('should fake focus the parent', () => {
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B-1')));
			keydown(NavTreeFakeFocusDirective.KEY_CODES.UP);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('B - Label');
		});

		it('should fake focus the last element if the beginning of the list is reached', () => {
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('A')));
			keydown(NavTreeFakeFocusDirective.KEY_CODES.UP);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('C.3 - Label');
		});

		it('should ignore disabled items', () => {
			testComponent.items[1].items[1].disabled = true;
			fixture.detectChanges();
			directive.fakeFocus(element.query(CSS_QUERIES.ITEM_BY_ID('B-3')));

			keydown(NavTreeFakeFocusDirective.KEY_CODES.UP);
			const fakeFocusElement = element.query(CSS_QUERIES.FAKE_FOCUS);
			expect(fakeFocusElement).toBeDefined();
			expect(fakeFocusElement.nativeElement.textContent.trim()).toBe('B.1 - Label');
		});
	});
});
