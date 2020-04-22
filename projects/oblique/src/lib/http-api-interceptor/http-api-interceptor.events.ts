import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {take} from 'rxjs/operators';
import {ObENotificationType} from '../notification/notification.interfaces';

export interface ObIHttpApiRequest {
	notification: {
		active: boolean;
		severity: ObENotificationType;
		title: string;
		text: string;
		sticky: boolean;
	};
	spinner: boolean;
}

/**
 * Provides access to the Oblique HTTP Interceptor events.
 */
@Injectable({providedIn: 'root'})
export class ObHttpApiInterceptorEvents {
	// INFO: this is only protected to support unit tests
	protected requested = new Subject<ObIHttpApiRequest>();
	protected expired = new Subject<void>();
	private readonly requestIntercepted$ = this.requested.asObservable();
	private readonly sessionExpired$ = this.expired.asObservable();

	/**
	 * This will be feed with `requested` events
	 */
	get requestIntercepted(): Observable<ObIHttpApiRequest> {
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
	public requestIntercept(request: ObIHttpApiRequest): void {
		this.requested.next(request);
	}

	public deactivateSpinnerOnNextAPICalls(number = 1): void {
		this.requestIntercepted.pipe(take(number)).subscribe((evt: ObIHttpApiRequest) => {
			evt.spinner = false;
		});
	}

	public deactivateNotificationOnNextAPICalls(number = 1): void {
		this.requestIntercepted.pipe(take(number)).subscribe((evt: ObIHttpApiRequest) => {
			evt.notification.active = false;
		});
	}

	public deactivateOnNextAPICalls(number = 1): void {
		this.requestIntercepted.pipe(take(number)).subscribe((evt: ObIHttpApiRequest) => {
			evt.notification.active = false;
			evt.spinner = false;
		});
	}
}
