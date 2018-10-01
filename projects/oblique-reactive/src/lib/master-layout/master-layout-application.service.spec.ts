import {TestBed, inject} from '@angular/core/testing';
import {EventEmitter} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ProjectConfig} from '../../../../../project.conf';
import {MasterLayoutApplicationService} from 'oblique-reactive';

describe('MasterLayoutApplicationService', () => {
	let mockTranslateService;
	let applicationService: MasterLayoutApplicationService;

	beforeEach(async () => {
		mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
		mockTranslateService.onLangChange = new EventEmitter();

		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				MasterLayoutApplicationService,
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: 'ObliqueReactive.CONFIG', useValue: ProjectConfig.app}
			]
		});
	});

	beforeEach(inject([MasterLayoutApplicationService], (service: MasterLayoutApplicationService) => {
		applicationService = service;
	}));

	it('update layout variant', () => {
		// TODO
	});
});
