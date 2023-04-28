import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Observable, firstValueFrom, of} from 'rxjs';
import {ObServiceNavigationApplicationsApiService} from './service-navigation-applications-api.service';

describe('ObServiceNavigationApplicationsApiService', () => {
	let service: ObServiceNavigationApplicationsApiService;
	let httpClient: HttpClient;
	const mockUrls = {
		statusCode: 200,
		success: true,
		data: {
			applications: [
				{
					applicationID: 1,
					image: 'imageBase64',
					lastModificationDate: 'timestamp',
					name: {en: 'EN', de: 'DE', fr: 'FR', it: 'IT'},
					url: 'appUrl'
				}
			]
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({imports: [HttpClientTestingModule]});
		httpClient = TestBed.inject(HttpClient);
		jest.spyOn(httpClient, 'post').mockReturnValue(of(mockUrls));
		service = TestBed.inject(ObServiceNavigationApplicationsApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('fetchApplicationsInfo', () => {
		it('should return an Observable', () => {
			expect(service.fetchApplicationsInfo('http:/rootUrl/', [{applicationID: 1, childApplicationID: 0}]) instanceof Observable).toBe(true);
		});

		it('should receive that "data" part of the mockUrls', () => {
			expect(firstValueFrom(service.fetchApplicationsInfo('http:/rootUrl/', [{applicationID: 1, childApplicationID: 0}]))).resolves.toEqual(
				mockUrls.data
			);
		});

		describe('http.post', () => {
			beforeEach(() => {
				service.fetchApplicationsInfo('http:/rootUrl/', [{applicationID: 1, childApplicationID: 0}]).subscribe();
			});

			it('should be called once', () => {
				expect(httpClient.post).toBeCalledTimes(1);
			});

			it('should be called with correct parameters', () => {
				expect(httpClient.post).toBeCalledWith(
					'http:/rootUrl/api/widget/applications',
					{
						applications: [
							{
								applicationID: 1,
								childApplicationID: 0
							}
						]
					},
					{withCredentials: true}
				);
			});
		});
	});
});
