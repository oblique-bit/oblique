import {TestBed, fakeAsync} from '@angular/core/testing';
import {of} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {ObServiceNavigationLanguageSynchronizationService} from './service-navigation-language-synchronization.service';
import {ObServiceNavigationLanguageSynchronizationApiService} from '../api/service-navigation-language-synchronization-api.service';
import {provideObliqueTestingConfiguration} from '../../utilities';

describe('ObServiceNavigationLanguageSynchronizationService', () => {
	let service: ObServiceNavigationLanguageSynchronizationService;
	let translateService: TranslateService;
	const fakeApiService = {
		synchronizeLanguage: jest.fn(() => of())
	};

	beforeEach(fakeAsync(() => {
		TestBed.configureTestingModule({
			providers: [
				provideObliqueTestingConfiguration(),
				ObServiceNavigationLanguageSynchronizationService,
				{provide: ObServiceNavigationLanguageSynchronizationApiService, useValue: fakeApiService}
			]
		});

		service = TestBed.inject(ObServiceNavigationLanguageSynchronizationService);
		translateService = TestBed.inject(TranslateService);
		translateService.use(`de`);
		jest.spyOn(translateService, 'use');
		jest.clearAllMocks();
	}));

	it('should have shouldSynchronize initially set to false', () => {
		expect(service.shouldSynchronize).toBe(false);
	});

	describe('initialize', () => {
		const rootUrl = 'test-root-url';

		it('should skip the first language change and not synchronize when shouldSynchronize is false', () => {
			service.initialize(rootUrl);

			translateService.use('en');
			translateService.use('fr');

			expect(fakeApiService.synchronizeLanguage).not.toHaveBeenCalled();
		});

		it('should skip first language change synchronization when shouldSynchronize is true', () => {
			service.shouldSynchronize = true;

			service.initialize(rootUrl);
			translateService.use('en');
			translateService.use('fr');
			translateService.use('de');
			expect(fakeApiService.synchronizeLanguage).toHaveBeenNthCalledWith(2, rootUrl);
		});

		it('should not synchronize when shouldSynchronize is set to false after first real synchronization', () => {
			service.initialize(rootUrl);
			service.shouldSynchronize = true;

			translateService.use('en');
			translateService.use('fr');
			service.shouldSynchronize = false;
			translateService.use('de');

			expect(fakeApiService.synchronizeLanguage).toHaveBeenNthCalledWith(1, rootUrl);
		});
	});

	describe('setLanguage', () => {
		it('should call change the language when shouldSynchronize is true, language is provided and different of the current one', () => {
			const newLanguage = 'fr';
			service.shouldSynchronize = true;
			translateService.use('de');

			service.setLanguage(newLanguage);

			expect(translateService.use).toHaveBeenCalledWith(newLanguage);
		});

		it('should not call PAMS when language change', () => {
			const newLanguage = 'fr';
			service.initialize('test-root-url');
			translateService.use('en');
			service.shouldSynchronize = true;

			service.setLanguage(newLanguage);

			expect(fakeApiService.synchronizeLanguage).not.toHaveBeenCalled();
		});

		it('should not change the language when shouldSynchronize is false', () => {
			(translateService.use as jest.Mock).mockClear();
			service.shouldSynchronize = false;

			service.setLanguage('fr');

			expect(translateService.use).not.toHaveBeenCalled();
		});

		it('should not change the language when language is undefined', () => {
			(translateService.use as jest.Mock).mockClear();
			service.shouldSynchronize = true;

			service.setLanguage(undefined);

			expect(translateService.use).not.toHaveBeenCalled();
		});

		it('should not change the language when language is the same as current language', () => {
			service.setLanguage('de');
			(translateService.use as jest.Mock).mockClear();
			service.shouldSynchronize = true;

			service.setLanguage('de');

			expect(translateService.use).not.toHaveBeenCalled();
		});

		it('should not change the language when language is not supported', () => {
			service.setLanguage('de');
			(translateService.use as jest.Mock).mockClear();
			service.shouldSynchronize = true;

			service.setLanguage('ru');

			expect(translateService.use).not.toHaveBeenCalled();
		});
	});
});
