import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObliqueRequest} from './oblique-http-interceptor';

/**
 * Provides access to the Oblique HTTP Interceptor events.
 */
@Injectable({providedIn: 'root'})
export class ObliqueHttpInterceptorEvents {
	/**
	 * This will be feed with `requested` events
	 */
	get requestIntercepted(): Observable<ObliqueRequest> {
		return this.requestIntercepted$;
	}

	/**
	 * This will be feed with `expired` events
	 */
	get sessionExpired(): Observable<void> {
		return this.sessionExpired$;
	}

	// INFO: this is only protected to support unit tests
	protected requested = new Subject<ObliqueRequest>();
	protected expired = new Subject<void>();

	private readonly requestIntercepted$ = this.requested.asObservable();
	private readonly sessionExpired$ = this.expired.asObservable();

	/**
	 * Fire an `expire` event
	 */
	public sessionExpire(): void {
		this.expired.next();
	}

	/**
	 * Fire an `requesteed` event
	 */
	public requestIntercept(request: ObliqueRequest): void {
		this.requested.next(request);
	}
}
