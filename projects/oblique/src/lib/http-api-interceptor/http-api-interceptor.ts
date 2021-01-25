import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

import {ObNotificationService} from '../notification/notification.module';
import {ObSpinnerService} from '../spinner/spinner.module';
import {ObHttpApiInterceptorConfig} from './http-api-interceptor.config';
import {ObHttpApiInterceptorEvents, ObIHttpApiRequest, ObIHttpApiRequestNotification} from './http-api-interceptor.events';
import Timer = NodeJS.Timer;

@Injectable({providedIn: 'root'})
export class ObHttpApiInterceptor implements HttpInterceptor {
	private readonly activeRequestUrls: string[] = [];

	constructor(
		private readonly config: ObHttpApiInterceptorConfig,
		private readonly interceptorEvents: ObHttpApiInterceptorEvents,
		private readonly spinner: ObSpinnerService,
		private readonly notificationService: ObNotificationService
	) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const obliqueRequest = this.broadcast();
		const timer = this.setTimer();
		this.activateSpinner(obliqueRequest.spinner, request.url);

		return next.handle(request.clone(this.isApiCall(request.url) ? {headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')} : undefined)).pipe(
			catchError(error => {
				if (error instanceof HttpErrorResponse) {
					if (error.status === 401) {
						this.interceptorEvents.sessionExpire();
					} else {
						this.notify(obliqueRequest.notification, error);
					}
				} else {
					this.notificationService.error('i18n.oblique.http.error.general');
				}
				throw error;
			}),
			finalize(() => {
				clearTimeout(timer);
				this.deactivateSpinner(obliqueRequest.spinner, request.url);
			})
		);
	}

	private setTimer(): Timer {
		// prettier-ignore
		return !this.config.timeout
			? undefined
			: setTimeout(() => this.notificationService.warning('i18n.oblique.http.error.timeout'), this.config.timeout);
	}

	private broadcast(): ObIHttpApiRequest {
		const evt: ObIHttpApiRequest = {
			notification: this.config.api.notification,
			spinner: this.config.api.spinner
		};
		this.interceptorEvents.requestIntercept(evt);

		return evt;
	}

	private activateSpinner(isSpinnerActive: boolean, url: string): void {
		if (isSpinnerActive && this.isApiCall(url)) {
			this.activeRequestUrls.push(url);
			this.spinner.activate();
		}
	}

	private deactivateSpinner(isSpinnerActive: boolean, url: string): void {
		if (isSpinnerActive && this.isApiCall(url)) {
			const request = this.activeRequestUrls.filter(activeRequestUrl => activeRequestUrl === url).pop();
			if (request) {
				this.activeRequestUrls.splice(this.activeRequestUrls.indexOf(request), 1);
			}
			if (!this.activeRequestUrls.length) {
				this.spinner.forceDeactivate();
			}
		}
	}

	private notify(notification: ObIHttpApiRequestNotification, error: HttpErrorResponse): void {
		if (notification.active || error.status >= 500 || error.status === 0) {
			this.notificationService.send({
				message: notification.text || `i18n.oblique.http.error.status.${error.status}`,
				title: notification.title || error.statusText,
				type: notification.severity,
				sticky: notification.sticky
			});
		}
	}

	private isApiCall(url: string): boolean {
		return url.indexOf(this.config.api.url) > -1;
	}
}
