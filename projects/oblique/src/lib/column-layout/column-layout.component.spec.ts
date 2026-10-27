import {By} from '@angular/platform-browser';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement, isSignal, signal} from '@angular/core';
import {provideObliqueTestingConfiguration} from '../utilities';
import {ObColumnLayoutComponent} from './column-layout.component';
import {
	ObColumnToggleDirective,
	ObColumnToggleDirective as ObRealColumnToggleDirective,
} from './column-toggle.directive';
import {ObColumnPanelDirective, ObColumnPanelDirective as ObRealColumnPanelDirective} from './column-panel.directive';
import {TranslatePipe} from '@ngx-translate/core';
import {ObTColumnState} from './column-layout.model';

type ResizeCallback = (entries: {contentRect: {height: number}}[]) => void;
const resizeCallbacks = new Map<Element | null, ResizeCallback>();

class ResizeObserver {
	constructor(public callback) {}
	observe(target: Element | null): void {
		resizeCallbacks.set(target, this.callback);
	}
	unobserve(): void {}
	disconnect(): void {}
}
window.ResizeObserver = ResizeObserver;

@Component({
	selector: 'ob-test',
	imports: [ObColumnLayoutComponent],
	template: `<ob-column-layout [left]="left()" [right]="right()" />`,
})
class TestComponent {
	left = signal<ObTColumnState>('NONE');
	right = signal<ObTColumnState>('NONE');
}

@Component({
	selector: 'ob-master-layout',
	standalone: true,
	template: `<div class="ob-master-layout-header"></div>
		<ng-content />`,
})
class MockMasterLayout {}

@Component({
	selector: 'ob-test-master-layout',
	imports: [ObColumnLayoutComponent, MockMasterLayout],
	template: `<ob-master-layout><ob-column-layout /></ob-master-layout>`,
})
class TestComponentMasterLayout {
	left = signal<ObTColumnState>('NONE');
	right = signal<ObTColumnState>('NONE');
}

