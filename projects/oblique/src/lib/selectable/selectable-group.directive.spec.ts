import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {first, skip} from 'rxjs/operators';
import {ObSelectableGroupDirective} from './selectable-group.directive';
import {ObMockSelectableDirective} from './_mocks/mock-selectable.directive';

@Component({
	template: ` <div obSelectableGroup>
		<div obSelectable value="1"></div>
		<div obSelectable value="2"></div>
		<div obSelectable value="3"></div>
	</div>`
})
class TestComponent {}

describe('SelectableGroupDirective', () => {
	let directive: ObSelectableGroupDirective;
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;
	const items = [];

	beforeEach(
		waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [TestComponent, ObMockSelectableDirective, ObSelectableGroupDirective]
			});
		})
	);

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		element = fixture.debugElement.query(By.directive(ObSelectableGroupDirective));
		directive = element.injector.get(ObSelectableGroupDirective);

		items.length = 0;
		for (let i = 0; i < 5; i++) {
			items[i] = new ObMockSelectableDirective();
			items[i].value = i;
		}
		items.forEach(item => directive.register(item));
	});

	it('should create an instance', () => {
		expect(component).toBeTruthy();
		expect(directive).toBeTruthy();
	});

	it('should have a class', () => {
		expect(element.nativeElement.classList).toContain('ob-selectable-group');
	});

	it('should have a mode$ property', () => {
		expect(directive.mode$).toBeDefined();
	});

	it('should have a selected$ property', () => {
		expect(directive.selected$).toBeDefined();
	});

	describe('register', () => {
		it('should store registered directives', () => {
			// @ts-expect-error
			expect(directive.selectables).toEqual(items);
		});
	});

	describe('focus', () => {
		beforeEach(() => {
			directive.focus(items[0]);
			directive.focus(items[1]);
		});
		it('should store last focused item', () => {
			// @ts-expect-error
			expect(directive.focused).toBe(1);
		});
		it('should store previous focused item', () => {
			// @ts-expect-error
			expect(directive.prevFocused).toBe(0);
		});
	});

	describe('checkbox mode', () => {
		let event: KeyboardEvent;
		let mode;
		beforeEach(() => {
			directive.mode$.subscribe(m => (mode = m));
			directive.mode = 'checkbox';
			directive.toggle(items[4]);
			directive.focus(items[2]);
			directive.toggle(items[2]);
			event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
		});

		describe('mode', () => {
			it('should emit on set', () => {
				expect(mode).toBe('checkbox');
			});
		});

		describe('role', () => {
			it('should be defined as property', () => {
				expect(directive.role).toBe('group');
			});
			it('should be defined as attribute', () => {
				fixture.detectChanges();
				expect(element.nativeElement.getAttribute('role')).toBe('group');
			});
		});

		describe('toggle', () => {
			it('should check all called items', done => {
				directive.selected$.pipe(first()).subscribe(selection => {
					expect(selection).toEqual([items[2], items[3], items[4]]);
					done();
				});
				directive.toggle(items[3]);
			});
		});

		describe('selectAll', () => {
			it('should check all items', () => {
				directive.selected$.pipe(first()).subscribe(selection => {
					expect(selection).toEqual(items);
				});
				directive.selectAll();
			});
		});

		describe('deselectAll', () => {
			it('should uncheck all items', () => {
				directive.selected$.pipe(first()).subscribe(selection => {
					expect(selection).toEqual([]);
				});
				directive.deselectAll();
			});
		});

		describe('sort', () => {
			it('should sort directives', () => {
				directive.sort((a, b) => b.value - a.value);
				// @ts-expect-error
				expect(directive.selectables[0].value).toBe(4);
			});
		});

		describe('arrows', () => {
			it('onArrowUp should do nothing', () => {
				directive.onArrowUp(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('onArrowDown should do nothing', () => {
				directive.onArrowDown(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('onShiftArrowUp should do nothing', () => {
				directive.onShiftArrowUp(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('onShiftArrowDown should do nothing', () => {
				directive.onShiftArrowDown(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('onCtrlArrowUp should do nothing', () => {
				directive.onCtrlArrowUp(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('onCtrlArrowDown should do nothing', () => {
				directive.onCtrlArrowDown(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});
		});
	});

	describe('radio mode', () => {
		let event: KeyboardEvent;
		let mode;
		beforeEach(() => {
			directive.mode$.subscribe(m => (mode = m));
			directive.mode = 'radio';
			directive.toggle(items[4]);
			directive.focus(items[2]);
			directive.toggle(items[2]);
			event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
		});
		describe('mode', () => {
			it('should emit on set', () => {
				expect(mode).toBe('radio');
			});

			it('should keep only 1 entry on radio mode', done => {
				directive.mode = 'checkbox';
				directive.toggle(items[0]);
				directive.toggle(items[1]);
				directive.selected$.pipe(first()).subscribe(selection => {
					expect(selection).toEqual([items[0]]);
					done();
				});
				directive.mode = 'radio';
			});
		});

		describe('role', () => {
			it('should be defined as property', () => {
				expect(directive.role).toBe('radiogroup');
			});
			it('should be defined as attribute', () => {
				fixture.detectChanges();
				expect(element.nativeElement.getAttribute('role')).toBe('radiogroup');
			});
		});

		describe('toggle', () => {
			it('should check only check last called item', done => {
				directive.selected$.subscribe(selection => {
					expect(selection).toEqual([items[3]]);
					done();
				});
				directive.toggle(items[3]);
			});
		});

		describe('selectAll', () => {
			it('should do nothing', fakeAsync(() => {
				let data;
				directive.selected$.subscribe(selection => (data = selection));
				directive.selectAll();
				skip(1000);
				expect(data).toBeUndefined();
			}));
		});

		describe('deselectAll', () => {
			it('should do nothing', () => {
				let data;
				directive.selected$.subscribe(selection => (data = selection));
				directive.deselectAll();
				skip(1000);
				expect(data).toBeUndefined();
			});
		});

		describe('arrows', () => {
			it('onArrowUp should be called', () => {
				directive.onArrowUp(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('onArrowUp should emit', done => {
				directive.selected$.pipe(first()).subscribe(sel => {
					expect(sel).toEqual([items[1]]);
					done();
				});
				directive.onArrowUp(event);
			});

			it('onArrowDown should be called', () => {
				directive.onArrowDown(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('onArrowDown should emit', done => {
				directive.selected$.pipe(first()).subscribe(sel => {
					expect(sel).toEqual([items[3]]);
					done();
				});
				directive.onArrowDown(event);
			});

			it('onShiftArrowUp should do nothing', () => {
				directive.onShiftArrowUp(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('onShiftArrowDown should do nothing', () => {
				directive.onShiftArrowDown(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('onCtrlArrowUp should do nothing', () => {
				directive.onCtrlArrowUp(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});

			it('onCtrlArrowDown should do nothing', () => {
				directive.onCtrlArrowDown(event);
				expect(event.preventDefault).not.toHaveBeenCalled();
			});
		});
	});

	describe('windows mode', () => {
		let event: KeyboardEvent;
		let mode;
		beforeEach(() => {
			directive.mode$.subscribe(m => (mode = m));
			directive.mode = 'windows';
			directive.toggle(items[4]);
			directive.focus(items[2]);
			directive.toggle(items[2]);
			event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
		});
		describe('mode', () => {
			it('should emit on set', () => {
				expect(mode).toBe('windows');
			});
		});
		describe('role', () => {
			it('should be defined as property', () => {
				expect(directive.role).toBe('group');
			});
			it('should be defined as attribute', () => {
				fixture.detectChanges();
				expect(element.nativeElement.getAttribute('role')).toBe('group');
			});
		});

		describe('toggle', () => {
			it('without ctrl and shift, should check only check last called item', done => {
				directive.selected$.pipe(first()).subscribe(selection => {
					expect(selection).toEqual([items[1]]);
					done();
				});
				directive.toggle(items[1]);
			});

			describe('with ctrl', () => {
				beforeEach(() => {
					directive.toggle(items[1]);
				});
				it('should not empty selection', done => {
					directive.selected$.pipe(first()).subscribe(selection => {
						expect(selection).toEqual([items[1]]);
						done();
					});
					directive.toggle(items[1], true);
				});
				it('should add elements', done => {
					directive.selected$.pipe(first()).subscribe(selection => {
						expect(selection).toEqual([items[1], items[3]]);
						done();
					});
					directive.toggle(items[3], true);
				});
			});

			describe('with shift', () => {
				it('should add a range', done => {
					directive.selected$.pipe(first()).subscribe(selection => {
						expect(selection).toEqual([items[0], items[1], items[2]]);
						done();
					});
					directive.focus(items[0]);
					directive.toggle(items[0], false, true);
				});
			});
		});

		describe('selectAll', () => {
			it('should check all items', () => {
				directive.selected$.pipe(first()).subscribe(selection => {
					expect(selection).toEqual(items);
				});
				directive.selectAll();
			});
		});

		describe('deselectAll', () => {
			it('should uncheck all items', () => {
				directive.selected$.pipe(first()).subscribe(selection => {
					expect(selection).toEqual([]);
				});
				directive.deselectAll();
			});
		});

		describe('arrows', () => {
			it('onArrowUp should preventDefault', () => {
				directive.onArrowUp(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('onArrowUp should emit', done => {
				directive.selected$.pipe(first()).subscribe(sel => {
					expect(sel).toEqual([items[1]]);
					done();
				});
				directive.onArrowUp(event);
			});

			it('onArrowDown should be called', () => {
				directive.onArrowDown(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('onArrowDown should emit', done => {
				directive.selected$.pipe(first()).subscribe(sel => {
					expect(sel).toEqual([items[3]]);
					done();
				});
				directive.onArrowDown(event);
			});

			it('onShiftArrowUp should preventDefault', () => {
				directive.onShiftArrowUp(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('onShiftArrowUp should emit', done => {
				directive.selected$.pipe(first()).subscribe(sel => {
					expect(sel).toEqual([items[1], items[2]]);
					done();
				});
				directive.onShiftArrowUp(event);
			});

			it('onShiftArrowDown should preventDefault', () => {
				directive.onShiftArrowDown(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('onShiftArrowDown should emit', done => {
				directive.onShiftArrowDown(event);
				directive.focus(items[3]);
				directive.onShiftArrowDown(event);
				directive.focus(items[4]);
				directive.selected$.pipe(first()).subscribe(sel => {
					expect(sel).toEqual([items[2], items[3]]);
					done();
				});
				directive.onShiftArrowUp(event);
				directive.focus(items[3]);
			});

			it('onCtrlArrowUp should preventDefault', () => {
				directive.onCtrlArrowUp(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});

			it('onCtrlArrowDown should preventDefault', () => {
				directive.onCtrlArrowDown(event);
				expect(event.preventDefault).toHaveBeenCalled();
			});
		});
	});
});
