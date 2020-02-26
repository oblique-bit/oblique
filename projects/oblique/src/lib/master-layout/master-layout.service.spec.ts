import {TestBed} from '@angular/core/testing';
import {ObMasterLayoutConfig, ObMasterLayoutNavigationService, ObMasterLayoutService} from 'oblique';
import {TranslateService} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import {ObMasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {ObMasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {ObMasterLayoutComponentService} from './master-layout/master-layout.component.service';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';
import {ObMockMasterLayoutConfig} from './mock/mock-master-layout.config';
import {
	ObMockMasterLayoutComponentService,
	ObMockMasterLayoutFooterService,
	ObMockMasterLayoutHeaderService,
	ObMockMasterLayoutNavigationService,
	ObMockMasterLayoutService
} from './mock/mock-master-layout.module';

describe('MasterLayoutService', () => {
	let masterLayoutService: ObMasterLayoutService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			providers: [
				{provide: TranslateService, useClass: ObMockTranslateService},
				{provide: ObMasterLayoutConfig, useClass: ObMockMasterLayoutConfig},
				{provide: ObMasterLayoutHeaderService, useClass: ObMockMasterLayoutHeaderService},
				{provide: ObMasterLayoutFooterService, useClass: ObMockMasterLayoutFooterService},
				{provide: ObMasterLayoutNavigationService, useClass: ObMockMasterLayoutNavigationService},
				{provide: ObMasterLayoutComponentService, useClass: ObMockMasterLayoutComponentService},
				{provide: ObMasterLayoutService, useClass: ObMockMasterLayoutService},
			],
		});
		masterLayoutService = TestBed.get(ObMasterLayoutService);
	});

	it('should be created', () => {
		expect(masterLayoutService).toBeTruthy();
	});
});

