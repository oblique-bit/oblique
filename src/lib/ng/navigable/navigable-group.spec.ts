import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {DebugElement, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {NavigableGroupComponent} from './navigable-group.component';
import {NavigableDirective} from './navigable.directive';

@Component({
	template: `
		<or-navigable-group [items]="models" [selection]="selectedModels">
			<div [orNavigable]="models[0]"></div>
			<div [orNavigable]="models[1]"></div>
			<div [orNavigable]="models[2]"></div>
			<div [orNavigable]="models[3]"></div>
		</or-navigable-group>`
})
class TestComponent {
	selectedModels = [];
	models = [
		{foo: 'bar'},
		{foo: 'bar2'},
		{foo: 'bar3'},
		{foo: 'bar4'}
	];
}

describe('NavigableGroup', () => {
	let testComponent: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let navigableGroup: NavigableGroupComponent;
	let navigables: NavigableDirective[];
	let navigableElements: DebugElement[];

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestComponent,
				NavigableDirective,
				NavigableGroupComponent
			],
			imports: [CommonModule]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		testComponent = fixture.componentInstance;
		navigableGroup = fixture.debugElement.query(By.directive(NavigableGroupComponent)).injector.get(NavigableGroupComponent);
		navigables = fixture.debugElement.queryAll(By.directive(NavigableDirective)).map(child => {
			return child.injector.get(NavigableDirective);
		});
		navigableElements = fixture.debugElement.queryAll(By.directive(NavigableDirective));
	});

	it('should be created', () => {
		expect(navigableGroup).toBeTruthy();
	});

	it('should add navigable model to selection when active', () => {
		navigables[0].active = true;

		expect(navigableGroup.selection.length).toBe(1);
		expect(navigableGroup.selection).toContain(testComponent.models[0]);
	});

	describe('clicking on a navigable item', () => {
		let navigable: NavigableDirective;
		let mouseDownEvent: MouseEvent;
		let ctrlMouseDownEvent: MouseEvent;
		let shiftMouseDownEvent: MouseEvent;
		beforeEach(() => {
			navigable = navigables[0];
			mouseDownEvent = new MouseEvent('mousedown');
			ctrlMouseDownEvent = new MouseEvent('mousedown', {ctrlKey: true});
			shiftMouseDownEvent = new MouseEvent('mousedown', {shiftKey: true});
		});

		it('should add navigable item to selection', () => {
			navigableElements[0].nativeElement.dispatchEvent(mouseDownEvent);
			expect(navigableGroup.selection.length).toBe(1);
			expect(navigableGroup.selection).toContain(testComponent.models[0]);
		});

		describe('while holding CTRL key', () => {

			it('should still *activate* navigable item', () => {
				navigableElements[0].nativeElement.dispatchEvent(ctrlMouseDownEvent);
				expect(navigable.active).toBe(true);
			});

			it('should still *select* navigable item', () => {
				navigableElements[0].nativeElement.dispatchEvent(ctrlMouseDownEvent);
				expect(navigable.selected).toBe(true);
			});

			it('should still add navigable item to selection', () => {
				navigableElements[0].nativeElement.dispatchEvent(ctrlMouseDownEvent);
				expect(navigableGroup.selection.length).toBe(1);
				expect(navigableGroup.selection).toContain(testComponent.models[0]);
			});

			it('should keep other selected navigable items in selection', () => {
				navigable.active = true; // Will be automatically added to selection via `navigableOnActivation`.

				navigableElements[1].nativeElement.dispatchEvent(ctrlMouseDownEvent);

				expect(navigableGroup.selection.length).toBe(2);
				expect(navigableGroup.selection).toContain(testComponent.models[1]);

				navigableElements[2].nativeElement.dispatchEvent(ctrlMouseDownEvent);

				expect(navigableGroup.selection.length).toBe(3);
				expect(navigableGroup.selection).toContain(testComponent.models[2]);
			});

			it('should remove navigable item if already selected', () => {
				navigable.active = true; // Will be automatically added to selection via `navigableOnActivation`.

				navigableElements[0].nativeElement.dispatchEvent(ctrlMouseDownEvent);

				expect(navigableGroup.selection.length).toBe(0);
				expect(navigable.active).toBeFalsy();
				expect(navigable.selected).toBeFalsy();
			});

			it('should not select navigable items between the active and the clicked ones', () => {
				navigable.active = true; // Will be automatically added to selection via `navigableOnActivation`.

				navigableElements[3].nativeElement.dispatchEvent(ctrlMouseDownEvent);

				expect(navigableGroup.selection.length).toBe(2);

				expect(navigables[1].active).toBeFalsy();
				expect(navigables[1].selected).toBeFalsy();

				expect(navigables[2].active).toBeFalsy();
				expect(navigables[2].selected).toBeFalsy();

				expect(navigables[3].active).toBeTruthy();
				expect(navigables[3].selected).toBeTruthy();
			});
		});

		describe('while holding SHIFT key', () => {
			it('should still *activate* navigable item', () => {
				navigableElements[0].nativeElement.dispatchEvent(shiftMouseDownEvent);
				expect(navigable.active).toBe(true);
			});

			it('should still *select* navigable item', () => {
				navigableElements[0].nativeElement.dispatchEvent(shiftMouseDownEvent);
				expect(navigable.selected).toBe(true);
			});

			it('should still add navigable item to selection', () => {
				navigableElements[0].nativeElement.dispatchEvent(shiftMouseDownEvent);
				expect(navigableGroup.selection.length).toBe(1);
				expect(navigableGroup.selection).toContain(testComponent.models[0]);
			});

			it('should select every navigable item between the active and the clicked ones', () => {
				navigable.active = true; // Will be automatically added to selection via `navigableOnActivation`.

				navigableElements[3].nativeElement.dispatchEvent(shiftMouseDownEvent);
				expect(navigableGroup.selection.length).toBe(4);

				navigables.forEach(child => {
					expect(child.selected).toBeTruthy();
				});
			});

			it('should deselect every navigable item that is not between the active and the clicked', () => {
				navigable.active = true; // Will be automatically added to selection via `navigableOnActivation`.

				// Activate 2nd navigable item with CTRL:
				navigableElements[1].nativeElement.dispatchEvent(ctrlMouseDownEvent);
				expect(navigableGroup.selection.length).toBe(2);

				// Activate 3rd navigable item with SHIFT:
				navigableElements[2].nativeElement.dispatchEvent(shiftMouseDownEvent);
				expect(navigableGroup.selection.length).toBe(2);
				expect(navigable.selected).toBeFalsy(); // 1st item should have been deselected!

				expect(navigables[2].active).toBeTruthy();
				expect(navigables[2].selected).toBeTruthy();
			});
		});
	});

	describe('pressing DOWN key', () => {

		it('should activate next navigable item', () => {
			navigables[0].active = true;

			// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
			navigables[0].onKeyDown({
				keyCode: NavigableDirective.KEYS.DOWN,
				preventDefault: () => {
				} // tslint:disable-line
			} as KeyboardEvent);
			// navigableElements[0].nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
			// 	key: NavigableDirective.KEYS.DOWN
			// }));

			expect(navigables[0].active).toBeFalsy();
			expect(navigables[1].active).toBeTruthy();
			expect(navigableGroup.selection.length).toBe(1);
			expect(navigableGroup.selection[0]).toBe(testComponent.models[1]);
		});

		describe('while holding CTRL', () => {
			it('should *combine* with next navigable item', () => {
				navigables[0].active = true;

				// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
				navigables[0].onKeyDown({
					keyCode: NavigableDirective.KEYS.DOWN,
					ctrlKey: true,
					preventDefault: () => {
					} // tslint:disable-line
				} as KeyboardEvent);
				// navigableElements[0].nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
				// 	key: NavigableDirective.KEYS.DOWN
				// 	ctrlKey: true
				// }));

				expect(navigables[0].active).toBeFalsy();
				expect(navigables[1].active).toBeTruthy();
				expect(navigables[1].selected).toBeTruthy();
				expect(navigableGroup.selection.length).toBe(2);
				expect(navigables[0].model).toBe(testComponent.models[0]);
				expect(navigables[1].model).toBe(testComponent.models[1]);
			});
		});

		describe('while holding SHIFT', () => {
			it('should *combine* with next navigable item', () => {
				navigables[0].active = true;

				// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
				navigables[0].onKeyDown({
					keyCode: NavigableDirective.KEYS.DOWN,
					shiftKey: true,
					preventDefault: () => {
					} // tslint:disable-line
				} as KeyboardEvent);
				// navigableElements[0].nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
				// 	key: NavigableDirective.KEYS.DOWN
				// 	shiftKey: true
				// }));

				expect(navigables[0].active).toBeFalsy();
				expect(navigables[1].active).toBeTruthy();
				expect(navigables[1].selected).toBeTruthy();
				expect(navigableGroup.selection.length).toBe(2);
				expect(navigables[0].model).toBe(testComponent.models[0]);
				expect(navigables[1].model).toBe(testComponent.models[1]);
			});
		});

		describe('while holding CTRL & SHIFT key', () => {
			it('should *move* navigable item DOWN', () => {
				navigables[0].active = true;
				const model = testComponent.models[0];

				// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
				navigables[0].onKeyDown({
					keyCode: NavigableDirective.KEYS.DOWN,
					ctrlKey: true,
					shiftKey: true,
					preventDefault: () => {
					} // tslint:disable-line
				} as KeyboardEvent);
				// navigableElements[0].nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
				// 	key: NavigableDirective.KEYS.DOWN
				// 	ctrlKey: true,
				// 	shiftKey: true
				// }));

				fixture.detectChanges();

				expect(navigableGroup.selection.length).toBe(1);
				expect(navigableGroup.selection[0]).toBe(model);
				expect(testComponent.models[1]).toBe(model);
			});
		});
	});

	describe('pressing UP key', () => {

		it('should activate previous navigable item', () => {
			navigables[1].active = true;

			// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
			navigables[1].onKeyDown({
				keyCode: NavigableDirective.KEYS.UP,
				preventDefault: () => {
				} // tslint:disable-line
			} as KeyboardEvent);
			// navigableElements[1].nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
			// 	key: NavigableDirective.KEYS.UP
			// }));

			expect(navigables[1].active).toBeFalsy();
			expect(navigables[0].active).toBeTruthy();
			expect(navigableGroup.selection.length).toBe(1);
			expect(navigableGroup.selection[0]).toBe(testComponent.models[0]);
		});

		describe('while holding CTRL', () => {
			it('should *combine* with previous navigable item', () => {
				navigables[1].active = true;

				// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
				navigables[1].onKeyDown({
					keyCode: NavigableDirective.KEYS.UP,
					ctrlKey: true,
					preventDefault: () => {
					} // tslint:disable-line
				} as KeyboardEvent);
				// navigableElements[1].nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
				// 	key: NavigableDirective.KEYS.UP
				// 	ctrlKey: true
				// }));

				expect(navigables[1].active).toBeFalsy();
				expect(navigables[0].active).toBeTruthy();
				expect(navigables[0].selected).toBeTruthy();
				expect(navigableGroup.selection.length).toBe(2);
				expect(navigables[1].model).toBe(testComponent.models[1]);
				expect(navigables[0].model).toBe(testComponent.models[0]);
			});
		});

		describe('while holding SHIFT', () => {
			it('should *combine* with previous navigable item', () => {
				navigables[1].active = true;

				// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
				navigables[1].onKeyDown({
					keyCode: NavigableDirective.KEYS.UP,
					shiftKey: true,
					preventDefault: () => {
					} // tslint:disable-line
				} as KeyboardEvent);
				// navigableElements[1].nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
				// 	key: NavigableDirective.KEYS.UP
				// 	ctrlKey: true,
				// 	shiftKey: true
				// }));

				expect(navigables[1].active).toBeFalsy();
				expect(navigables[0].active).toBeTruthy();
				expect(navigables[0].selected).toBeTruthy();
				expect(navigableGroup.selection.length).toBe(2);
				expect(navigables[1].model).toBe(testComponent.models[1]);
				expect(navigables[0].model).toBe(testComponent.models[0]);
			});
		});

		describe('while holding CTRL & SHIFT key', () => {
			it('should *move* navigable item UP', () => {
				navigables[1].active = true;
				const model = testComponent.models[1];

				// FIXME: refactor below when https://github.com/ariya/phantomjs/issues/11289
				navigables[1].onKeyDown({
					keyCode: NavigableDirective.KEYS.UP,
					ctrlKey: true,
					shiftKey: true,
					preventDefault: () => {
					} // tslint:disable-line
				} as KeyboardEvent);
				// navigableElements[1].nativeElement.dispatchEvent(new KeyboardEvent('keydown', {
				// 	key: NavigableDirective.KEYS.UP
				// 	ctrlKey: true,
				// 	shiftKey: true
				// }));

				expect(navigableGroup.selection.length).toBe(1);
				expect(navigableGroup.selection[0]).toBe(model);
				expect(testComponent.models[0]).toBe(model);
			});
		});
	});
});

