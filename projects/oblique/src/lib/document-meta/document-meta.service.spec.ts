import {TestBed, inject} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {ObDocumentMetaService} from './document-meta.service';
import {provideObliqueTestingConfiguration} from '../utilities';

describe('DocumentMetaService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([])],
			providers: [ObDocumentMetaService, provideObliqueTestingConfiguration()],
		});
	});

	it('should be created', inject([ObDocumentMetaService], (service: ObDocumentMetaService) => {
		expect(service).toBeTruthy();
	}));
});
