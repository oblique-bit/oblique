import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component, DebugElement, Directive} from '@angular/core';
import {By} from '@angular/platform-browser';
import {BehaviorSubject} from 'rxjs';
import {ObSelectableDirective} from './selectable.directive';
import {ObSelectableGroupDirective} from './selectable-group.directive';

@Component({
	template: ` <div obSelectable value="test"></div>`
})
class FaultyTestComponent {}

@Component({
	template: ` <div obSelectableGroup>
		<div obSelectable value="test"></div>
	</div>`
})
class TestComponent {}

@Directive({
	selector: '[obSelectableGroup]',
	exportAs: 'obSelectableGroup'
})
export class ObMockSelectableGroupDirective {
	mode$ = new BehaviorSubject<string>('checkbox');
	disabled$ = new BehaviorSubject<boolean>(false);
	register = jest.fn();
	toggle = jest.fn();
	focus = jest.fn();
}

@Directive({
	selector: '[obSelectableGroup]',
	exportAs: 'obSelectableGroup'
})
export class ObMockDisabledSelectableGroupDirective {
	mode$ = new BehaviorSubject<string>('checkbox');
	disabled$ = new BehaviorSubject<boolean>(true);
	register = jest.fn();
	toggle = jest.fn();
	focus = jest.fn();
	isDisabled = true;
}

describe(ObSelectableDirective.name, () => {
	let directive: ObSelectableDirective;
	let group: ObSelectableGroupDirective;
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;
	let element: DebugElement;

	describe('without obSelectableGroup', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObSelectableDirective],
				declarations: [FaultyTestComponent]
			});
		}));

		it('should throw an error', () => {
			expect(() => TestBed.createComponent(FaultyTestComponent)).toThrow(
				'The ObSelectableDirectives need to be wrapped in an ObSelectableGroupDirective. Please consult the documentation for more info'
			);
		});
	});

	describe('with obSelectableGroup', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObSelectableDirective],
				declarations: [ObMockSelectableGroupDirective, TestComponent],
				providers: [{provide: ObSelectableGroupDirective, useClass: ObMockSelectableGroupDirective}]
			});
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			element = fixture.debugElement.query(By.directive(ObSelectableDirective));
			directive = element.injector.get(ObSelectableDirective);
			group = fixture.debugElement.query(By.directive(ObMockSelectableGroupDirective)).injector.get(ObSelectableGroupDirective);
		});

		afterEach(() => {
			jest.clearAllMocks();
		});

		it('should create an instance', () => {
			expect(component).toBeTruthy();
			expect(directive).toBeTruthy();
			expect(group).toBeTruthy();
		});

		it('should have a class', () => {
			expect(element.nativeElement.classList).toContain('ob-selectable');
		});

		it('should call register', () => {
			directive.ngOnInit();
			expect(group.register).toHaveBeenCalledWith(directive);
		});

		describe('role', () => {
			describe('checkbox', () => {
				beforeEach(() => {
					group.mode$.next('checkbox');
					fixture.detectChanges();
				});
				it('should be defined as property', () => {
					expect(directive.role).toBe('checkbox');
				});
				it('should be defined as attribute', () => {
					expect(element.nativeElement.getAttribute('role')).toBe('checkbox');
				});
			});
			describe('radio', () => {
				beforeEach(() => {
					group.mode$.next('radio');
					fixture.detectChanges();
				});
				it('should be defined as property', () => {
					expect(directive.role).toBe('radio');
				});
				it('should be defined as attribute', () => {
					expect(element.nativeElement.getAttribute('role')).toBe('radio');
				});
			});
			describe('windows', () => {
				beforeEach(() => {
					group.mode$.next('windows');
					fixture.detectChanges();
				});
				it('should be defined as property', () => {
					expect(directive.role).toBeUndefined();
				});
				it('should be defined as attribute', () => {
					expect(element.nativeElement.getAttribute('role')).toBe(null);
				});
			});
		});

		describe('tabindex', () => {
			it('should be defined as property', () => {
				expect(directive.tabindex).toBe(0);
			});
			it('should be defined as attribute', () => {
				expect(element.nativeElement.getAttribute('tabindex')).toBe('0');
			});
		});

		describe('cursor', () => {
			it('should be defined as property', () => {
				expect(directive.cursor).toBe('pointer');
			});
			it('should be defined as attribute', () => {
				expect(element.nativeElement.getAttribute('style')).toBe('cursor: pointer;');
			});
		});

		describe('selected', () => {
			it('should be defined as property', () => {
				expect(directive.selected).toBe(false);
			});

			describe('false', () => {
				beforeEach(() => {
					directive.selected = false;
				});
				it('should have an aria-checked attribute', () => {
					expect(element.nativeElement.getAttribute('aria-checked')).toBe('false');
				});

				it('should not have a class', () => {
					expect(element.nativeElement.classList).not.toContain('ob-selected');
				});
			});

			describe('true', () => {
				beforeEach(() => {
					directive.selected = true;
					fixture.detectChanges();
				});
				it('should have an aria-checked attribute', () => {
					expect(element.nativeElement.getAttribute('aria-checked')).toBe('true');
				});

				it('should not have a class', () => {
					expect(element.nativeElement.classList).toContain('ob-selected');
				});
			});
		});
	});

	describe('onclick', () => {
		it('should call preventDefault on passed event', () => {
			const event = {preventDefault: jest.fn()} as unknown as MouseEvent;
			directive.onClick(event);
			expect(event.preventDefault).toHaveBeenCalled();
		});
		it('should call toggle on group', () => {
			const event = {preventDefault: jest.fn()} as unknown as MouseEvent;
			directive.onClick(event);
			expect(group.toggle).toHaveBeenCalledWith(directive, undefined, undefined);
		});
		afterEach(() => {
			jest.clearAllMocks();
		});
	});

	describe('the parent ObSelectableGroupDirective is disabled', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObSelectableDirective],
				declarations: [ObMockDisabledSelectableGroupDirective, TestComponent],
				providers: [{provide: ObSelectableGroupDirective, useClass: ObMockDisabledSelectableGroupDirective}]
			});
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			element = fixture.debugElement.query(By.directive(ObSelectableDirective));
			directive = element.injector.get(ObSelectableDirective);
			group = fixture.debugElement.query(By.directive(ObMockDisabledSelectableGroupDirective)).injector.get(ObSelectableGroupDirective);
		});

		describe('onclick', () => {
			it('should not call toggle on group', () => {
				const event = {preventDefault: jest.fn()} as unknown as MouseEvent;
				directive.onClick(event);
				expect(group.toggle).toHaveBeenCalledTimes(0);
			});
		});

		afterEach(() => {
			jest.clearAllMocks();
		});
	});

	describe('focus', () => {
		it('should set the focus', () => {
			// @ts-expect-error
			jest.spyOn(directive.element.nativeElement, 'focus');
			directive.focus();
			// @ts-expect-error
			expect(directive.element.nativeElement.focus).toHaveBeenCalled();

			// NOTE: this test should only consist of the following 2 lines, but for some reason, since Angular 13, the focused element is always null in the tests (it works fine in the browser)
			// directive.focus();
			// expect(document.querySelector(':focus')).toEqual(element.nativeElement);
		});
	});

	describe('onFocus', () => {
		it('should call focus on group', () => {
			directive.onFocus();
			expect(group.focus).toHaveBeenCalled();
		});
	});
});
