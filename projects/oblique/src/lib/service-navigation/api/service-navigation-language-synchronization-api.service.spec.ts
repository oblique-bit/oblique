import {HttpClient, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {Observable, firstValueFrom, of} from 'rxjs';
import {ObServiceNavigationLanguageSynchronizationApiService} from './service-navigation-language-synchronization-api.service';
import {provideObliqueTestingConfiguration} from '../../utilities';

describe('ObServiceNavigationLanguageSynchronizationApiService', () => {
	let service: ObServiceNavigationLanguageSynchronizationApiService;
	let httpClient: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			providers: [
				provideHttpClient(withInterceptorsFromDi()),
				provideObliqueTestingConfiguration(),
				ObServiceNavigationLanguageSynchronizationApiService,
			],
		});
		service = TestBed.inject(ObServiceNavigationLanguageSynchronizationApiService);
		httpClient = TestBed.inject(HttpClient);
		jest.spyOn(httpClient, 'put').mockReturnValue(of({}));
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('synchronizeLanguage', () => {
		it('should return an Observable', () => {
			expect(service.synchronizeLanguage('http://rootUrl/') instanceof Observable).toBe(true);
		});

		it('should return void (undefined)', async () => {
			await expect(firstValueFrom(service.synchronizeLanguage('http://rootUrl/'))).resolves.toBeUndefined();
		});

		describe('http.put', () => {
			beforeEach(() => {
				service.synchronizeLanguage('http://rootUrl/').subscribe();
			});

			it('should be called with proper parameters languageCode "de" and applicationID 48', () => {
				expect(httpClient.put).toHaveBeenNthCalledWith(
					1,
					'http://rootUrl/api/user/application',
					{
						languageCode: 'de',
						applicationID: 48,
					},
					{
						withCredentials: true,
					}
				);
			});
		});
	});
});
