import {TestBed} from '@angular/core/testing';
import {MasterLayoutConfig, MasterLayoutNavigationService, MasterLayoutService} from 'oblique';
import {TranslateService} from '@ngx-translate/core';
import {MockTranslatePipe, MockTranslateService} from 'tests';
import {RouterTestingModule} from '@angular/router/testing';
import {MasterLayoutHeaderService} from './master-layout-header/master-layout.header.service';
import {MasterLayoutFooterService} from './master-layout-footer/master-layout-footer.service';
import {MasterLayoutComponentService} from './master-layout/master-layout-component.service';

describe('MasterLayoutService', () => {
	let masterLayoutService: MasterLayoutService;

	const mockConfig = {
		navigation: {links: []},
	};

	const mockMasterLayoutHeaderService = {
		isCustom: jest.fn()
	};
	const mockMasterLayoutFooterService = {
		isCustom: jest.fn()
	};

	const mockMasterLayoutNavigationService = {
		pipe: jest.fn()
	};

	const mockMasterLayoutComponentService = {
		isFixed: jest.fn()
	};

	const mockMasterLayoutService = {
		disabled: jest.fn()
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				MockTranslatePipe
			],
			imports: [
				RouterTestingModule
			],
			providers: [
				MasterLayoutService,
				MasterLayoutConfig,
				{provide: TranslateService, useValue: MockTranslateService},
				{provide: MasterLayoutConfig, useValue: mockConfig},
				{provide: MasterLayoutHeaderService, useValue: mockMasterLayoutHeaderService},
				{provide: MasterLayoutFooterService, useValue: mockMasterLayoutFooterService},
				{provide: MasterLayoutNavigationService, useValue: mockMasterLayoutNavigationService},
				{provide: MasterLayoutComponentService, useValue: mockMasterLayoutComponentService},
				{provide: MasterLayoutService, useValue: mockMasterLayoutService},
			],
		});
		masterLayoutService = TestBed.get(MasterLayoutService);
	});

	it('should be created', () => {
		expect(masterLayoutService).toBeTruthy();
	});
});

