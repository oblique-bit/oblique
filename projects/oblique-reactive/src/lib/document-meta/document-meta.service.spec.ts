import {TestBed, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';
import {DocumentMetaService} from 'oblique-reactive';

describe('DocumentMetaService', () => {

	beforeEach(async () => {
		const mockTranslateService = {
			setDefaultLang: jest.fn(),
			use: jest.fn(),
			onLangChange: of()
		};

		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [
				DocumentMetaService,
				{ provide: TranslateService, useValue: mockTranslateService },
			]
		});
	});


	it('should be created', inject([DocumentMetaService], (service: DocumentMetaService) => {
		expect(service).toBeTruthy();
	}));


});
