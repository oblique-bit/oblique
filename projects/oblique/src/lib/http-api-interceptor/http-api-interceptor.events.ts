import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {HttpApiRequest} from './http-api-interceptor';

/**
 * Provides access to the Oblique HTTP Interceptor events.
 */
@Injectable({providedIn: 'root'})
export class HttpApiInterceptorEvents {
	// INFO: this is only protected to support unit tests
	protected requested = new Subject<HttpApiRequest>();
	protected expired = new Subject<void>();
	private readonly requestIntercepted$ = this.requested.asObservable();
	private readonly sessionExpired$ = this.expired.asObservable();

	/**
	 * This will be feed with `requested` events
	 */
	get requestIntercepted(): Observable<HttpApiRequest> {
		return this.requestIntercepted$;
	}

	/**
	 * This will be feed with `expired` events
	 */
	get sessionExpired(): Observable<void> {
		return this.sessionExpired$;
	}

	/**
	 * Fire an `expire` event
	 */
	public sessionExpire(): void {
		this.expired.next();
	}

	/**
	 * Fire an `requesteed` event
	 */
	public requestIntercept(request: HttpApiRequest): void {
		this.requested.next(request);
	}

	public deactivateSpinnerOnNextAPICalls(number = 1): void {
		this.requestIntercepted.pipe(take(number)).subscribe((evt: HttpApiRequest) => {
			evt.spinner = false;
		});
	}

	public deactivateNotificationOnNextAPICalls(number = 1): void {
		this.requestIntercepted.pipe(take(number)).subscribe((evt: HttpApiRequest) => {
			evt.notification.active = false;
		});
	}

	public deactivateOnNextAPICalls(number = 1): void {
		this.requestIntercepted.pipe(take(number)).subscribe((evt: HttpApiRequest) => {
			evt.notification.active = false;
			evt.spinner = false;
		});
	}
}
