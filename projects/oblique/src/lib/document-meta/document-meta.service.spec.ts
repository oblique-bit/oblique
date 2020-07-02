import {inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {ObDocumentMetaService} from './document-meta.service';
import {ObMockTranslateService} from '../_mocks/mock-translate.service';

describe('DocumentMetaService', () => {
	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [ObDocumentMetaService, {provide: TranslateService, useClass: ObMockTranslateService}]
		});
	});

	it('should be created', inject([ObDocumentMetaService], (service: ObDocumentMetaService) => {
		expect(service).toBeTruthy();
	}));
});
