import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import {ObCollapseComponent, OBLIQUE_COLLAPSE_ACTIVE} from './collapse.component';

describe('CollapseComponent', () => {
	let fixture: ComponentFixture<ObCollapseComponent>;
	let component: ObCollapseComponent;

	describe('with token set to something truthy', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				declarations: [ObCollapseComponent],
				imports: [NoopAnimationsModule],
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

		describe('direction should set a class', () => {
			it('without direction', () => {
				const div = fixture.debugElement.query(By.css('.toggle')).nativeElement;
				expect(div.classList.contains('toggle-down-up')).toBe(true);
			});
			it('with left-right direction', () => {
				component.direction = 'left-right';
				fixture.detectChanges();
				const div = fixture.debugElement.query(By.css('.toggle')).nativeElement;
				expect(div.classList.contains('toggle-left-right')).toBe(true);
			});
		});

		describe('iconPosition should set a class', () => {
			it('right', () => {
				component.iconPosition = 'right';
				fixture.detectChanges();
				const div = fixture.debugElement.query(By.css('.toggle')).nativeElement;
				expect(div.classList.contains('toggle-after')).toBe(true);
			});
			it('left', () => {
				component.iconPosition = 'left';
				fixture.detectChanges();
				const div = fixture.debugElement.query(By.css('.toggle')).nativeElement;
				expect(div.classList.contains('toggle-after')).toBe(false);
			});
			it('justified', () => {
				component.iconPosition = 'justified';
				fixture.detectChanges();
				const div = fixture.debugElement.query(By.css('.toggle')).nativeElement;
				expect(div.classList.contains('toggle-justified')).toBe(true);
			});
		});

		it('should set t', async(() => {
			expect(component.active).toBe(false);
		}));

		describe('ngOnChanges', () => {
			it('let default duration', () => {
				component.ngOnChanges();
				expect(component.time).toBe(600);
			});
			it('set slow duration', () => {
				component.duration = 'slow';
				component.ngOnChanges();
				expect(component.time).toBe(600);
			});
			it('set fast duration', () => {
				component.duration = 'fast';
				component.ngOnChanges();
				expect(component.time).toBe(250);
			});
			it('set custom duration', () => {
				component.duration = 120;
				component.ngOnChanges();
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
