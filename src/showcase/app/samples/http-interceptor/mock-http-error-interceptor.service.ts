import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';

@Injectable()
export class MockHttpErrorInterceptor implements HttpInterceptor {
	private static readonly errorCodes = ['401', '404'];

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return of(null).pipe(
			mergeMap(() => {
				const code = request.url.split('/').pop();
				if (MockHttpErrorInterceptor.errorCodes.indexOf(code) > -1) {
					return throwError(new HttpErrorResponse({
						status: +code,
						statusText: MockHttpErrorInterceptor.getStatusText(+code)
					}));
				}

				return next.handle(request);
			}),
			materialize(),
			delay(500),
			dematerialize()
		);
	}

	static getStatusText(code: number): string {
		switch (code) {
			case 200:
				return 'OK';
			case 401:
				return 'UNAUTHORIZED';
			case 404:
				return 'NOT FOUND';
			default:
				return 'UNKNOWN CODE';
		}
	}
}
