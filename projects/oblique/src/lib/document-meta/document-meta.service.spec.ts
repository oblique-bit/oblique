import {TestBed, inject} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ObDocumentMetaService} from './document-meta.service';
import {provideObliqueTestingConfiguration} from '../utilities';

describe('DocumentMetaService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule],
			providers: [ObDocumentMetaService, provideObliqueTestingConfiguration()]
		});
	});

	it('should be created', inject([ObDocumentMetaService], (service: ObDocumentMetaService) => {
		expect(service).toBeTruthy();
	}));
});
