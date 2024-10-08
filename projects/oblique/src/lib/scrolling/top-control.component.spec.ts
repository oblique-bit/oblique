import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {WINDOW} from '../utilities';
import {ObTopControlComponent} from './top-control.component';
import {Observable} from 'rxjs';

describe('ObTopControlComponent', () => {
	let fixture: ComponentFixture<ObTopControlComponent>;
	let topControlComponent: ObTopControlComponent;

	describe('without a scrollTarget', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObTopControlComponent, ObMockTranslatePipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{provide: TranslateService, useClass: ObMockTranslateService},
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

		it('should have ob-top-control class', () => {
			expect(fixture.debugElement.nativeElement.classList.contains('ob-top-control')).toBe(true);
		});

		describe('scrollToTop', () => {
			it('should be an observable', () => {
				expect(topControlComponent.scrollToTop instanceof Observable).toBe(true);
			});
			it('should emit when scrollTop is called', () => {
				jest.spyOn(topControlComponent.scrollToTop, 'emit');
				topControlComponent.scrollTop();
				expect(topControlComponent.scrollToTop.emit).toHaveBeenCalledWith();
			});
		});

		describe('scrollTop', () => {
			it('should not scroll', () => {
				topControlComponent.scrollTop();
				expect(topControlComponent.scrollTarget).toBeUndefined();
			});
			it('should emit', () => {
				topControlComponent.scrollTop();
				expect(topControlComponent.scrollTarget).toBeUndefined();
			});
		});
	});

	describe('with a scrollTarget', () => {
		beforeEach(waitForAsync(() => {
			TestBed.configureTestingModule({
				imports: [ObTopControlComponent, ObMockTranslatePipe],
				schemas: [CUSTOM_ELEMENTS_SCHEMA],
				providers: [
					{provide: TranslateService, useClass: ObMockTranslateService},
					{provide: WINDOW, useValue: window}
				]
			}).compileComponents();
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(ObTopControlComponent);
			topControlComponent = fixture.componentInstance;
			topControlComponent.scrollTarget = {scrollTo: jest.fn()} as unknown as HTMLElement;
			fixture.detectChanges();
		});

		it('should create', () => {
			expect(topControlComponent).toBeDefined();
		});

		describe('scrollTop', () => {
			it('should call target.scrollTo', () => {
				topControlComponent.scrollTop();
				expect(topControlComponent.scrollTarget.scrollTo).toHaveBeenCalledWith({top: 0, behavior: 'smooth'});
			});
		});
	});
});
