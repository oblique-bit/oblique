import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {ObMasterLayoutFooterComponent} from './master-layout-footer.component';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {WINDOW} from '../../utilities';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';

describe('ObMasterLayoutFooterComponent', () => {
	let component: ObMasterLayoutFooterComponent;
	let fixture: ComponentFixture<ObMasterLayoutFooterComponent>;
	const mockMasterLayoutService = {
		footer: {configEvents$: new Subject<ObIMasterLayoutEvent>()}
	};

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [ObMockTranslatePipe, RouterTestingModule],
			declarations: [ObMasterLayoutFooterComponent],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObMasterLayoutService, useValue: mockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useValue: {homePageRoute: 'home', footer: {hasLogoOnScroll: false, isCustom: false}}},
				{provide: WINDOW, useValue: window}
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMasterLayoutFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have ob-master-layout-footer class', () => {
		expect(fixture.debugElement.nativeElement.classList.contains('ob-master-layout-footer')).toBe(true);
	});

	it('should have a home property', () => {
		expect(component.home).toBe('home');
	});

	describe('isCustom', () => {
		it('should be defined', () => {
			expect(component.isCustom).toBe(false);
		});

		it('should be updated with the service', () => {
			mockMasterLayoutService.footer.configEvents$.next({name: ObEMasterLayoutEventValues.FOOTER_IS_CUSTOM, value: true});
			expect(component.isCustom).toBe(true);
		});
	});

	describe('hasLogoOnScroll', () => {
		it('should be defined', () => {
			expect(component.hasLogoOnScroll).toBe(false);
		});

		it('should be updated with the service', () => {
			mockMasterLayoutService.footer.configEvents$.next({name: ObEMasterLayoutEventValues.FOOTER_HAS_LOGO_ON_SCROLL, value: true});
			expect(component.hasLogoOnScroll).toBe(true);
		});
	});
});
