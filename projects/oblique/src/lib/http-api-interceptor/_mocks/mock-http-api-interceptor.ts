import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockHttpApiInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(
			request.clone({
				headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')
			})
		);
	}
}
