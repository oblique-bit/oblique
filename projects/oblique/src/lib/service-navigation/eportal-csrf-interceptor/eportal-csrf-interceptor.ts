import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import Cookies from 'js-cookie';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ObEportalCsrfInterceptor implements HttpInterceptor {
	public intercept(httpRequest: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		if (this.shouldAddCsrf(httpRequest)) {
			const cookieName = 'pams-csrf-token';
			const headerName = 'Pams-Csrf-Token';

			const headers = {
				[headerName]: Cookies.get(cookieName)
			};
			const modifiedReq = httpRequest.clone({setHeaders: headers});

			return next.handle(modifiedReq);
		}

		return next.handle(httpRequest);
	}

	private shouldAddCsrf(httpRequest: HttpRequest<unknown>): boolean {
		const whiteList = ['http://localdev.com:8207', 'http://localhost:8207', 'https://pams-api.eportal'];
		const autorizedMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];

		const urlIsInWhitelist = whiteList.some(url => httpRequest.url.startsWith(url));
		const requestUseValidMethod = autorizedMethods.includes(httpRequest.method);

		return urlIsInWhitelist && requestUseValidMethod;
	}
}
