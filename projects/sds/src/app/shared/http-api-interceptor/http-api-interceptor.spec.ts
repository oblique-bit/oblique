// eslint-disable-next-line sort-imports
import {HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {ObSpinnerService} from '@oblique/oblique';
import {HttpApiInterceptor} from './http-api-interceptor';

describe('HttpApiInterceptor', () => {
	let httpMock: HttpTestingController;
	let spinnerService: ObSpinnerService;
	let httpClient: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				ObSpinnerService,
				{
					provide: HTTP_INTERCEPTORS,
					useClass: HttpApiInterceptor,
					multi: true
				}
			]
		});

		httpMock = TestBed.inject(HttpTestingController);
		spinnerService = TestBed.inject(ObSpinnerService);
		httpClient = TestBed.inject(HttpClient);
	});

	it('should activate the spinner when a request is made', () => {
		const activateSpy = jest.spyOn(spinnerService, 'activate');
		const testUrl = '/test';

		httpClient.get(testUrl).subscribe();
		httpMock.expectOne(testUrl).flush(null);

		expect(activateSpy).toHaveBeenCalledWith('main');
	});

	it('should deactivate the spinner when a request is completed', () => {
		const deactivateSpy = jest.spyOn(spinnerService, 'forceDeactivate');
		const testUrl = '/test';

		httpClient.get(testUrl).subscribe();
		httpMock.expectOne(testUrl).flush(null);

		expect(deactivateSpy).toHaveBeenCalledWith('main');
	});
});
