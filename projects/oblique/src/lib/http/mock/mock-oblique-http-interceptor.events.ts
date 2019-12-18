import {EMPTY, Observable, of} from 'rxjs';
import {ObliqueRequest} from '../oblique-http.module';

export class MockObliqueHttpInterceptorEvents {
	get requestIntercepted(): Observable<ObliqueRequest> {
		return of({} as ObliqueRequest);
	}

	get sessionExpired(): Observable<void> {
		return EMPTY;
	}

	sessionExpire(): void {
	}

	requestIntercept(request: ObliqueRequest): void {
	}

	deactivateSpinnerOnNextAPICalls(number = 1): void {
	}

	deactivateNotificationOnNextAPICalls(number = 1): void {
	}

	deactivateOnNextAPICalls(number = 1): void {
	}
}
