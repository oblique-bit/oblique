import {TestBed} from '@angular/core/testing';
import {MasterLayoutConfig, MasterLayoutNavigationService, MasterLayoutService} from 'oblique';
import {TranslateService} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import {MasterLayoutHeaderService} from './master-layout-header/master-layout-header.service';
import {MasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {MasterLayoutComponentService} from './master-layout/master-layout.component.service';
import {MockTranslateService} from '../_mocks/mock-translate.service';
import {MockMasterLayoutConfig} from './mock/mock-master-layout.config';
import {
	MockMasterLayoutComponentService,
	MockMasterLayoutFooterService,
	MockMasterLayoutHeaderService,
	MockMasterLayoutNavigationService,
	MockMasterLayoutService
} from './mock/mock-master-layout.module';

describe('MasterLayoutService', () => {
	let masterLayoutService: MasterLayoutService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			providers: [
				{provide: TranslateService, useClass: MockTranslateService},
				{provide: MasterLayoutConfig, useClass: MockMasterLayoutConfig},
				{provide: MasterLayoutHeaderService, useClass: MockMasterLayoutHeaderService},
				{provide: MasterLayoutFooterService, useClass: MockMasterLayoutFooterService},
				{provide: MasterLayoutNavigationService, useClass: MockMasterLayoutNavigationService},
				{provide: MasterLayoutComponentService, useClass: MockMasterLayoutComponentService},
				{provide: MasterLayoutService, useClass: MockMasterLayoutService},
			],
		});
		masterLayoutService = TestBed.get(MasterLayoutService);
	});

	it('should be created', () => {
		expect(masterLayoutService).toBeTruthy();
	});
});

