import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Observable, firstValueFrom, of} from 'rxjs';
import {ObServiceNavigationConfigApiService} from './service-navigation-config-api.service';

describe('ObServiceNavigationUrlsApiService', () => {
	let service: ObServiceNavigationConfigApiService;
	let httpClient: HttpClient;
	const mockUrls = {
		statusCode: 200,
		success: true,
		data: {test: 'test'}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule]
		});
		httpClient = TestBed.inject(HttpClient);
		jest.spyOn(httpClient, 'get').mockReturnValue(of(mockUrls));
		service = TestBed.inject(ObServiceNavigationConfigApiService);
	});

	describe('fetchUrls', () => {
		it('should return an Observable', () => {
			expect(service.fetchUrls('http:/rootUrl/') instanceof Observable).toBe(true);
		});

		it('should receive that "data" part of the mockUrls', () => {
			expect(firstValueFrom(service.fetchUrls('http:/rootUrl/'))).resolves.toEqual(mockUrls.data);
		});

		describe('http.get', () => {
			beforeEach(() => {
				service.fetchUrls('http:/rootUrl/').subscribe();
			});

			it('should be called once', () => {
				expect(httpClient.get).toBeCalledTimes(1);
			});

			it('should be called with correct parameters', () => {
				expect(httpClient.get).toBeCalledWith('http:/rootUrl/api/v2/widget/config', {withCredentials: true});
			});
		});
	});
});
