import {TestBed} from '@angular/core/testing';

import {ObTourService} from './tour.service';
import {ObToursConfig} from '../models/tour-config.model';

describe('TourService', () => {
	let service: ObTourService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(ObTourService);
	});

	test('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('before init', () => {
		test('should not have a config', () => {
			expect(service.getConfig()).toBe(null);
		});
	});

	describe('init tours', () => {
		const tourConfig: ObToursConfig = {
			tours: [
				{
					tourTitle: 'Hello Test',
					tourDescription: 'description for testing of the tourconfig',
					steps: [
						{
							stepTitle: 'first Step of the tour',
							stepDescription: 'description of the first tour step'
						},
						{
							stepTitle: 'second step of the tour',
							stepDescription: 'description of the second tour step'
						}
					],
					storageKey: 'tourStorageKey',
					triggers: [{type: 'manual'}]
				}
			]
		};

		beforeEach(() => {
			service.init(tourConfig);
		});
		test('should init the config ', () => {
			expect(service.getConfig()).toEqual(tourConfig);
		});
	});
});
