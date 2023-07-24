import {HttpRequest, HttpResponse} from '@angular/common/http';
import {of} from 'rxjs';
import {ObEportalCsrfInterceptor} from './eportal-csrf-interceptor';
import Cookies from 'js-cookie';

describe('EportalCsrfInterceptor', () => {
	let interceptor: ObEportalCsrfInterceptor;
	let httpResponseSpy: HttpResponse<unknown>;
	const randomCsrfValue = 'randomCsrfValue';
	const pamsUrl = 'http://localdev.com:8207';
	const cookieName = 'pams-csrf-token';
	const headerName = 'Pams-Csrf-Token';
	const next: any = {
		handle: response => {
			httpResponseSpy = response;
			return of(new HttpResponse<unknown>(response));
		}
	};

	beforeEach(() => {
		interceptor = new ObEportalCsrfInterceptor();
		Cookies.set(cookieName, randomCsrfValue);
	});

	describe('Csrf token', () => {
		beforeEach(() => {
			const request = new HttpRequest('POST', pamsUrl, null);
			interceptor.intercept(request, next);
		});

		it('should have the name Pams-Csrf-Token in the header', () => {
			expect(httpResponseSpy.headers.has(headerName)).toBe(true);
		});

		it('should have the name pams-csrf-token in the cookies', () => {
			expect(httpResponseSpy.headers.get(headerName)).toBe(randomCsrfValue);
		});
	});

	describe('Request without csrf token', () => {
		it('should not add the csrf token when the method is GET', () => {
			const request = new HttpRequest('GET', pamsUrl);
			interceptor.intercept(request, next);

			expect(httpResponseSpy.headers.get(headerName)).toBe(null);
		});
	});

	describe('Request is PAMS', () => {
		const cases = ['POST', 'PATCH', 'PUT', 'DELETE'];

		it.each(cases)('should add the csrf token when the method is %p', method => {
			const request = new HttpRequest(method, pamsUrl, null);
			interceptor.intercept(request, next);

			expect(httpResponseSpy.headers.get(headerName)).toBe(randomCsrfValue);
		});
	});

	describe('Request is not PAMS', () => {
		const cases = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'];
		const notAPamsUrl = 'http://example.com';

		it.each(cases)('should not add the csrf token when the method is %p', method => {
			const request = new HttpRequest(method, notAPamsUrl, null);
			interceptor.intercept(request, next);

			expect(httpResponseSpy.headers.get(headerName)).toBe(null);
		});
	});
});
