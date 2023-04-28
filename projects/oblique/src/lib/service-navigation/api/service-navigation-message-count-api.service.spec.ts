import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {Observable, firstValueFrom, of} from 'rxjs';
import {ObServiceNavigationCountApiService} from './service-navigation-message-count-api.service';

describe('ObServiceNavigationCountApiService', () => {
	let service: ObServiceNavigationCountApiService;
	let httpClient: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [ObServiceNavigationCountApiService]
		});
		httpClient = TestBed.inject(HttpClient);
		jest.spyOn(httpClient, 'get').mockReturnValue(of({data: 42}));
		service = TestBed.inject(ObServiceNavigationCountApiService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('get', () => {
		it('should return an Observable', () => {
			expect(service.get('http:/rootUrl/') instanceof Observable).toBe(true);
		});

		it('should return a plain object, with the data key stripped away', () =>
			expect(firstValueFrom(service.get('http://rootUrl/'))).resolves.toEqual(42));

		describe('http.get', () => {
			beforeEach(() => {
				service.get('http://rootUrl/').subscribe();
			});

			it('should be called once', () => {
				expect(httpClient.get).toBeCalledTimes(1);
			});

			it('should be called with correct parameters', () => {
				expect(httpClient.get).toBeCalledWith('http://rootUrl/api/widget/notifications/count', {withCredentials: true});
			});
		});
	});
});
