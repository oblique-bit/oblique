import {TestBed, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {DocumentMetaService} from './document-meta.service';

describe('DocumentMetaService', () => {
	let documentMetaService: DocumentMetaService;

	beforeEach(async () => {
		const mockTranslateService = jasmine.createSpyObj(
			'TranslateService',
			[
				'setDefaultLang',
				'use',
				'onLangChange'
			]);

		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				{
					provide: TranslateService,
					useValue: mockTranslateService
				},
				DocumentMetaService
			]
		});
	});

	beforeEach(inject([DocumentMetaService], (service: DocumentMetaService) => {
		documentMetaService = service;
	}));

	// it('should set document title', () => {
	// 	// TODO
	// });
});
