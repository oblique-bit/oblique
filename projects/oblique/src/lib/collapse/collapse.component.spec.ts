import {ComponentFixture, TestBed, async} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {OBLIQUE_COLLAPSE_ACTIVE, ObCollapseComponent} from './collapse.component';

describe('CollapseComponent', () => {
	let fixture: ComponentFixture<ObCollapseComponent>;
	let component: ObCollapseComponent;

	describe('with token set to something truthy', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseComponent],
				imports: [NoopAnimationsModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [{provide: OBLIQUE_COLLAPSE_ACTIVE, useValue: 'yes'}]
			}).compileComponents();
		}));

		beforeEach(async(() => {
			fixture = TestBed.createComponent(ObCollapseComponent);
			fixture.detectChanges();
			component = fixture.componentInstance;
		}));

		it('should create ', async(() => {
			expect(component).toBeTruthy();
		}));

		it('should have a true active property', async(() => {
			expect(component.active).toBe(true);
		}));
	});

	describe('with token set to something falsy', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseComponent],
				imports: [NoopAnimationsModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [{provide: OBLIQUE_COLLAPSE_ACTIVE, useValue: false}]
			}).compileComponents();
		}));

		beforeEach(async(() => {
			fixture = TestBed.createComponent(ObCollapseComponent);
			fixture.detectChanges();
			component = fixture.componentInstance;
		}));

		it('should create ', async(() => {
			expect(component).toBeTruthy();
		}));

		it('should have a false active property ', async(() => {
			expect(component.active).toBe(false);
		}));
	});

	describe('without token', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseComponent],
				imports: [NoopAnimationsModule],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [{provide: OBLIQUE_COLLAPSE_ACTIVE, useValue: false}]
			}).compileComponents();
		}));

		beforeEach(async(() => {
			fixture = TestBed.createComponent(ObCollapseComponent);
			fixture.detectChanges();
			component = fixture.componentInstance;
		}));

		it('should create', async(() => {
			expect(component).toBeTruthy();
		}));

		describe('active', () => {
			it('should be false ', async(() => {
				expect(component.active).toBe(false);
			}));
			it('should emit ', async(() => {
				component.active = true;
				component.activeChange.subscribe(val => {
					expect(val).toBe(true);
				});
			}));
		});

		describe('iconPosition should add the icon', () => {
			it('right', () => {
				component.iconPosition = 'right';
				fixture.detectChanges();
				expect(fixture.debugElement.query(By.css('ob-icon:first-child'))).toBeTruthy();
			});
			it('left', () => {
				component.iconPosition = 'left';
				fixture.detectChanges();
				expect(fixture.debugElement.query(By.css('ob-icon:last-child'))).toBeTruthy();
			});
			it('justified', () => {
				component.iconPosition = 'justified';
				fixture.detectChanges();
				const div = fixture.debugElement.query(By.css('.ob-collapse-toggle')).nativeElement;
				expect(div.classList.contains('ob-toggle-justified')).toBe(true);
			});
		});

		it('should set t', async(() => {
			expect(component.active).toBe(false);
		}));

		describe('duration', () => {
			it('keep default duration', () => {
				component.duration = undefined;
				expect(component.time).toBe(600);
			});
			it('set slow duration', () => {
				component.duration = 'slow';
				expect(component.time).toBe(600);
			});
			it('set fast duration', () => {
				component.duration = 'fast';
				expect(component.time).toBe(250);
			});
			it('set custom duration', () => {
				component.duration = 120;
				expect(component.time).toBe(120);
			});
		});

		it('should set active to false', () => {
			const spy = jest.spyOn(component, 'active', 'set');
			component.active = true;
			expect(spy).toHaveBeenCalled();
			expect(component.active).toBeTruthy();
			spy.mockRestore();
		});
	});
});
