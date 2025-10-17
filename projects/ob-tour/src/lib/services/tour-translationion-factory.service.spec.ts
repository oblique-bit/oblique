import {TestBed} from '@angular/core/testing';

import {TourTranslationionFactoryService} from './tour-translationion-factory.service';

describe('TourTranslationionFactoryService', () => {
	let service: TourTranslationionFactoryService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(TourTranslationionFactoryService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
