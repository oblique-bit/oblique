import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {ObMasterLayoutComponentService} from './master-layout/master-layout.component.service';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObMasterLayoutService} from './master-layout.service';
import {ObMasterLayoutConfig} from './master-layout.config';
import {ObMasterLayoutNavigationService} from './master-layout-navigation/master-layout-navigation.service';
import {ObMockMasterLayoutHeaderService} from './_mocks/mock-master-layout-header.service';
import {ObMockMasterLayoutFooterService} from './_mocks/mock-master-layout-footer.service';
import {ObMockMasterLayoutNavigationService} from './_mocks/mock-master-layout-navigation.service';
import {ObMockMasterLayoutComponentService} from './_mocks/mock-master-layout.component.service';
import {ObLanguageService} from '../language/language.service';
import {ObMockLanguageService} from '../language/_mocks/mock-language.service';
import {AccessibilityStatementComponent} from '../accessibility-statement/accessibility-statement.component';

describe('ObMasterLayoutService', () => {
	let masterLayoutService: ObMasterLayoutService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				ObMasterLayoutService,
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObMasterLayoutConfig, useValue: {showAccessibilityTitle: true, homePageRoute: '/home'}},
				{provide: ObMasterLayoutHeaderService, useClass: ObMockMasterLayoutHeaderService},
				{provide: ObMasterLayoutFooterService, useClass: ObMockMasterLayoutFooterService},
				{provide: ObMasterLayoutNavigationService, useClass: ObMockMasterLayoutNavigationService},
				{provide: ObMasterLayoutComponentService, useClass: ObMockMasterLayoutComponentService},
				{provide: ObLanguageService, useClass: ObMockLanguageService}
			]
		});
		masterLayoutService = TestBed.inject(ObMasterLayoutService);
		TestBed.inject(ObMasterLayoutConfig).showAccessibilityTitle = true;
	});

	it('should be created', () => {
		expect(masterLayoutService).toBeTruthy();
	});

	it('should have an homePageRoute set to "home"', () => {
		expect(masterLayoutService.homePageRoute).toBe('/home');
	});

	it('should add a route to the accessibility statement', () => {
		expect(TestBed.inject(Router).config).toEqual([
			{
				component: AccessibilityStatementComponent,
				path: 'accessibility-statement',
				data: {title: 'i18n.oblique.accessibility-statement.statement.title'}
			}
		]);
	});

	describe('homePageRouteChange$', () => {
		it('should be an Observable', () => {
			expect(masterLayoutService.homePageRouteChange$ instanceof Observable).toBe(true);
		});

		it('should emit the new homePageRoute when homePageRoute is set', done => {
			masterLayoutService.homePageRoute = 'test';
			masterLayoutService.homePageRouteChange$.subscribe(home => {
				expect(home).toBe('test');
				done();
			});
		});
	});
});