describe(ObColumnLayoutComponent.name, () => {
	let component: ObColumnLayoutComponent;

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('with default inputs', () => {
		let fixture: ComponentFixture<ObColumnLayoutComponent>;
		let panels: ObColumnPanelDirective[];

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObColumnLayoutComponent, TranslatePipe],
				providers: [provideObliqueTestingConfiguration()],
			}).compileComponents();
		});

		beforeEach(() => {
			jest.useFakeTimers();
			fixture = TestBed.createComponent(ObColumnLayoutComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			jest.runOnlyPendingTimers();
			panels = fixture.debugElement
				.queryAll(By.directive(ObColumnPanelDirective))
				.map(element => element.injector.get(ObColumnPanelDirective));
		});

		test('that it is created', () => {
			expect(component).toBeTruthy();
		});

		test('that it can be destroyed before the view is initialized', () => {
			const uninitializedFixture = TestBed.createComponent(ObColumnLayoutComponent);

			expect(() => uninitializedFixture.componentInstance.ngOnDestroy()).not.toThrow();
		});

		test('that it contains columnLayout class', () => {
			expect(fixture.debugElement.nativeElement.classList).toContain('ob-column-layout');
		});

		describe.each([
			{property: 'wider', className: 'ob-wider-columns'},
			{property: 'noLayout', className: 'ob-no-layout'},
		])('property $property', ({property, className}) => {
			test('that it initializes to false', () => {
				expect(component[property]()).toBe(false);
			});

			test(`that "${className}" class is added when true`, () => {
				fixture.componentRef.setInput(property, true);
				fixture.detectChanges();
				expect(fixture.debugElement.nativeElement.classList).toContain(className);
			});

			test(`that "${className}" class is removed when false`, () => {
				fixture.componentRef.setInput(property, false);
				fixture.detectChanges();
				expect(fixture.debugElement.nativeElement.classList).not.toContain(className);
			});
		});

		describe.each([
			{property: 'leftCollapsed', initialValue: false, toggledValue: true, index: 0},
			{property: 'rightCollapsed', initialValue: false, toggledValue: true, index: 1},
		])('property $property', ({property, initialValue, toggledValue, index}) => {
			test('that it is an signal', () => {
				expect(isSignal(component[property])).toBe(true);
			});

			test(`that it initially emits "${initialValue}"`, () => {
				jest.runOnlyPendingTimers();
				expect(component[property]()).toEqual(initialValue);
			});

			test(`that it emits "${toggledValue}" after toggle has been toggled`, () => {
				panels[index].toggle();
				jest.runOnlyPendingTimers();
				expect(component[property]()).toEqual(toggledValue);
			});
		});

		describe.each([
			{method: 'toggleLeft', index: 0, panel: 'left'},
			{method: 'toggleRight', index: 1, panel: 'right'},
		])('method $method', ({method, index, panel}) => {
			test('that it updates panel collapsed', () => {
				jest.spyOn(panels[index], 'toggle');
				component[method]();
				fixture.changeDetectorRef.detectChanges();
				expect(panels[index].collapsed()).toEqual(true);
			});

			test('that it does not toggle the panel when panel is removed', () => {
				fixture.componentRef.setInput(panel, 'NONE');
				fixture.detectChanges();
				jest.spyOn(panels[index], 'toggle');
				component[method]();
				expect(panels[index].toggle).not.toHaveBeenCalled();
			});
		});

		describe.each(['left', 'right'])('%s toggle "top" property', toggleName => {
			let element: DebugElement;

			beforeEach(() => {
				jest.runOnlyPendingTimers();
				fixture.detectChanges();
				element = fixture.debugElement.query(By.css(`.ob-column-toggle-${toggleName}`));
			});

			test('that it is empty per default', () => {
				expect(element.nativeElement.style.top).toBe('');
			});

			describe('with a top value of 0', () => {
				it.each([
					{description: 'empty with a height of 0px', height: 0, top: ''},
					{description: 'half the height with a height less than window height', height: 1, top: '0.5px'},
					{description: 'half the height with a height less than window height', height: 767, top: '383.5px'},
					{description: 'half the height with a height equal to window height', height: 768, top: '384px'},
					{description: 'half the window height with a height bigger than window height', height: 769, top: '384px'},
				])('that it is $description', ({height, top}) => {
					jest.spyOn(fixture.debugElement.nativeElement, 'getBoundingClientRect').mockReturnValue({top: 0, height});
					component.ngDoCheck();
					fixture.detectChanges();
					expect(element.nativeElement.style.top).toBe(top);
				});
			});

			describe('with a top value of 10', () => {
				test.each([
					{description: 'empty with a height of 0px', height: 0, top: ''},
					{description: 'half the height with a height less than window height - top', height: 1, top: '0.5px'},
					{description: 'half the height with a height less than window height - top', height: 757, top: '378.5px'},
					{description: 'half the height with a height equal to window height - top', height: 758, top: '379px'},
					{
						description: 'half the (window height - top) with a height bigger than window height - top',
						height: 759,
						top: '379px',
					},
				])('that it is $description', ({height, top}) => {
					jest.spyOn(fixture.debugElement.nativeElement, 'getBoundingClientRect').mockReturnValue({top: 10, height});
					component.ngDoCheck();
					fixture.detectChanges();
					expect(element.nativeElement.style.top).toBe(top);
				});
			});

			describe('with a resize of the layout', () => {
				test('that it is centered on the new height without a change detection', () => {
					jest
						.spyOn(fixture.debugElement.nativeElement, 'getBoundingClientRect')
						.mockReturnValue({top: 0, height: 100});
					resizeCallbacks.get(fixture.debugElement.nativeElement)([{contentRect: {height: 100}}]);
					expect(element.nativeElement.style.top).toBe('50px');
				});

				test('that it is centered on the new top of the layout', () => {
					jest
						.spyOn(fixture.debugElement.nativeElement, 'getBoundingClientRect')
						.mockReturnValue({top: 10, height: 759});
					resizeCallbacks.get(fixture.debugElement.nativeElement)([{contentRect: {height: 759}}]);
					expect(element.nativeElement.style.top).toBe('379px');
				});
			});
		});
	});

	describe('with custom inputs', () => {
		let fixture: ComponentFixture<TestComponent>;
		let testComponent: TestComponent;

		beforeEach(async () => {
			TestBed.overrideComponent(ObColumnLayoutComponent, {
				remove: {imports: [ObRealColumnPanelDirective, ObRealColumnToggleDirective]},
				add: {imports: [ObColumnPanelDirective, ObColumnToggleDirective]},
			});
			await TestBed.configureTestingModule({
				imports: [ObColumnLayoutComponent, TranslatePipe, TestComponent],
				providers: [provideObliqueTestingConfiguration()],
			}).compileComponents();
		});

		beforeEach(() => {
			jest.useFakeTimers();
			fixture = TestBed.createComponent(TestComponent);
			testComponent = fixture.componentInstance;
			component = fixture.debugElement
				.query(By.directive(ObColumnLayoutComponent))
				.injector.get(ObColumnLayoutComponent);
			fixture.detectChanges();
			jest.runOnlyPendingTimers();
		});

		test('that the test component is created', () => {
			expect(testComponent).toBeTruthy();
		});

		test('that the column layout component is created', () => {
			expect(component).toBeTruthy();
		});

		describe.each(['toggleLeftIcon$', 'toggleRightIcon$'])('property %s unchanged', property => {
			test('that it is not defined', () => {
				expect(component[property]).toBeUndefined();
			});
		});

		describe.each([
			{property: 'leftCollapsed', initialValue: false, toggledValue: true, index: 0},
			{property: 'rightCollapsed', initialValue: false, toggledValue: true, index: 1},
		])('property $property changed back', ({property, initialValue, toggledValue, index}) => {
			let panels: ObColumnPanelDirective[];

			beforeEach(() => {
				testComponent.left.set('OPENED');
				testComponent.right.set('OPENED');
				fixture.detectChanges();
				jest.runOnlyPendingTimers();

				panels = fixture.debugElement
					.queryAll(By.directive(ObColumnPanelDirective))
					.map(element => element.injector.get(ObColumnPanelDirective));
			});

			test('that it is a signal', () => {
				expect(isSignal(component[property])).toBe(true);
			});

			test(`that it initially emits "${initialValue}"`, () => {
				jest.runOnlyPendingTimers();
				expect(component[property]()).toEqual(initialValue);
			});

			test(`that it emits "${toggledValue}" after toggle has been toggled`, () => {
				panels[index].toggle();
				jest.runOnlyPendingTimers();
				expect(component[property]()).toEqual(toggledValue);
			});
		});
	});

	describe('with change to the header height', () => {
		let fixture: ComponentFixture<TestComponentMasterLayout>;
		let element: DebugElement;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObColumnLayoutComponent, TranslatePipe, TestComponentMasterLayout],
				providers: [provideObliqueTestingConfiguration()],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponentMasterLayout);
			fixture.detectChanges();
			component = fixture.debugElement
				.query(By.directive(ObColumnLayoutComponent))
				.injector.get(ObColumnLayoutComponent);
		});

		describe('property top', () => {
			beforeEach(() => {
				fixture.detectChanges();
				element = fixture.debugElement.query(By.css('.ob-column-toggle-left'));
			});

			test.each([
				{
					description: 'half the sum of the element and header heights with a smaller header height',
					height: 49,
					top: '49.5px',
				},
				{description: 'empty with the header height equal to the element height', height: 50, top: ''},
				{description: 'empty with the header height greater than the element height', height: 51, top: ''},
			])('that it is $description', ({height, top}) => {
				resizeCallbacks.get(fixture.debugElement.query(By.css('.ob-master-layout-header')).nativeElement)([
					{contentRect: {height}},
				]);
				jest
					.spyOn(fixture.debugElement.query(By.css('ob-column-layout')).nativeElement, 'getBoundingClientRect')
					.mockReturnValue({
						top: 0,
						height: 50,
					});
				component.ngDoCheck();
				fixture.detectChanges();
				expect(element.nativeElement.style.top).toBe(top);
			});
		});
	});
});
