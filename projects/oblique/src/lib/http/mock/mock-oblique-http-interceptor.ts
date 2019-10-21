import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

export class MockObliqueHttpInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request.clone({
			headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')
		}));
	}
}
