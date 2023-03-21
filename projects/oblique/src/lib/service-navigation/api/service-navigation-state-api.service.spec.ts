import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Observable, of} from 'rxjs';
import {ObServiceNavigationStateApiService} from './service-navigation-state-api.service';

describe('ObServiceNavigationStateApiService', () => {
	let service: ObServiceNavigationStateApiService;
	let httpClient: HttpClient;
	const mockData = {
		statusCode: 200,
		success: true,
		data: {test: 'test'}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [ObServiceNavigationStateApiService]
		});
		service = TestBed.inject(ObServiceNavigationStateApiService);
		httpClient = TestBed.inject(HttpClient);
		jest.spyOn(httpClient, 'get').mockReturnValue(of(mockData));
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('get', () => {
		it('should return an Observable', () => {
			expect(service.get('http:/rootUrl/') instanceof Observable).toBe(true);
		});

		it('should receive that "data" part of the mockUrls', done => {
			service.get('http://rootUrl/').subscribe(result => {
				expect(result).toEqual(mockData.data);
				done();
			});
		});

		describe('http.get', () => {
			beforeEach(() => {
				service.get('http://rootUrl/').subscribe();
			});

			it('should be called once', () => {
				expect(httpClient.get).toHaveBeenCalledTimes(1);
			});

			it('should be called with proper parameters', () => {
				expect(httpClient.get).toHaveBeenCalledWith('http://rootUrl/api/widget/state', {withCredentials: true});
			});
		});
	});
});
