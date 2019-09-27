import {inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {DocumentMetaService} from 'oblique';
import {MockTranslateService} from 'tests';

describe('DocumentMetaService', () => {

	beforeEach(async () => {

		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				DocumentMetaService,
				{ provide: TranslateService, useClass: MockTranslateService }
			]
		});
	});


	it('should be created', inject([DocumentMetaService], (service: DocumentMetaService) => {
		expect(service).toBeTruthy();
	}));


});
