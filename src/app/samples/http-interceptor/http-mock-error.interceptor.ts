import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';

@Injectable()
export class HttpMockErrorInterceptor implements HttpInterceptor {
	private static readonly errorCodes = ['401', '404'];

	static getStatusText(code: number): string {
		switch (code) {
			case 200:
				return 'OK';
			case 401:
				return 'UNAUTHORIZED';
			case 404:
				return 'NOT FOUND';
			case 500:
				return 'SERVER ERROR';
			case 0:
				return 'SERVICE UNAVAILABLE';
			default:
				return 'UNKNOWN CODE';
		}
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return of(null).pipe(
			mergeMap(() => {
				const code = request.url.split('/').pop();
				if (HttpMockErrorInterceptor.errorCodes.indexOf(code) > -1) {
					return throwError(
						new HttpErrorResponse({
							status: +code,
							statusText: HttpMockErrorInterceptor.getStatusText(+code)
						})
					);
				}

				return next.handle(request);
			}),
			materialize(),
			delay(500),
			dematerialize()
		);
	}
}
