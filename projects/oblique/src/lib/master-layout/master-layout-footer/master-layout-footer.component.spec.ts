import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Subject} from 'rxjs';
import {ObMasterLayoutFooterComponent} from './master-layout-footer.component';
import {OB_HAS_LANGUAGE_IN_URL, provideObliqueTestingConfiguration} from '../../utilities';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObLocalizePipe} from '../../router/ob-localize.pipe';
import {TranslateModule} from '@ngx-translate/core';

describe('ObMasterLayoutFooterComponent', () => {
	let component: ObMasterLayoutFooterComponent;
	let fixture: ComponentFixture<ObMasterLayoutFooterComponent>;
	const mockMasterLayoutService = {
		footer: {configEvents$: new Subject<ObIMasterLayoutEvent>()}
	};

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, ObLocalizePipe, TranslateModule],
			declarations: [ObMasterLayoutFooterComponent],
			providers: [
				provideObliqueTestingConfiguration(),
				{provide: ObMasterLayoutService, useValue: mockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useValue: {homePageRoute: 'home', footer: {isCustom: false}, locale: {locales: ['en']}}},
				{provide: OB_HAS_LANGUAGE_IN_URL, useValue: true}
			]
		}).compileComponents();
	});

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
});
