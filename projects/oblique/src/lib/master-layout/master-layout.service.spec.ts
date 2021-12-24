import {TestBed} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import {Observable} from 'rxjs';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {ObMasterLayoutComponentService} from './master-layout/master-layout.component.service';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObMockMasterLayoutConfig} from './_mocks/mock-master-layout.config';
import {ObMasterLayoutService} from './master-layout.service';
import {ObMasterLayoutConfig} from './master-layout.config';
import {ObMasterLayoutNavigationService} from './master-layout-navigation/master-layout-navigation.service';
import {ObMockMasterLayoutHeaderService} from './_mocks/mock-master-layout-header.service';
import {ObMockMasterLayoutFooterService} from './_mocks/mock-master-layout-footer.service';
import {ObMockMasterLayoutNavigationService} from './_mocks/mock-master-layout-navigation.service';
import {ObMockMasterLayoutComponentService} from './_mocks/mock-master-layout.component.service';
import {ObLanguageService} from '../language/language.service';
import {ObMockLanguageService} from '../language/_mocks/mock-language.service';

describe('ObMasterLayoutService', () => {
	let masterLayoutService: ObMasterLayoutService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				ObMasterLayoutService,
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
				{provide: ObMasterLayoutHeaderService, useClass: ObMockMasterLayoutHeaderService},
				{provide: ObMasterLayoutFooterService, useClass: ObMockMasterLayoutFooterService},
				{provide: ObMasterLayoutNavigationService, useClass: ObMockMasterLayoutNavigationService},
				{provide: ObMasterLayoutComponentService, useClass: ObMockMasterLayoutComponentService},
				{provide: ObLanguageService, useClass: ObMockLanguageService}
			]
		});
		masterLayoutService = TestBed.inject(ObMasterLayoutService);
	});

	it('should be created', () => {
		expect(masterLayoutService).toBeTruthy();
	});

	it('should have an homePageRoute set to "home"', () => {
		expect(masterLayoutService.homePageRoute).toBe('/home');
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
