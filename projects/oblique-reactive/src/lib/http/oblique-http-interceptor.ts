import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';

import {NotificationConfig, NotificationService, NotificationType} from '../notification/notification.module';
import {SpinnerService} from '../spinner/spinner.module';
import {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
import {ObliqueHttpInterceptorEvents} from './oblique-http-interceptor.events';
import Timer = NodeJS.Timer;

export interface ObliqueRequest {
	notification: {
		active: boolean;
		severity: NotificationType;
		title: string;
		text: string;
		config: NotificationConfig;
	};
	spinner: boolean;
}

@Injectable({providedIn: 'root'})
export class ObliqueHttpInterceptor implements HttpInterceptor {
	constructor(private readonly config: ObliqueHttpInterceptorConfig,
		private readonly interceptorEvents: ObliqueHttpInterceptorEvents,
		private readonly spinner: SpinnerService,
		private readonly notificationService: NotificationService) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const obliqueRequest = this.broadcast();
		const timer = this.setTimer();
		this.activateSpinner(obliqueRequest.spinner, request.url);

		return next.handle(request.clone({
			headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')
		})).pipe(
			tap(
				undefined,
				error => {
					if (error instanceof HttpErrorResponse) {
						if (error.status === 401) {
							this.interceptorEvents.sessionExpire();
						} else {
							this.notify(obliqueRequest.notification, error);
						}
					} else {
						this.notificationService.error('i18n.error.general');
					}
				}
			),
			finalize(() => {
				clearTimeout(timer);
				this.deactivateSpinner(obliqueRequest.spinner, request.url);
			})
		);
	}

	private setTimer(): Timer {
		return !this.config.timeout
			? undefined
			: setTimeout(() => {
				this.notificationService.warning('i18n.error.other.timeout');
			}, this.config.timeout);
	}

	private broadcast(): ObliqueRequest {
		const evt: ObliqueRequest = {
			notification: this.config.api.notification,
			spinner: this.config.api.spinner
		};
		this.interceptorEvents.requestIntercept(evt);

		return evt;
	}

	private activateSpinner(isSpinnerActive: boolean, url: string): void {
		if (isSpinnerActive && this.isApiCall(url)) {
			this.spinner.activate();
		}
	}

	private deactivateSpinner(isSpinnerActive: boolean, url: string): void {
		if (isSpinnerActive && this.isApiCall(url)) {
			this.spinner.deactivate();
		}
	}

	private notify(notification: ObliqueRequest['notification'], error: HttpErrorResponse): void {
		if (notification.active || error.status >= 500 || error.status === 0) {
			this.notificationService.send(
				notification.text || 'i18n.error.http.status.' + error.status,
				notification.title || error.statusText,
				notification.severity,
				notification.config
			);
		}
	}

	private isApiCall(url: string): boolean {
		return url.indexOf(this.config.api.url) > -1;
	}
}
