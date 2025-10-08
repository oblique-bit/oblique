import {TestBed} from '@angular/core/testing';

import {ObTourService} from './tour.service';
import {ObTourConfig, ObToursConfig} from '../models/tour-config.model';
import SpyInstance = jest.SpyInstance;
import {TranslateService} from '@ngx-translate/core';
import {of} from 'rxjs';

describe('TourService', () => {
	let service: ObTourService;

	beforeEach(() => {
		const translateMock = {
			onLangChange: of()
		};
		TestBed.configureTestingModule({
			providers: [{provide: TranslateService, useValue: translateMock}]
		});
		service = TestBed.inject(ObTourService);
	});

	test('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('before init', () => {
		let updateConfigNext: SpyInstance<void, [value: ObTourConfig[]]>;
		beforeEach(() => {
			updateConfigNext = jest.spyOn(service.updateConfig, 'next');
		});
		test('should not have updated config', () => {
			expect(updateConfigNext).toHaveBeenCalledTimes(0);
		});
	});

	describe('init tours', () => {
		const tourConfig: ObToursConfig = {
			tours: [
				{
					tourTitle: 'NO WAY!',
					tourDescription: 'description for NO WAY! Tour',
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
					storageKey: 'tourNO WAY!StorageKey',
					triggers: [{type: 'manual'}],
					state: 'done'
				},
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
					triggers: [{type: 'manual'}],
					state: 'new'
				}
			]
		};
		let updateConfigNext: SpyInstance<void, [value: ObTourConfig[]]>;

		beforeEach(() => {
			updateConfigNext = jest.spyOn(service.updateConfig, 'next');
			service.init(tourConfig.tours);
		});
		test('should have updated config', () => {
			expect(updateConfigNext).toHaveBeenCalledTimes(1);
		});

		test('should have updated the given tours', () => {
			expect(updateConfigNext).toHaveBeenCalledWith(tourConfig.tours);
		});
	});
});
