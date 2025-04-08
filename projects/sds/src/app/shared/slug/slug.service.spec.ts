import {TestBed} from '@angular/core/testing';

import {SlugService} from './slug.service';

describe(SlugService.name, () => {
	let service: SlugService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(SlugService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
