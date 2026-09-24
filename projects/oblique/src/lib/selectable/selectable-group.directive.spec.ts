import {Component, DebugElement, signal} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {WINDOW} from '../window/window.provider';
import {ObSelectableGroupDirective} from './selectable-group.directive';
import {ObMockSelectableDirective} from './_mocks/mock-selectable.directive';
import {FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {ObSelectableDirective} from './selectable.directive';

interface ObSelectableGroupDirectivePrivate<T> {
	selectables: ObSelectableDirective<T>[];
	focused: number;
	prevFocused: number;
}

@Component({
	standalone: false,
	template: `<div obSelectableGroup [mode]="outerMode()" [disabled]="outerDisabled()">
		<div obSelectable [value]="1"></div>
		<div obSelectable [value]="2"></div>
		<div obSelectable [value]="3"></div>
	</div>`,
})
class TestComponent {
	outerMode = signal<'checkbox' | 'radio' | 'windows' | undefined>('checkbox');
	outerDisabled = signal(true);
	selectableGroup = new FormControl([1]);
	disabled = false;
}

@Component({
	standalone: false,
	template: `
		<div obSelectable [value]="0"></div>
		<div obSelectable [value]="1"></div>
		<div obSelectable [value]="2"></div>
		<div obSelectable [value]="3"></div>
		<div obSelectable [value]="4"></div>
	`,
})
class ItemsTestComponent {}

describe(ObSelectableGroupDirective.name, () => {
	let directive: ObSelectableGroupDirective<number>;
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;
	const items = [];

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ObSelectableGroupDirective, ObMockSelectableDirective, ReactiveFormsModule],
			providers: [{provide: WINDOW, useValue: window}],
			declarations: [TestComponent, ItemsTestComponent],
		}).compileComponents();
	});

	describe('default', () => {
		beforeEach(async () => {
			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			await fixture.whenStable();
			element = fixture.debugElement.query(By.directive(ObSelectableGroupDirective));
			directive = element.injector.get(ObSelectableGroupDirective);
			items.length = 0;
			const itemsFixture = TestBed.createComponent(ItemsTestComponent);
			itemsFixture.detectChanges();
			itemsFixture.debugElement.queryAll(By.directive(ObMockSelectableDirective)).forEach((itemElement, index) => {
				items[index] = itemElement.injector.get(ObMockSelectableDirective);
			});
			items.forEach(item => directive.register(item));
		});

		it('should create a component instance', () => {
			expect(component).toBeTruthy();
		});

		it('should create a directive instance', () => {
			expect(directive).toBeTruthy();
		});

		it('should have a class', () => {
			expect(element.nativeElement.classList).toContain('ob-selectable-group');
		});

		it('should have a registerOnChange method', () => {
			expect(directive.registerOnChange).toBeDefined();
		});

		it('should have a registerOnTouched method', () => {
			expect(directive.registerOnTouched).toBeDefined();
		});

		it('should have a setDisabledState method', () => {
			expect(directive.setDisabledState).toBeDefined();
		});

		it('should have a ControlValueAccessor', () => {
			const valueAccessor = element.injector.get(NG_VALUE_ACCESSOR);
			expect(valueAccessor).toBeTruthy();
		});

		describe('register function', () => {
			it('should store registered directives', () => {
				expect((directive as unknown as ObSelectableGroupDirectivePrivate<number>).selectables).toEqual(items);
			});
		});

		describe('focus function', () => {
			beforeEach(() => {
				directive.focus(items[0]);
				directive.focus(items[1]);
			});
			it('should store last focused item', () => {
				expect((directive as unknown as ObSelectableGroupDirectivePrivate<number>).focused).toBe(1);
			});
			it('should store previous focused item', () => {
				expect((directive as unknown as ObSelectableGroupDirectivePrivate<number>).prevFocused).toBe(0);
			});
		});

		describe('checkbox mode', () => {
			let event: KeyboardEvent;

			beforeEach(() => {
				component.outerMode.set('checkbox');
				fixture.detectChanges();

				directive.toggle(items[4]);
				directive.focus(items[2]);
				directive.toggle(items[2]);
				event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
			});

			describe('mode property', () => {
				it('should accept mode as an input', () => {
					expect(directive.mode()).toBe('checkbox');

					component.outerMode.set('radio');
					fixture.detectChanges();

					expect(directive.mode()).toBe('radio');
				});
			});

			describe('role property', () => {
				it('should be defined as property', () => {
					expect(directive.role()).toBe('group');
				});
				it('should be defined as attribute', () => {
					fixture.detectChanges();
					expect(element.nativeElement.getAttribute('role')).toBe('group');
				});
			});

			describe('toggle function', () => {
				it('should check all called items', () => {
					const expected = [items[2], items[3], items[4]];
					directive.toggle(items[3]);
					expect(directive.selected()).toEqual(expected);
				});
			});

			describe('selectAll function', () => {
				it('should check all items', () => {
					directive.selectAll();
					expect(directive.selected()).toEqual(items);
				});
			});

			describe('deselectAll function', () => {
				it('should uncheck all items', () => {
					directive.deselectAll();
					expect(directive.selected()).toEqual([]);
				});
			});

			describe('sort function', () => {
				it('should sort directives', () => {
					directive.sort((firstElement, secondElement) => secondElement.value() - firstElement.value());
					expect((directive as unknown as ObSelectableGroupDirectivePrivate<number>).selectables[0].value()).toBe(4);
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
			beforeEach(() => {
				component.outerMode.set('radio');
				fixture.detectChanges();
				directive.toggle(items[4]);
				directive.focus(items[2]);
				directive.toggle(items[2]);
				event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
			});

			describe('mode property', () => {
				it('should accept mode as an input', () => {
					expect(directive.mode()).toBe('radio');
					component.outerMode.set('checkbox');
					fixture.detectChanges();

					expect(directive.mode()).toBe('checkbox');

					component.outerMode.set('radio');
					fixture.detectChanges();

					expect(directive.mode()).toBe('radio');
				});

				it('should keep only 1 entry on radio mode', () => {
					component.outerMode.set('checkbox');
					fixture.detectChanges();
					directive.toggle(items[0]);
					directive.toggle(items[1]);
					component.outerMode.set('radio');
					fixture.detectChanges();
					expect(directive.selected()).toEqual([items[0]]);
				});
			});

			describe('role property', () => {
				it('should be defined as property', () => {
					expect(directive.role()).toBe('radiogroup');
				});
				it('should be defined as attribute', () => {
					fixture.detectChanges();
					expect(element.nativeElement.getAttribute('role')).toBe('radiogroup');
				});
			});

			describe('toggle function', () => {
				it('should check only check last called item', () => {
					directive.toggle(items[3]);
					TestBed.tick();
					expect(directive.selected()).toEqual([items[3]]);
				});
			});

			describe('selectAll function', () => {
				it('should have only the focused item selected', () => {
					expect(directive.selected()).toEqual([items[2]]);
				});

				it('should do nothing', () => {
					const selection = directive.selected();
					directive.selectAll();
					TestBed.tick();
					expect(directive.selected()).toEqual(selection);
				});
			});

			describe('deselectAll function', () => {
				it('should do nothing', () => {
					const selection = directive.selected();
					directive.deselectAll();
					TestBed.tick();
					expect(directive.selected()).toEqual(selection);
				});
			});

			describe('arrows', () => {
				it('onArrowUp should be called', () => {
					directive.onArrowUp(event);
					expect(event.preventDefault).toHaveBeenCalled();
				});

				it('onArrowUp should select the previous item', () => {
					directive.onArrowUp(event);
					TestBed.tick();
					expect(directive.selected()).toEqual([items[1]]);
				});

				it('onArrowDown should be called', () => {
					directive.onArrowDown(event);
					expect(event.preventDefault).toHaveBeenCalled();
				});

				it('onArrowDown should select the previous item', () => {
					directive.onArrowDown(event);
					TestBed.tick();
					expect(directive.selected()).toEqual([items[3]]);
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

			beforeEach(() => {
				component.outerMode.set('windows');
				fixture.detectChanges();

				directive.toggle(items[4]);
				directive.focus(items[2]);
				directive.toggle(items[2]);

				event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
			});

			describe('mode property', () => {
				it('should accept mode as an input', () => {
					expect(directive.mode()).toBe('windows');
				});
			});

			describe('role property', () => {
				it('should be defined as property', () => {
					expect(directive.role()).toBe('group');
				});
				it('should be defined as attribute', () => {
					fixture.detectChanges();
					expect(element.nativeElement.getAttribute('role')).toBe('group');
				});
			});

			describe('toggle function', () => {
				it('without ctrl and shift, should check only check last called item', () => {
					directive.toggle(items[3]);
					TestBed.tick();

					expect(directive.selected()).toEqual([items[3]]);
				});

				describe('with ctrl', () => {
					beforeEach(() => {
						directive.toggle(items[1]);
					});

					it('should not empty selection', () => {
						directive.toggle(items[1], true);
						TestBed.tick();

						expect(directive.selected()).toEqual([items[1]]);
					});

					it('should add elements', () => {
						directive.toggle(items[3], true);
						TestBed.tick();

						expect(directive.selected()).toEqual([items[1], items[3]]);
					});
				});

				describe('with shift', () => {
					it('should add a range', () => {
						directive.focus(items[0]);
						directive.toggle(items[0], false, true);
						TestBed.tick();

						expect(directive.selected()).toEqual([items[0], items[1], items[2]]);
					});
					it('should expand the range when click multiple times', () => {
						directive.focus(items[1]);
						directive.toggle(items[1], false, true);
						directive.toggle(items[0], false, true);
						TestBed.tick();

						expect(directive.selected()).toEqual([items[0], items[1], items[2]]);
					});
				});
			});

			describe('selectAll function', () => {
				it('should check all items', () => {
					directive.selectAll();
					expect(directive.selected()).toEqual(items);
				});
			});

			describe('deselectAll function', () => {
				it('should uncheck all items', () => {
					directive.deselectAll();
					expect(directive.selected()).toEqual([]);
				});
			});

			describe('arrows', () => {
				it('onArrowUp should preventDefault', () => {
					directive.onArrowUp(event);
					expect(event.preventDefault).toHaveBeenCalled();
				});

				it('onArrowUp should emit', () => {
					directive.onArrowUp(event);
					TestBed.tick();
					expect(directive.selected()).toEqual([items[1]]);
				});

				it('onArrowDown should be called', () => {
					directive.onArrowDown(event);
					expect(event.preventDefault).toHaveBeenCalled();
				});

				it('onArrowDown should emit', () => {
					directive.onArrowDown(event);
					TestBed.tick();
					expect(directive.selected()).toEqual([items[3]]);
				});

				it('onShiftArrowUp should preventDefault', () => {
					directive.onShiftArrowUp(event);
					expect(event.preventDefault).toHaveBeenCalled();
				});

				it('onShiftArrowUp should select all previous items', () => {
					directive.onShiftArrowUp(event);
					TestBed.tick();
					expect(directive.selected()).toEqual([items[1], items[2]]);
				});

				it('onShiftArrowUp should not change the selection before the first item', () => {
					directive.focus(items[0]);
					jest.spyOn(items[0], 'focus');

					const selection = directive.selected();

					directive.onShiftArrowUp(event);
					TestBed.tick();

					expect(items[0].focus).not.toHaveBeenCalled();
					expect(directive.selected()).toEqual(selection);
				});

				it('onShiftArrowDown should preventDefault', () => {
					directive.onShiftArrowDown(event);
					expect(event.preventDefault).toHaveBeenCalled();
				});

				it('onShiftArrowDown should select all next items', () => {
					directive.onShiftArrowDown(event);
					directive.focus(items[3]);
					directive.onShiftArrowDown(event);
					directive.focus(items[4]);

					directive.onShiftArrowUp(event);
					directive.focus(items[3]);
					TestBed.tick();

					expect(directive.selected()).toEqual([items[2], items[3]]);
				});

				it('onShiftArrowDown should not change the selection after the last item', () => {
					directive.focus(items[4]);
					jest.spyOn(items[4], 'focus');

					const selection = directive.selected();

					directive.onShiftArrowDown(event);
					TestBed.tick();

					expect(items[4].focus).not.toHaveBeenCalled();
					expect(directive.selected()).toEqual(selection);
				});

				it('onCtrlArrowUp should preventDefault', () => {
					directive.onCtrlArrowUp(event);
					expect(event.preventDefault).toHaveBeenCalled();
				});

				it('onCtrlArrowUp should not focus before the first item', () => {
					directive.focus(items[0]);
					jest.spyOn(items[0], 'focus');

					directive.onCtrlArrowUp(event);

					expect(items[0].focus).not.toHaveBeenCalled();
				});

				it('onCtrlArrowDown should preventDefault', () => {
					directive.onCtrlArrowDown(event);
					expect(event.preventDefault).toHaveBeenCalled();
				});

				it('onCtrlArrowDown should not focus after the last item', () => {
					directive.focus(items[4]);
					jest.spyOn(items[4], 'focus');

					directive.onCtrlArrowDown(event);

					expect(items[4].focus).not.toHaveBeenCalled();
				});
			});
		});

		describe('undefined mode', () => {
			it('should default to "checkbox"', () => {
				component.outerMode.set(undefined);
				fixture.detectChanges();

				expect(directive.mode()).toBeUndefined();
				expect(directive.effectiveMode()).toBe('checkbox');
			});
		});
	});

	describe('disabled group', () => {
		beforeEach(async () => {
			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;

			fixture.detectChanges();
			await fixture.whenStable();

			element = fixture.debugElement.query(By.directive(ObSelectableGroupDirective));
			directive = element.injector.get(ObSelectableGroupDirective);
		});

		describe('disabled property', () => {
			it('should reflect changes', () => {
				component.outerDisabled.set(false);
				fixture.detectChanges();

				expect(fixture.componentInstance.outerDisabled()).toBe(false);
			});

			it('should have the initial disabled value', () => {
				expect(directive.disabled()).toBe(true);
			});

			it('should reflect changes to the disabled input', () => {
				component.outerDisabled.set(false);
				fixture.detectChanges();

				expect(directive.disabled()).toBe(false);
			});
		});
	});

	describe('with a reactive form', () => {
		const selectableDirectives = [
			{value: signal(1), selected: signal(false)} as unknown as ObSelectableDirective<number>,
			{value: signal(2), selected: signal(false)} as unknown as ObSelectableDirective<number>,
		];
		beforeEach(async () => {
			fixture = TestBed.overrideComponent(TestComponent, {
				set: {
					template: `<div obSelectableGroup [formControl]="selectableGroup" [disabled]="disabled">
									<div obSelectable [value]="1"></div>
									<div obSelectable [value]="2"></div>
								</div>`,
				},
			}).createComponent(TestComponent);

			component = fixture.componentInstance;
			fixture.detectChanges();
			await fixture.whenStable();
			element = fixture.debugElement.query(By.directive(ObSelectableGroupDirective));
			directive = element.injector.get(ObSelectableGroupDirective);
			selectableDirectives.forEach(selectableDirective => directive.register(selectableDirective));
			// reset state before each test case
			selectableDirectives.forEach(selectableDirective => {
				selectableDirective.selected.set(false);
			});
		});

		describe('writeValue function', () => {
			it('should select the corresponding element', () => {
				directive.writeValue([2]);
				expect([selectableDirectives[0].selected(), selectableDirectives[1].selected()]).toEqual([false, true]);
			});

			it('should handle an undefined selection', () => {
				directive.writeValue(undefined);
				expect([selectableDirectives[0].selected(), selectableDirectives[1].selected()]).toEqual([false, false]);
			});
		});

		describe('toggle function', () => {
			it('should update the form', () => {
				directive.toggle(selectableDirectives[1]);
				expect(component.selectableGroup.value).toEqual([2]);
			});
		});

		describe('disabled state', () => {
			it('should not add "disabled" attribute if enabled', () => {
				component.selectableGroup.enable();
				fixture.detectChanges();
				expect(element.attributes['disabled']).toBeUndefined();
			});

			it('should add "disabled" attribute if disabled', () => {
				component.selectableGroup.disable();
				fixture.detectChanges();
				expect(element.attributes['disabled']).toBe('');
			});

			it('should let the form disabled state override the disabled input', () => {
				component.disabled = true;
				component.selectableGroup.disable();
				fixture.componentRef.changeDetectorRef.detectChanges();
				expect(element.attributes['disabled']).toBe('');
				component.selectableGroup.enable();
				fixture.componentRef.changeDetectorRef.detectChanges();
				expect(element.attributes['disabled']).toBeUndefined();
			});
		});
	});
});
