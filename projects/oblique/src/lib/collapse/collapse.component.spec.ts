import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, Component, DebugElement, signal} from '@angular/core';
import {By} from '@angular/platform-browser';
import {WINDOW} from '../window/window.provider';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {
	OBLIQUE_COLLAPSE_ACTIVE,
	OBLIQUE_COLLAPSE_DURATION,
	OBLIQUE_COLLAPSE_ICON_POSITION,
	ObCollapseComponent,
} from './collapse.component';
import {MatIconTestingModule} from '@angular/material/icon/testing';

@Component({
	standalone: false,
	template: `
		<ob-collapse />
		<ob-collapse id="my-custom-id-for-test" />
		<ob-collapse />
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
})
class TestCollapseComponent {}

@Component({
	standalone: false,
	template: '<ob-collapse [(active)]="active" (activeChange)="activeChanges.push($event)" />',
})
class TestCollapseBindingComponent {
	readonly active = signal(false);
	activeChanges: boolean[] = [];
}

describe(ObCollapseComponent.name, () => {
	let fixture: ComponentFixture<ObCollapseComponent>;
	let debugElement: DebugElement;
	let toggleElement: HTMLDivElement;
	let obCollapseComponent: ObCollapseComponent;
	const stabilize = async (): Promise<void> => {
		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	};

	describe('with token set to something truthy', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObCollapseComponent, MatIconTestingModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{provide: OBLIQUE_COLLAPSE_ACTIVE, useValue: 'yes'},
					{provide: OBLIQUE_COLLAPSE_DURATION, useValue: 'fast'},
					{provide: OBLIQUE_COLLAPSE_ICON_POSITION, useValue: 'right'},
					{provide: WINDOW, useValue: window},
					ObGlobalEventsService,
				],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObCollapseComponent);
			obCollapseComponent = fixture.componentInstance;
			debugElement = fixture.debugElement;
			toggleElement = debugElement.query(By.css('.ob-collapse-toggle')).nativeElement;
			fixture.detectChanges();
		});

		it('should create ', () => {
			expect(obCollapseComponent).toBeTruthy();
		});

		it('should have a true active signal', () => {
			expect(obCollapseComponent.active()).toBe(true);
		});

		it('should have iconPosition property set to "right"', () => {
			expect(obCollapseComponent.iconPosition()).toBe('right');
		});

		it('should use the duration token', () => {
			expect(obCollapseComponent.time()).toBe(250);
		});

		it('should change to active false on keydown with enter', () => {
			toggleElement.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter'}));

			expect(obCollapseComponent.active()).toBe(false);
		});

		it('should change to active false on keydown with space', () => {
			toggleElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'}));

			expect(obCollapseComponent.active()).toBe(false);
		});

		it('should have a true aria-expanded attribute', () => {
			expect(toggleElement.getAttribute('aria-expanded')).toBe('true');
		});
	});

	describe('with token set to something falsy', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObCollapseComponent, MatIconTestingModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{provide: OBLIQUE_COLLAPSE_ACTIVE, useValue: false},
					{provide: WINDOW, useValue: window},
					ObGlobalEventsService,
				],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObCollapseComponent);
			obCollapseComponent = fixture.componentInstance;
			toggleElement = fixture.debugElement.query(By.css('.ob-collapse-toggle')).nativeElement;
			fixture.detectChanges();
		});

		it('should create ', () => {
			expect(obCollapseComponent).toBeTruthy();
		});

		it('should have a false active signal', () => {
			expect(obCollapseComponent.active()).toBe(false);
		});

		it('should have iconPosition property set to "left"', () => {
			expect(obCollapseComponent.iconPosition()).toBe('left');
		});

		it('should have a false aria-expanded property ', () => {
			expect(toggleElement.getAttribute('aria-expanded')).toBe('false');
		});
	});

	describe('without token', () => {
		beforeEach(async () => {
			await TestBed.configureTestingModule({
				imports: [ObCollapseComponent, MatIconTestingModule],
				declarations: [TestCollapseBindingComponent],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [{provide: WINDOW, useValue: window}, ObGlobalEventsService],
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObCollapseComponent);
			obCollapseComponent = fixture.componentInstance;
			debugElement = fixture.debugElement;
			toggleElement = debugElement.query(By.css('.ob-collapse-toggle')).nativeElement;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(obCollapseComponent).toBeTruthy();
		});

		it('should have a tabindex property ', () => {
			expect(toggleElement.getAttribute('tabindex')).toBe('0');
		});

		it('should have aria-controls content of ob-collapse-toggle as id of ob-collapse-content div', () => {
			const ariaControlsElement = toggleElement.getAttribute('aria-controls');

			expect(debugElement.query(By.css(`#${ariaControlsElement}`))).toBeDefined();
		});

		it('should have a false aria-expanded attribute ', () => {
			expect(toggleElement.getAttribute('aria-expanded')).toBe('false');
		});

		it('should change aria-expended to true on keydown with space', async () => {
			toggleElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'}));
			fixture.componentRef.setInput('active', obCollapseComponent.active());
			await stabilize();

			expect(toggleElement.getAttribute('aria-expanded')).toBe('true');
		});

		it('should change aria-expended to true on keydown with enter', async () => {
			toggleElement.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter'}));
			fixture.componentRef.setInput('active', obCollapseComponent.active());
			await stabilize();

			expect(toggleElement.getAttribute('aria-expanded')).toBe('true');
		});

		describe('active', () => {
			it('should bind active two ways and emit activeChange', () => {
				const bindingFixture = TestBed.createComponent(TestCollapseBindingComponent);
				const bindingComponent = bindingFixture.componentInstance;

				bindingFixture.detectChanges();
				const bindingCollapse = bindingFixture.debugElement.query(By.directive(ObCollapseComponent));
				bindingCollapse.componentInstance.toggleActive();
				bindingFixture.detectChanges();

				expect(bindingComponent.active()).toBe(true);
				expect(bindingComponent.activeChanges).toEqual([true]);

				bindingComponent.active.set(false);
				bindingFixture.detectChanges();

				expect(bindingCollapse.componentInstance.active()).toBe(false);
				expect(bindingComponent.activeChanges).toEqual([true]);
			});

			it('should be false ', () => {
				expect(obCollapseComponent.active()).toBe(false);
			});

			it('should toggle active', () => {
				obCollapseComponent.toggleActive();
				expect(obCollapseComponent.active()).toBe(true);

				obCollapseComponent.toggleActive();
				expect(obCollapseComponent.active()).toBe(false);
			});

			it('should change to true on keydown with enter', () => {
				toggleElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'}));

				expect(obCollapseComponent.active()).toBe(true);
			});

			it('should change to true on keydown with space', () => {
				toggleElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'}));

				expect(obCollapseComponent.active()).toBe(true);
			});
		});

		describe('iconPosition should add the icon', () => {
			it('right', () => {
				fixture.componentRef.setInput('iconPosition', 'right');
				fixture.detectChanges();
				expect(debugElement.query(By.css('mat-icon:first-child'))).toBeTruthy();
			});
			it('left', () => {
				fixture.componentRef.setInput('iconPosition', 'left');
				fixture.detectChanges();
				expect(debugElement.query(By.css('mat-icon:last-child'))).toBeTruthy();
			});
			it('justified', async () => {
				fixture.componentRef.setInput('iconPosition', 'justified');
				await stabilize();
				const div = debugElement.query(By.css('.ob-collapse-toggle')).nativeElement;
				expect(div.classList.contains('ob-toggle-justified')).toBe(true);
			});
		});

		it('should set t', () => {
			expect(obCollapseComponent.active()).toBe(false);
		});

		describe('duration', () => {
			it('keep default duration', async () => {
				fixture.componentRef.setInput('duration', undefined);
				await stabilize();
				expect(obCollapseComponent.time()).toBe(600);
			});
			it('uses the default duration for zero', async () => {
				fixture.componentRef.setInput('duration', 0);
				await stabilize();

				expect(obCollapseComponent.time()).toBe(600);
			});
			it('set slow duration', async () => {
				fixture.componentRef.setInput('duration', 'slow');
				await stabilize();
				expect(obCollapseComponent.time()).toBe(600);
			});
			it('set fast duration', async () => {
				fixture.componentRef.setInput('duration', 'fast');
				await stabilize();
				expect(obCollapseComponent.time()).toBe(250);
			});
			it('set custom duration', async () => {
				fixture.componentRef.setInput('duration', 120);
				await stabilize();
				expect(obCollapseComponent.time()).toBe(120);
			});
		});

		it('should set active to true', () => {
			obCollapseComponent.active.set(true);
			expect(obCollapseComponent.active()).toBe(true);
		});
	});

	describe('multiple collapses of which one has a custom Id', () => {
		let fixtureTestComponent: ComponentFixture<TestCollapseComponent>;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [TestCollapseComponent],
				imports: [ObCollapseComponent, MatIconTestingModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [{provide: WINDOW, useValue: window}, ObGlobalEventsService],
			}).compileComponents();
		});

		beforeEach(() => {
			ObCollapseComponent.index = 0;
			fixtureTestComponent = TestBed.createComponent(TestCollapseComponent);
			debugElement = fixtureTestComponent.debugElement;
			fixtureTestComponent.detectChanges();
		});

		it('should have the first id be "collapse-0-toggle" ', () => {
			const firstId = debugElement.queryAll(By.css('.ob-collapse-toggle'))[0].nativeElement.getAttribute('id');

			expect(firstId).toBe('collapse-0-toggle');
		});

		it('should have the custom set id "my-custom-id-for-test" ', () => {
			const secondId = debugElement.queryAll(By.css('.ob-collapse-toggle'))[1].nativeElement.getAttribute('id');

			expect(secondId).toBe('my-custom-id-for-test-toggle');
		});

		it('should have the third id be "collapse-2-toggle" ', () => {
			const thirdId = debugElement.queryAll(By.css('.ob-collapse-toggle'))[2].nativeElement.getAttribute('id');

			expect(thirdId).toBe('collapse-2-toggle');
		});

		it('should not have duplicate ids', () => {
			const allCollapse: DebugElement[] = debugElement.queryAll(By.css('.ob-collapse-toggle'));
			const toFindDuplicates = (debugElements: DebugElement[]): DebugElement[] =>
				debugElements.filter((item, index) => debugElements.indexOf(item) !== index);
			const duplicates = toFindDuplicates(allCollapse);
			expect(duplicates.length).toBe(0);
		});
	});

	describe('with actual content', () => {
		let fixtureTestComponent: ComponentFixture<TestCollapseComponent>;
		let element: HTMLDivElement;

		beforeEach(async () => {
			await TestBed.configureTestingModule({
				declarations: [TestCollapseComponent],
				imports: [ObCollapseComponent, MatIconTestingModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [{provide: WINDOW, useValue: window}, ObGlobalEventsService],
			})
				.overrideTemplate(
					TestCollapseComponent,
					`<ob-collapse><span obCollapseHeader>Title</span><div obCollapseMain>Content</div></ob-collapse>`
				)
				.compileComponents();

			fixtureTestComponent = TestBed.createComponent(TestCollapseComponent);
			const collapseDebugElement = fixtureTestComponent.debugElement.query(By.directive(ObCollapseComponent));
			obCollapseComponent = collapseDebugElement.componentInstance;
			element = fixtureTestComponent.debugElement.query(By.css('[obCollapseMain]')).nativeElement;
			Object.defineProperty(element, 'scrollHeight', {value: 42, configurable: true}); // necessary because jsdom ignores scrollHeight
			fixtureTestComponent.detectChanges();
		});

		it('should set contentHeight to 0 when inactive', () => {
			obCollapseComponent.active.set(false);
			fixtureTestComponent.detectChanges();
			expect(obCollapseComponent.contentHeight()).toBe(0);
		});

		it('should set contentHeight to 42 when active', async () => {
			obCollapseComponent.active.set(true);
			fixtureTestComponent.detectChanges();
			await fixtureTestComponent.whenStable();
			expect(obCollapseComponent.contentHeight()).toBe(42);
		});

		it('should recompute the height when the viewport is resized', async () => {
			obCollapseComponent.active.set(true);
			fixtureTestComponent.detectChanges();
			await fixtureTestComponent.whenStable();
			Object.defineProperty(element, 'scrollHeight', {value: 420, configurable: true});
			window.dispatchEvent(new Event('resize'));
			await fixtureTestComponent.whenStable();
			expect(obCollapseComponent.contentHeight()).toBe(420);
		});

		it('should keep contentHeight when the viewport resize does not change it', async () => {
			obCollapseComponent.active.set(true);
			fixtureTestComponent.detectChanges();
			await fixtureTestComponent.whenStable();

			Object.defineProperty(element, 'scrollHeight', {value: 42, configurable: true});
			window.dispatchEvent(new Event('resize'));
			await fixtureTestComponent.whenStable();

			expect(obCollapseComponent.contentHeight()).toBe(42);
		});
	});
});
