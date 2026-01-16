import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, waitForAsync} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {first, skip} from 'rxjs/operators';
import {WINDOW} from '../utilities';
import {ObSelectableGroupDirective} from './selectable-group.directive';
import {ObMockSelectableDirective} from './_mocks/mock-selectable.directive';
import {firstValueFrom} from 'rxjs';
import {FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {ObSelectableDirective} from '@oblique/oblique';

@Component({
	standalone: false,
	template: `<div obSelectableGroup>
		<div obSelectable [value]="1"></div>
		<div obSelectable [value]="2"></div>
		<div obSelectable [value]="3"></div>
	</div>`,
})
class TestComponent {
	selectableGroup = new FormControl([1]);
}

describe(ObSelectableGroupDirective.name, () => {
	let directive: ObSelectableGroupDirective<number>;
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;
	const items = [];

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ObSelectableGroupDirective, ObMockSelectableDirective, ReactiveFormsModule],
			providers: [{provide: WINDOW, useValue: window}],
			declarations: [TestComponent],
		});
	}));

	describe('default', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			element = fixture.debugElement.query(By.directive(ObSelectableGroupDirective));
			directive = element.injector.get(ObSelectableGroupDirective);
			items.length = 0;
			for (let index = 0; index < 5; index++) {
				items[index] = new ObMockSelectableDirective();
				items[index].value = index;
			}
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

		it('should have a mode$ property', () => {
			expect(directive.mode$).toBeDefined();
		});

		it('should have a selected$ property', () => {
			expect(directive.selected$).toBeDefined();
		});

		it('should have a disabled$ property', () => {
			expect(directive.disabled$).toBeDefined();
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
				// @ts-expect-error
				expect(directive.selectables).toEqual(items);
			});
		});

		describe('focus function', () => {
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
				directive.mode$.subscribe(newMode => {
					mode = newMode;
				});
				directive.mode = 'checkbox';
				directive.toggle(items[4]);
				directive.focus(items[2]);
				directive.toggle(items[2]);
				event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
			});

			describe('mode property', () => {
				it('should emit on set', () => {
					expect(mode).toBe('checkbox');
				});
			});

			describe('role property', () => {
				it('should be defined as property', () => {
					expect(directive.role).toBe('group');
				});
				it('should be defined as attribute', () => {
					fixture.detectChanges();
					expect(element.nativeElement.getAttribute('role')).toBe('group');
				});
			});

			describe('toggle function', () => {
				it('should check all called items', done => {
					directive.selected$.pipe(first()).subscribe(selection => {
						expect(selection).toEqual([items[2], items[3], items[4]]);
						done();
					});
					directive.toggle(items[3]);
				});
			});

			describe('selectAll function', () => {
				it('should check all items', () => {
					directive.selected$.pipe(first()).subscribe(selection => {
						expect(selection).toEqual(items);
					});
					directive.selectAll();
				});
			});

			describe('deselectAll function', () => {
				it('should uncheck all items', () => {
					directive.selected$.pipe(first()).subscribe(selection => {
						expect(selection).toEqual([]);
					});
					directive.deselectAll();
				});
			});

			describe('sort function', () => {
				it('should sort directives', () => {
					directive.sort((firstElement, secondElement) => secondElement.value - firstElement.value);
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
				directive.mode$.subscribe(newMode => {
					mode = newMode;
				});
				directive.mode = 'radio';
				directive.toggle(items[4]);
				directive.focus(items[2]);
				directive.toggle(items[2]);
				event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
			});
			describe('mode property', () => {
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

			describe('role property', () => {
				it('should be defined as property', () => {
					expect(directive.role).toBe('radiogroup');
				});
				it('should be defined as attribute', () => {
					fixture.detectChanges();
					expect(element.nativeElement.getAttribute('role')).toBe('radiogroup');
				});
			});

			describe('toggle function', () => {
				it('should check only check last called item', done => {
					directive.selected$.subscribe(selection => {
						expect(selection).toEqual([items[3]]);
						done();
					});
					directive.toggle(items[3]);
				});
			});

			describe('selectAll function', () => {
				it('should do nothing', fakeAsync(() => {
					let data;
					directive.selected$.subscribe(selection => {
						data = selection;
					});
					directive.selectAll();
					skip(1000);
					expect(data).toBeUndefined();
				}));
			});

			describe('deselectAll function', () => {
				it('should do nothing', () => {
					let data;
					directive.selected$.subscribe(selection => {
						data = selection;
					});
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
			let mode: string;
			beforeEach(() => {
				directive.mode$.subscribe(newMode => {
					mode = newMode;
				});
				directive.mode = 'windows';
				directive.toggle(items[4]);
				directive.focus(items[2]);
				directive.toggle(items[2]);
				event = {preventDefault: jest.fn()} as unknown as KeyboardEvent;
			});
			describe('mode property', () => {
				it('should emit on set', () => {
					expect(mode).toBe('windows');
				});
			});
			describe('role property', () => {
				it('should be defined as property', () => {
					expect(directive.role).toBe('group');
				});
				it('should be defined as attribute', () => {
					fixture.detectChanges();
					expect(element.nativeElement.getAttribute('role')).toBe('group');
				});
			});

			describe('toggle function', () => {
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
					it('should expand the range when click multiple times', done => {
						directive.selected$.pipe(skip(1), first()).subscribe(selection => {
							expect(selection).toEqual([items[0], items[1], items[2]]);
							done();
						});
						directive.focus(items[1]);
						directive.toggle(items[1], false, true);
						directive.toggle(items[0], false, true);
					});
				});
			});

			describe('selectAll function', () => {
				it('should check all items', () => {
					directive.selected$.pipe(first()).subscribe(selection => {
						expect(selection).toEqual(items);
					});
					directive.selectAll();
				});
			});

			describe('deselectAll function', () => {
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

		describe('undefined mode', () => {
			it('should default to "checkbox"', done => {
				directive.mode$.subscribe(mode => {
					expect(mode).toBe('checkbox');
					done();
				});
				directive.mode = undefined;
			});
		});
	});

	describe('disabled group', () => {
		beforeEach(() => {
			fixture = TestBed.overrideComponent(TestComponent, {
				set: {
					template: `<div obSelectableGroup disabled>
										<div obSelectable [value]="1"></div>
										<div obSelectable [value]="2"></div>
										<div obSelectable [value]="3"></div>
									</div>`,
				},
			}).createComponent(TestComponent);
			component = fixture.componentInstance;
			component = fixture.debugElement.query(By.directive(ObSelectableGroupDirective)).componentInstance;
			fixture.detectChanges();
			element = fixture.debugElement.query(By.directive(ObSelectableGroupDirective));
			directive = element.injector.get(ObSelectableGroupDirective);
		});

		describe('disabled$ property', () => {
			it('should emit true as initial value', async () => {
				await expect(firstValueFrom(directive.disabled$)).resolves.toBe(true);
			});

			it('should reflect the value of the disabled input', async () => {
				directive.disabled = false;
				await expect(firstValueFrom(directive.disabled$)).resolves.toBe(false);
			});
		});

		describe('disabled property', () => {
			it('should initially be set to true', () => {
				expect(directive.disabled).toBe(true);
			});
		});
	});

	describe('with a reactive form', () => {
		const selectableDirectives = [
			{value: 1} as ObSelectableDirective<number>,
			{value: 2} as ObSelectableDirective<number>,
		];
		beforeEach(() => {
			fixture = TestBed.overrideComponent(TestComponent, {
				set: {
					template: `<div obSelectableGroup [formControl]="selectableGroup">
										<div obSelectable [value]="1"></div>
										<div obSelectable [value]="2"></div>
									</div>`,
				},
			}).createComponent(TestComponent);
			component = fixture.debugElement.query(By.directive(ObSelectableGroupDirective)).componentInstance;
			fixture.detectChanges();
			element = fixture.debugElement.query(By.directive(ObSelectableGroupDirective));
			directive = element.injector.get(ObSelectableGroupDirective);
			selectableDirectives.forEach(selectableDirective => directive.register(selectableDirective));
			// reset state before each test case
			selectableDirectives.forEach(selectableDirective => {
				(selectableDirective as any).selected = false;
			});
		});

		describe('writeValue function', () => {
			it('should select the corresponding element', done => {
				directive.writeValue([2]);
				directive.selected$.subscribe(value => {
					expect(value).toEqual([{selected: true, value: 2}]);
					done();
				});
			});

			it('should unselect everything when undefined', done => {
				directive.writeValue(undefined);
				directive.selected$.subscribe(value => {
					expect(value).toEqual([]);
					done();
				});
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
		});
	});
});
