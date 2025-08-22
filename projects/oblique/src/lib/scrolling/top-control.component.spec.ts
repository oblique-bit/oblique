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
});
