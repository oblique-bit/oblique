import {Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {ObIHttpApiRequest} from '../http-api-interceptor.model';

@Injectable()
export class ObMockHttpApiInterceptorEvents {
	get requestIntercepted(): Observable<ObIHttpApiRequest> {
		return of({} as ObIHttpApiRequest);
	}

	get sessionExpired(): Observable<void> {
		return EMPTY;
	}

	sessionExpire(): void {}

	requestIntercept(request: ObIHttpApiRequest): void {}

	deactivateSpinnerOnNextAPICalls(number = 1): void {}

	deactivateNotificationOnNextAPICalls(number = 1): void {}

	deactivateOnNextAPICalls(number = 1): void {}
}
