import {TestBed} from '@angular/core/testing';

import {VersionService} from './version.service';

describe(VersionService.name, () => {
	let service: VersionService;
	const cmsData = [
		{id: 0, base_url: 'base_url_42', version_number: 42},
		{id: 1, base_url: 'base_url_43', version_number: 43}
	];

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(VersionService);
	});

	test('creation', () => {
		expect(service).toBeTruthy();
	});

	describe('getBaseUrl method', () => {
		test('returns an empty string if there is neither data nor version', () => {
			expect(service.getBaseUrl()).toBe('');
		});

		test('returns an empty string if there is no data', () => {
			service.setCurrentVersion(12);
			expect(service.getBaseUrl()).toBe('');
		});

		test('returns an empty string if there is no current version', () => {
			service.setCurrentVersion(undefined);
			service.setCmsData(cmsData);
			expect(service.getBaseUrl()).toBe('');
		});

		test('returns the base url corresponding to the current version', () => {
			service.setCurrentVersion(42);
			service.setCmsData(cmsData);
			expect(service.getBaseUrl()).toBe('base_url_42');
		});
	});
});
