import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable()
export class MockHttpApiInterceptor {
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request.clone({
			headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')
		}));
	}
}
