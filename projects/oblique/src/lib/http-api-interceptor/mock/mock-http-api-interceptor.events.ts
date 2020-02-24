import {Injectable} from '@angular/core';
import {EMPTY, Observable, of} from 'rxjs';
import {HttpApiRequest} from '../http-api-interceptor.module';

@Injectable()
export class MockHttpApiInterceptorEvents {
	get requestIntercepted(): Observable<HttpApiRequest> {
		return of({} as HttpApiRequest);
	}

	get sessionExpired(): Observable<void> {
		return EMPTY;
	}

	sessionExpire(): void {
	}

	requestIntercept(request: HttpApiRequest): void {
	}

	deactivateSpinnerOnNextAPICalls(number = 1): void {
	}

	deactivateNotificationOnNextAPICalls(number = 1): void {
	}

	deactivateOnNextAPICalls(number = 1): void {
	}
}
