import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {Component, DebugElement, Directive, EventEmitter, Output} from '@angular/core';
import {By} from '@angular/platform-browser';
import {Observable} from 'rxjs';
import {skip} from 'rxjs/operators';
import {WINDOW} from '../utilities';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObColumnLayoutComponent} from './column-layout.component';

let resizerCallback;
class ResizeObserver {
	constructor(public callback) {
		resizerCallback = callback;
	}
	observe(): void {}
	unobserve(): void {}
	disconnect(): void {}
}
window.ResizeObserver = ResizeObserver;

@Directive({
	selector: '[obColumnPanel]',
	exportAs: 'obColumnPanel'
})
class ObColumnPanelDirective {
	collapsed = false;
	@Output() readonly toggled = new EventEmitter<boolean>();

	toggle(): void {
		this.collapsed = !this.collapsed;
		this.toggled.emit(this.collapsed);
	}
}

@Component({
	template: `<ob-column-layout [left]="false" [right]="false" />`
})
class TestComponent {}

describe(ObColumnLayoutComponent.name, () => {
	let component: ObColumnLayoutComponent;

	describe('with default inputs', () => {
		let fixture: ComponentFixture<ObColumnLayoutComponent>;
		let panels: ObColumnPanelDirective[];

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [ObMockTranslatePipe],
				declarations: [ObColumnLayoutComponent, ObColumnPanelDirective],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObColumnLayoutComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
			panels = fixture.debugElement
				.queryAll(By.directive(ObColumnPanelDirective))
				.map(element => element.injector.get(ObColumnPanelDirective));
		});

		test('that it is created', () => {
			expect(component).toBeTruthy();
		});

		test('that it contains columnLayout class', () => {
			expect(fixture.debugElement.nativeElement.classList).toContain('ob-column-layout');
		});

		describe.each([
			{property: 'wider', className: 'ob-wider-columns'},
			{property: 'noLayout', className: 'ob-no-layout'}
		])('property $property', ({property, className}) => {
			test('that it initializes to false', () => {
				expect(component[property]).toBe(false);
			});

			test(`that "${className}" class is added when true`, () => {
				component[property] = true;
				fixture.detectChanges();
				expect(fixture.debugElement.nativeElement.classList).toContain(className);
			});

			test(`that "${className}" class is removed when false`, () => {
				component[property] = false;
				fixture.detectChanges();
				expect(fixture.debugElement.nativeElement.classList).not.toContain(className);
			});
		});

		describe.each([
			{property: 'toggleLeftIcon$', initialValue: 'left', toggledValue: 'right', index: 0},
			{property: 'toggleRightIcon$', initialValue: 'right', toggledValue: 'left', index: 1}
		])('property $property', ({property, initialValue, toggledValue, index}) => {
			test('that it is an observable', () => {
				expect(component[property] instanceof Observable).toBe(true);
			});

			test(`that it initially emits "${initialValue}"`, done => {
				component[property].subscribe(value => {
					expect(value).toBe(initialValue);
					done();
				});
			});

			test(`that it emits "${toggledValue}" after toggle has been toggled`, done => {
				component[property].pipe(skip(1)).subscribe(value => {
					expect(value).toBe(toggledValue);
					done();
				});
				panels[index].toggle();
			});
		});

		describe.each([
			{method: 'toggleLeft', index: 0, panel: 'left'},
			{method: 'toggleRight', index: 1, panel: 'right'}
		])('method $method', ({method, index, panel}) => {
			test('that it toggles the panel', () => {
				jest.spyOn(panels[index], 'toggle');
				component[method]();
				expect(panels[index].toggle).toHaveBeenCalled();
			});

			test('that it does not toggle the panel when panel is removed', () => {
				component[panel] = false;
				fixture.detectChanges();
				jest.spyOn(panels[index], 'toggle');
				component[method]();
				expect(panels[index].toggle).not.toHaveBeenCalled();
			});
		});

		describe.each(['left', 'right'])('%s toggle "top" property', toggleName => {
			let element: DebugElement;

			beforeEach(done => {
				component.toggleLeftIcon$.subscribe(() => {
					fixture.detectChanges();
					element = fixture.debugElement.query(By.css(`.ob-column-toggle-${toggleName}`));
					done();
				});
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
					{description: 'half the window height with a height bigger than window height', height: 769, top: '384px'}
				])('that it is $description', ({height, top}) => {
					jest.spyOn(fixture.debugElement.nativeElement, 'getBoundingClientRect').mockReturnValue({top: 0, height, windowHeight: 768});
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
					{description: 'half the (window height - top) with a height bigger than window height - top', height: 759, top: '379px'}
				])('that it is $description', ({height, top}) => {
					jest.spyOn(fixture.debugElement.nativeElement, 'getBoundingClientRect').mockReturnValue({top: 10, height, windowHeight: 768});
					component.ngDoCheck();
					fixture.detectChanges();
					expect(element.nativeElement.style.top).toBe(top);
				});
			});
		});
	});

	describe('with custom inputs', () => {
		let fixture: ComponentFixture<TestComponent>;
		let testComponent: TestComponent;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [ObMockTranslatePipe],
				declarations: [TestComponent, ObColumnLayoutComponent, ObColumnPanelDirective],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(TestComponent);
			testComponent = fixture.componentInstance;
			component = fixture.debugElement.query(By.directive(ObColumnLayoutComponent)).injector.get(ObColumnLayoutComponent);
			component.left = false;
			component.right = false;
			fixture.detectChanges();
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
			{property: 'toggleLeftIcon$', initialValue: 'left', toggledValue: 'right', index: 0},
			{property: 'toggleRightIcon$', initialValue: 'right', toggledValue: 'left', index: 1}
		])('property $property changed back', ({property, initialValue, toggledValue, index}) => {
			let panels: ObColumnPanelDirective[];

			beforeEach(fakeAsync(() => {
				component.left = true;
				component.right = true;
				component.ngOnChanges();
				fixture.detectChanges();
				tick();

				panels = fixture.debugElement
					.queryAll(By.directive(ObColumnPanelDirective))
					.map(element => element.injector.get(ObColumnPanelDirective));
			}));

			test('that it is an observable', () => {
				expect(component[property] instanceof Observable).toBe(true);
			});

			test(`that it initially emits "${initialValue}"`, done => {
				component[property].subscribe(value => {
					expect(value).toBe(initialValue);
					done();
				});
			});

			test(`that it emits "${toggledValue}" after toggle has been toggled`, done => {
				component[property].pipe(skip(1)).subscribe(value => {
					expect(value).toBe(toggledValue);
					done();
				});
				panels[index].toggle();
			});
		});
	});

	describe('with change to the header height', () => {
		let element: DebugElement;
		let fixture: ComponentFixture<TestComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [ObMockTranslatePipe],
				declarations: [TestComponent, ObColumnLayoutComponent, ObColumnPanelDirective],
				providers: [{provide: WINDOW, useValue: window}]
			}).compileComponents();
		});

		beforeEach(() => {
			TestBed.overrideTemplate(
				TestComponent,
				`<ob-master-layout><div class="ob-master-layout-header"></div><ob-column-layout></ob-column-layout></ob-master-layout>`
			);
			fixture = TestBed.createComponent(TestComponent);
			component = fixture.debugElement.query(By.directive(ObColumnLayoutComponent)).injector.get(ObColumnLayoutComponent);
			fixture.detectChanges();
		});

		describe('property top', () => {
			beforeEach(done => {
				component.toggleLeftIcon$.subscribe(() => {
					fixture.detectChanges();
					element = fixture.debugElement.query(By.css(`.ob-column-toggle-left`));
					done();
				});
			});

			test.each([
				{description: 'half the sum of the element and header heights with a smaller header height', height: 49, top: '49.5px'},
				{description: 'empty with the header height equal to the element height', height: 50, top: ''},
				{description: 'empty with the header height greater than the element height', height: 51, top: ''}
			])('that it is $description', ({height, top}) => {
				resizerCallback([{contentRect: {height}}]);
				jest
					.spyOn(fixture.debugElement.query(By.css('ob-column-layout')).nativeElement, 'getBoundingClientRect')
					.mockReturnValue({top: 0, height: 50, windowHeight: 768});
				component.ngDoCheck();
				expect(element.nativeElement.style.top).toBe(top);
			});
		});
	});
});
