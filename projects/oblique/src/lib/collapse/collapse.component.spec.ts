import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {OBLIQUE_COLLAPSE_ACTIVE, ObCollapseComponent} from './collapse.component';

@Component({
	template: `
		<ob-collapse></ob-collapse>
		<ob-collapse id="my-custom-id-for-test"></ob-collapse>
		<ob-collapse></ob-collapse>
	`
})
class TestCollapseComponent {}

describe('CollapseComponent', () => {
	let fixture: ComponentFixture<ObCollapseComponent>;
	let debugElement: DebugElement;
	let toggleElement: HTMLDivElement;
	let obCollapseComponent: ObCollapseComponent;

	describe('with token set to something truthy', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseComponent],
				imports: [NoopAnimationsModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [{provide: OBLIQUE_COLLAPSE_ACTIVE, useValue: 'yes'}]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObCollapseComponent);
			obCollapseComponent = fixture.componentInstance;
			debugElement = fixture.debugElement; // eslint-disable-line prefer-destructuring
			toggleElement = debugElement.query(By.css('.ob-collapse-toggle')).nativeElement;
			fixture.detectChanges();
		});

		it('should create ', () => {
			expect(obCollapseComponent).toBeTruthy();
		});

		it('should have a true active property', () => {
			expect(obCollapseComponent.active).toBe(true);
		});

		it('should change to active false on keydown with enter', () => {
			toggleElement.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter'}));

			expect(obCollapseComponent.active).toBe(false);
		});

		it('should change to active false on keydown with space', () => {
			toggleElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'}));

			expect(obCollapseComponent.active).toBe(false);
		});

		it('should have a true aria-expanded attribute', () => {
			expect(toggleElement.getAttribute('aria-expanded')).toBe('true');
		});
	});

	describe('with token set to something falsy', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseComponent],
				imports: [NoopAnimationsModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [{provide: OBLIQUE_COLLAPSE_ACTIVE, useValue: false}]
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

		it('should have a false active property ', () => {
			expect(obCollapseComponent.active).toBe(false);
		});

		it('should have a false aria-expanded property ', () => {
			expect(toggleElement.getAttribute('aria-expanded')).toBe('false');
		});
	});

	describe('without token', () => {
		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseComponent],
				imports: [NoopAnimationsModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(ObCollapseComponent);
			obCollapseComponent = fixture.componentInstance;
			debugElement = fixture.debugElement; // eslint-disable-line prefer-destructuring
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

		it('should change aria-expended to true on keydown with space', () => {
			toggleElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'}));
			fixture.detectChanges();

			expect(toggleElement.getAttribute('aria-expanded')).toBe('true');
		});

		it('should change aria-expended to true on keydown with enter', () => {
			toggleElement.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter'}));
			fixture.detectChanges();

			expect(toggleElement.getAttribute('aria-expanded')).toBe('true');
		});

		describe('active', () => {
			it('should emit ', () => {
				obCollapseComponent.active = true;
				obCollapseComponent.activeChange.subscribe(val => {
					expect(val).toBe(true);
				});
			});

			it('should be false ', () => {
				expect(obCollapseComponent.active).toBe(false);
			});

			it('should change to true on keydown with enter', () => {
				toggleElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'}));

				expect(obCollapseComponent.active).toBe(true);
			});

			it('should change to true on keydown with space', () => {
				toggleElement.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'}));

				expect(obCollapseComponent.active).toBe(true);
			});
		});

		describe('iconPosition should add the icon', () => {
			it('right', () => {
				obCollapseComponent.iconPosition = 'right';
				fixture.detectChanges();
				expect(debugElement.query(By.css('mat-icon:first-child'))).toBeTruthy();
			});
			it('left', () => {
				obCollapseComponent.iconPosition = 'left';
				fixture.detectChanges();
				expect(debugElement.query(By.css('mat-icon:last-child'))).toBeTruthy();
			});
			it('justified', () => {
				obCollapseComponent.iconPosition = 'justified';
				fixture.detectChanges();
				const div = debugElement.query(By.css('.ob-collapse-toggle')).nativeElement;
				expect(div.classList.contains('ob-toggle-justified')).toBe(true);
			});
		});

		it('should set t', () => {
			expect(obCollapseComponent.active).toBe(false);
		});

		describe('duration', () => {
			it('keep default duration', () => {
				obCollapseComponent.duration = undefined;
				expect(obCollapseComponent.time).toBe(600);
			});
			it('set slow duration', () => {
				obCollapseComponent.duration = 'slow';
				expect(obCollapseComponent.time).toBe(600);
			});
			it('set fast duration', () => {
				obCollapseComponent.duration = 'fast';
				expect(obCollapseComponent.time).toBe(250);
			});
			it('set custom duration', () => {
				obCollapseComponent.duration = 120;
				expect(obCollapseComponent.time).toBe(120);
			});
		});

		it('should set active to false', () => {
			const spy = jest.spyOn(obCollapseComponent, 'active', 'set');
			obCollapseComponent.active = true;
			expect(spy).toHaveBeenCalled();
			expect(obCollapseComponent.active).toBeTruthy();
			spy.mockRestore();
		});
	});

	describe('multipe collapses of which one has a custom Id', () => {
		let fixtureTestComponent: ComponentFixture<TestCollapseComponent>;

		beforeEach(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseComponent, TestCollapseComponent],
				imports: [NoopAnimationsModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA]
			}).compileComponents();
		});

		beforeEach(() => {
			ObCollapseComponent.index = 0;
			fixtureTestComponent = TestBed.createComponent(TestCollapseComponent);
			debugElement = fixtureTestComponent.debugElement; // eslint-disable-line prefer-destructuring
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
});
