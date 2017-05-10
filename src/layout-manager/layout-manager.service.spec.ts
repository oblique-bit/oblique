/* tslint:disable:no-unused-variable */
import {TestBed, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {LayoutManagerService} from './layout-manager.service';
import {TranslateService} from '@ngx-translate/core';
import {EventEmitter} from '@angular/core';
const project = require('../../project.conf.js');

describe('LayoutManagerService', () => {
	let mockTranslateService;
	let uiLayoutService: LayoutManagerService;

	beforeEach(async() => {
		mockTranslateService = jasmine.createSpyObj('TranslateService', ['setDefaultLang', 'use', 'getDefaultLang']);
		mockTranslateService.onLangChange = new EventEmitter();
		mockTranslateService.userLang = 'en';

		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				LayoutManagerService,
				{provide: TranslateService, useValue: mockTranslateService},
				{provide: 'ObliqueReactive.CONFIG', useValue: project.app}
			]
		});
	});

	beforeEach(inject([LayoutManagerService], (service: LayoutManagerService) => {
		uiLayoutService = service;
	}));

	it('update layout variant', () => {
		// TODO
	});
});
