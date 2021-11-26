import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {WINDOW} from '../utilities';
import {ObTopControlComponent} from './top-control.component';
import {ObUseObliqueIcons} from '../icon/icon.model';

describe('ObTopControlComponent', () => {
	let fixture: ComponentFixture<ObTopControlComponent>;
	let topControlComponent: ObTopControlComponent;

	describe('with Window un-scrolled', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObTopControlComponent, ObMockTranslatePipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{provide: TranslateService, useClass: ObMockTranslateService},
					{provide: WINDOW, useValue: {scrollY: 0, scrollTo: jest.fn()}}
				]
			}).compileComponents();
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(ObTopControlComponent);
			topControlComponent = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(topControlComponent).toBeDefined();
		});

		it('should have ob-top-control class', () => {
			expect(fixture.debugElement.nativeElement.classList.contains('ob-top-control')).toBe(true);
		});

		it('should have ob-font-awesome class', () => {
			expect(fixture.debugElement.nativeElement.classList.contains('ob-font-awesome')).toBe(true);
		});

		describe('scrollTop', () => {
			it('should not scroll to top', () => {
				const window = TestBed.inject(WINDOW);
				topControlComponent.scrollTop();
				expect(window.scrollTo).not.toHaveBeenCalled();
			});
		});
	});

	describe('with Window scrolled', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObTopControlComponent, ObMockTranslatePipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{provide: TranslateService, useClass: ObMockTranslateService},
					{provide: WINDOW, useValue: {scrollY: 10, scrollTo: jest.fn()}}
				]
			}).compileComponents();
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(ObTopControlComponent);
			topControlComponent = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(topControlComponent).toBeDefined();
		});

		describe('scrollTop', () => {
			it('should scroll to top', () => {
				const window = TestBed.inject(WINDOW);
				topControlComponent.scrollTop();
				expect(window.scrollTo).toHaveBeenCalled();
			});
		});
	});

	describe('with ObUseObliqueIcons', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				declarations: [ObTopControlComponent, ObMockTranslatePipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{provide: TranslateService, useClass: ObMockTranslateService},
					{provide: ObUseObliqueIcons, useValue: true},
					{provide: WINDOW, useValue: window}
				]
			}).compileComponents();
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(ObTopControlComponent);
			topControlComponent = fixture.componentInstance;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(topControlComponent).toBeDefined();
		});

		it('should not have ob-font-awesome class', () => {
			expect(fixture.debugElement.nativeElement.classList.contains('ob-font-awesome')).toBe(false);
		});
	});
});
