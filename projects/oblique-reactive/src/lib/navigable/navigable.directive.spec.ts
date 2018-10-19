import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {DebugElement, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {NavigableDirective, NavigableOnChangeEvent, NavigableOnMoveEvent} from 'oblique-reactive';

@Component({
	template: `
		<div [orNavigable]="model"
		     [navigableActivate]="activate"
		     [navigableHighlight]="highlighted"
		     [navigableFocusOnInit]="focusOnInit"
		     (navigableOnActivation)="onActivation()"
		     (navigableOnChange)="onChange($event)"
		     (navigableOnFocus)="onFocus($event)"
		     (navigableOnMouseDown)="onMouseDown()"
		     (navigableOnMove)="onMove($event)">
			<button tabindex="0">Click Me!</button>
		</div>`
})
class TestComponent {
	model = {};
	activate = false;
	highlighted = false;
	focusOnInit = false;

	onActivation() {
		/* Do nothing */
	}

	onChange($event: NavigableOnChangeEvent) {
		/* Do nothing */
	}

	onMouseDown() {
		/* Do nothing */
	}

	onMove($event: NavigableOnMoveEvent) {
		/* Do nothing */
	}

	onFocus($event: FocusEvent) {
		/* Do nothing */
	}
}

describe('NavigableDirective', () => {
	let testComponent: TestComponent;
	let directive: NavigableDirective;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;
	let button: DebugElement;

	//TODO: async not working
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, NavigableDirective],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		testComponent = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(NavigableDirective));
		directive = element.injector.get(NavigableDirective);
		button = fixture.debugElement.query(By.css('button'));
	});

	it('should be created', () => {
		expect(directive).toBeTruthy();
	});

	it('should add `.navigable` class on element', () => {
		expect(element.classes['navigable']).toBeTruthy();
	});

	it('should add `.navigable-selected` class when selected', () => {
		directive.selected = true;
		fixture.detectChanges();
		expect(element.classes['navigable-selected']).toBeTruthy();
	});

	it('should add `.navigable-active` class when active', () => {
		directive.active = true;
		fixture.detectChanges();
		expect(element.classes['navigable-active']).toBeTruthy();
	});

	it('should add `.navigable-highlight` class when highlighted', () => {
		testComponent.highlighted = true;
		fixture.detectChanges();
		expect(element.classes['navigable-highlight']).toBeTruthy();
	});

	describe('toggling activation from test component', () => {
		beforeEach(async(() => {
			spyOn(testComponent, 'onActivation').and.callThrough();
			testComponent.activate = true;
			fixture.detectChanges();
		}));

		it('should *select* directive', () => {
			fixture.detectChanges();
			expect(directive.selected).toBeTruthy();
			expect(element.classes['navigable-selected']).toBeTruthy();
		});

		it('should *activate* directive', () => {
			fixture.detectChanges();
			expect(directive.active).toBeTruthy();
			expect(element.classes['navigable-active']).toBeTruthy();
		});

		it('should call `onActivation` callback', () => {
			expect(testComponent.onActivation).toHaveBeenCalled();
		});
	});

	describe('focusing on element', () => {
		beforeEach(() => {
			spyOn(testComponent, 'onFocus').and.callThrough();
			element.nativeElement.focus();
			fixture.detectChanges();
		});

		xit('should select the directive', () => {
			expect(directive.selected).toBeTruthy();
		});

		xit('should activate the directive', () => {
			expect(directive.active).toBeTruthy();
		});

		xit('should call `onFocus` callback', () => {
			expect(testComponent.onFocus).toHaveBeenCalled();
		});
	});

	describe('clicking on element', () => {
		beforeEach(() => {
			spyOn(testComponent, 'onMouseDown').and.callThrough();
			element.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
			fixture.detectChanges();
		});

		it('should select the directive', () => {
			expect(directive.selected).toBeTruthy();
		});

		it('should activate the directive', () => {
			expect(directive.active).toBeTruthy();
		});

		it('should call `onMouseDown` callback', () => {
			expect(testComponent.onMouseDown).toHaveBeenCalled();
		});
	});

	// FIXME: click events do not seem to bubble up in test environment
	// describe('clicking on some focusable child', () => {
	// 	beforeEach(() => {
	// 		button.nativeElement.dispatchEvent(new MouseEvent('mousedown'));
	// 		button.nativeElement.focus();
	// 		fixture.detectChanges();
	// 	});
	//
	// 	it('should select the directive', () => {
	// 		expect(directive.selected).toBeTruthy();
	// 	});
	//
	// 	it('should activate the directive', () => {
	// 		expect(directive.active).toBeTruthy();
	// 	});
	// });

	describe('pressing DOWN key', () => {

		it('should call `onChange` callback', () => {
			spyOn(testComponent, 'onChange').and.callThrough();
			fixture.detectChanges();

			// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
			directive.onKeyDown({
				code: 'ArrowDown',
				preventDefault: () => {
				} // tslint:disable-line
			} as KeyboardEvent);
			// element.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
			// 	key: NavigableDirective.KEYS.DOWN
			// }));

			expect(testComponent.onChange).toHaveBeenCalled();
		});

		describe('with CTRL+SHIFT modifiers', () => {

			it('should call `onMove` callback', () => {
				spyOn(testComponent, 'onMove').and.callThrough();
				fixture.detectChanges();

				// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
				directive.onKeyDown({
					code: 'ArrowDown',
					ctrlKey: true,
					shiftKey: true,
					preventDefault: () => {
						this.defaultPrevented = true;
					}
				} as KeyboardEvent);
				// element.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
				// 	key: NavigableDirective.KEYS.DOWN
				// 	ctrlKey: true,
				// 	shiftKey: true
				// }));

				expect(testComponent.onMove).toHaveBeenCalled();
			});
		});
	});

	describe('pressing UP key', () => {

		it('should call `onChange` callback', () => {
			spyOn(testComponent, 'onChange').and.callThrough();
			fixture.detectChanges();

			// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
			directive.onKeyDown({
				code: 'ArrowUp',
				preventDefault: () => {
					this.defaultPrevented = true;
				}
			} as KeyboardEvent);
			// element.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
			// 	key: NavigableDirective.KEYS.UP
			// }));

			expect(testComponent.onChange).toHaveBeenCalled();
		});

		describe('with CTRL+SHIFT modifiers', () => {

			it('should call `onMove` callback', () => {
				spyOn(testComponent, 'onMove').and.callThrough();
				fixture.detectChanges();

				// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
				directive.onKeyDown({
					code: 'ArrowUp',
					ctrlKey: true,
					shiftKey: true,
					preventDefault: () => {
						this.defaultPrevented = true;
					}
				} as KeyboardEvent);
				// element.nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
				// 	key: NavigableDirective.KEYS.UP
				// 	ctrlKey: true,
				// 	shiftKey: true
				// }));

				expect(testComponent.onMove).toHaveBeenCalled();
			});
		});
	});
});
