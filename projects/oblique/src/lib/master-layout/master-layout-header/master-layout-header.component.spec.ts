import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CUSTOM_ELEMENTS_SCHEMA, DebugElement} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EMPTY, Observable, Subject} from 'rxjs';
import {ObMockTranslatePipe} from '../../_mocks/mock-translate.pipe';
import {WINDOW} from '../../utilities';
import {ObMockGlobalEventsService} from '../../global-events/_mocks/mock-global-events.service';
import {ObMasterLayoutHeaderComponent} from './master-layout-header.component';
import {ObMockTranslateService} from '../../_mocks/mock-translate.service';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObMockMasterLayoutConfig} from '../_mocks/mock-master-layout.config';
import {ObMockScrollingEvents} from '../../scrolling/_mocks/mock-scrolling-events.service';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {By} from '@angular/platform-browser';

describe('ObMasterLayoutHeaderComponent', () => {
	let component: ObMasterLayoutHeaderComponent;
	let fixture: ComponentFixture<ObMasterLayoutHeaderComponent>;
	const mockMasterLayoutService = {
		homePageRouteChange$: EMPTY,
		header: {
			configEvents$: new Subject<ObIMasterLayoutEvent>(),
			isCustom: false,
			isSmall: false
		},
		layout: {configEvents$: new Subject<ObIMasterLayoutEvent>(), isMenuOpened: false}
	};

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			declarations: [ObMasterLayoutHeaderComponent, ObMockTranslatePipe],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObMasterLayoutService, useValue: mockMasterLayoutService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
				{provide: ObScrollingEvents, useClass: ObMockScrollingEvents},
				{provide: ObGlobalEventsService, useClass: ObMockGlobalEventsService},
				{provide: WINDOW, useValue: window}
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ObMasterLayoutHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should have ob-master-layout-header class', () => {
		expect(fixture.debugElement.nativeElement.classList.contains('ob-master-layout-header')).toBe(true);
	});

	describe('properties', () => {
		it('should have a home$ property', () => {
			expect(component.home$ instanceof Observable).toBe(true);
		});

		describe('isCustom', () => {
			it('should be defined', () => {
				expect(component.isCustom).toBe(mockMasterLayoutService.header.isCustom);
			});

			it('should be updated with the service', () => {
				mockMasterLayoutService.header.configEvents$.next({name: ObEMasterLayoutEventValues.HEADER_IS_CUSTOM, value: true});
				expect(component.isCustom).toBe(true);
			});
		});

		it('should have a banner property', () => {
			expect(component.banner).toEqual({color: '#000', bgColor: '#0f0'});
		});

		describe('isSmall', () => {
			it('should be defined', () => {
				expect(component.isSmall).toBe(mockMasterLayoutService.header.isSmall);
			});

			it('should be updated with the service', () => {
				mockMasterLayoutService.header.configEvents$.next({name: ObEMasterLayoutEventValues.HEADER_IS_SMALL, value: true});
				expect(component.isSmall).toBe(true);
			});
		});
	});

	describe('isLangActive', () => {
		it('should return true for en', () => {
			expect(component.isLangActive('en')).toBe(true);
		});

		it('should return true for de', () => {
			expect(component.isLangActive('de')).toBe(false);
		});
	});

	describe('changeLang', () => {
		it('should call use', () => {
			const translate = TestBed.inject(TranslateService);
			jest.spyOn(translate, 'use');
			component.changeLang('de');
			expect(translate.use).toHaveBeenCalledWith('de');
		});
	});

	describe('languages', () => {
		describe('property', () => {
			it('should be defined', () => {
				expect(component.languages).toBeDefined();
			});

			it('should have a default values', () => {
				expect(component.languages).toEqual([
					{code: 'de', id: undefined, label: 'Deutsch'},
					{code: 'fr', id: undefined, label: 'Français'},
					{code: 'it', id: undefined, label: 'Italiano'}
				]);
			});
		});

		describe('title', () => {
			let titleElement: DebugElement;
			beforeEach(() => {
				titleElement = fixture.debugElement.query(By.css('#ob-language-change'));
			});

			it('should be present', () => {
				expect(titleElement).toBeDefined();
			});

			it('should be only visible to screen reader', () => {
				expect(titleElement.classes['ob-screen-reader-only']).toBe(true);
			});

			it('should have a text', () => {
				expect(titleElement.nativeElement.textContent).toBe('i18n.oblique.header.languages.title');
			});
		});

		describe('language list', () => {
			let listElement: DebugElement;
			beforeEach(() => {
				listElement = fixture.debugElement.query(By.css('.ob-header-locale'));
			});

			it('should be present', () => {
				expect(listElement).toBeDefined();
			});

			it('should be linked to the title', () => {
				expect(listElement.attributes['aria-labelledby']).toBe('ob-language-change');
			});
		});

		describe('language buttons', () => {
			let buttonElements: DebugElement[];
			const languages = [
				{code: 'DE', name: 'Deutsch'},
				{code: 'FR', name: 'Français'},
				{code: 'IT', name: 'Italiano'}
			];
			beforeEach(() => {
				buttonElements = fixture.debugElement.queryAll(By.css('.ob-control-locale'));
			});

			it('should be present', () => {
				expect(buttonElements).toBeDefined();
			});

			it('should be 3 buttons', () => {
				expect(buttonElements.length).toBe(3);
			});

			describe.each(languages)('button', locale => {
				let buttonElement: DebugElement;
				beforeEach(() => {
					buttonElement = buttonElements[languages.findIndex(language => language.code === locale.code)];
				});

				describe(locale.code, () => {
					it('should have a text', () => {
						expect(buttonElement.nativeElement.textContent.trim()).toBe(locale.code);
					});

					it('should have an accessible label', () => {
						expect(buttonElement.attributes['aria-label']).toBe(locale.name);
					});
				});
			});
		});
	});
});
