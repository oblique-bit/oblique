import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import {ObServiceNavigationTimeoutApiService} from './service-navigation-timeout-api.service';

describe('ObServiceNavigationTimeoutApiService', () => {
	let service: ObServiceNavigationTimeoutApiService;
	let httpClient: HttpClient;
	const mockData = {
		statusCode: 200,
		success: true,
		data: true
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [ObServiceNavigationTimeoutApiService]
		});
		service = TestBed.inject(ObServiceNavigationTimeoutApiService);
		httpClient = TestBed.inject(HttpClient);
		jest.spyOn(httpClient, 'get').mockReturnValue(of(mockData));
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('get', () => {
		it('should return an Observable', () => {
			expect(service.refreshPamsToken('http:/rootUrl/') instanceof Observable).toBe(true);
		});

		describe('http.get', () => {
			beforeEach(() => {
				service.refreshPamsToken('http://rootUrl/').subscribe();
			});

			it('should be called once', () => {
				expect(httpClient.get).toHaveBeenCalledTimes(1);
			});

			it('should be called with proper parameters', () => {
				expect(httpClient.get).toHaveBeenCalledWith('http://rootUrl/api/authentication/refresh', {withCredentials: true});
			});
		});
	});
});
