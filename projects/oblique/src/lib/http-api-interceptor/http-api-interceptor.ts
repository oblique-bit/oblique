import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';

import {WINDOW} from '../utilities';
import {ObNotificationService} from '../notification/notification.module';
import {ObSpinnerService} from '../spinner/spinner.module';
import {ObHttpApiInterceptorConfig} from './http-api-interceptor.config';
import {ObHttpApiInterceptorEvents} from './http-api-interceptor.events';
import {
	ObIHttpApiRequest,
	ObIHttpApiRequestNotification,
	ObIObliqueHttpErrorResponse,
} from './http-api-interceptor.model';

@Injectable({providedIn: 'root'})
export class ObHttpApiInterceptor implements HttpInterceptor {
	private readonly config = inject(ObHttpApiInterceptorConfig);
	private readonly interceptorEvents = inject(ObHttpApiInterceptorEvents);
	private readonly spinner = inject(ObSpinnerService);
	private readonly notificationService = inject(ObNotificationService);
	private readonly translate = inject(TranslateService);
	private readonly activeRequestUrlsByChannel = new Map<string, string[]>();
	private readonly window = inject<Window>(WINDOW);

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		const obliqueRequest = this.broadcast();
		const timer = this.setTimer();
		this.activateSpinner(obliqueRequest.spinner, obliqueRequest.spinnerChannel, request.url);

		return next.handle(this.setupHeader(request)).pipe(
			catchError(error => throwError(() => ({error, handled: false}))),
			catchError(error => this.handleUnknownError(error)),
			catchError(error => this.handleSessionExpiredError(error)),
			catchError(error => this.handleHttpError(error, obliqueRequest)),
			catchError(error => throwError(() => error.error)),
			finalize(() => {
				clearTimeout(timer);
				this.deactivateSpinner(obliqueRequest.spinner, obliqueRequest.spinnerChannel, request.url);
			})
		);
	}

	private handleUnknownError(error: ObIObliqueHttpErrorResponse): Observable<never> {
		return this.handleError(error, !(error.error instanceof HttpErrorResponse), () => {
			this.notificationService.error('i18n.oblique.http.error.general');
		});
	}

	private handleSessionExpiredError(error: ObIObliqueHttpErrorResponse): Observable<never> {
		return this.handleError(error, error.error.status === 401, () => {
			this.interceptorEvents.sessionExpire();
		});
	}

	private handleHttpError(error: ObIObliqueHttpErrorResponse, obliqueRequest: ObIHttpApiRequest): Observable<never> {
		return this.handleError(error, obliqueRequest.notification.active, () => {
			this.notify(obliqueRequest.notification, error.error);
		});
	}

	private handleError(error: ObIObliqueHttpErrorResponse, hasError: boolean, action: () => void): Observable<never> {
		if (!error.handled && hasError) {
			action();
			error.handled = true;
		}
		return throwError(() => error);
	}

	private setupHeader(request: HttpRequest<unknown>): HttpRequest<unknown> {
		return request.clone(
			this.isApiCall(request.url) ? {headers: request.headers.set('X-Requested-With', 'XMLHttpRequest')} : undefined
		);
	}

	private setTimer(): number {
		// prettier-ignore
		return this.config.timeout
			? this.window.setTimeout(() => this.notificationService.warning('i18n.oblique.http.error.timeout'), this.config.timeout)
			: undefined;
	}

	private broadcast(): ObIHttpApiRequest {
		const evt: ObIHttpApiRequest = {
			notification: this.config.api.notification,
			spinner: this.config.api.spinner,
			spinnerChannel: this.config.api.spinnerChannel,
		};
		this.interceptorEvents.requestIntercept(evt);

		return evt;
	}

	private activateSpinner(isSpinnerActive: boolean, spinnerChannel: string, url: string): void {
		if (isSpinnerActive && this.isApiCall(url)) {
			const activeRequestUrls = this.activeRequestUrlsByChannel.get(spinnerChannel) ?? [];
			activeRequestUrls.push(url);
			this.activeRequestUrlsByChannel.set(spinnerChannel, activeRequestUrls);
			this.spinner.activate(spinnerChannel);
		}
	}

	private deactivateSpinner(isSpinnerActive: boolean, spinnerChannel: string, url: string): void {
		if (isSpinnerActive && this.isApiCall(url)) {
			const activeRequestUrls = this.activeRequestUrlsByChannel.get(spinnerChannel);
			const activeRequestUrlIndex = activeRequestUrls?.findIndex(activeRequestUrl => activeRequestUrl === url);

			if (activeRequestUrlIndex >= 0) {
				activeRequestUrls.splice(activeRequestUrlIndex, 1);
			}

			if (!activeRequestUrls?.length) {
				this.activeRequestUrlsByChannel.delete(spinnerChannel);
				this.spinner.forceDeactivate(spinnerChannel);
			}
		}
	}

	private notify(notification: ObIHttpApiRequestNotification, error: HttpErrorResponse): void {
		const textKey = `i18n.oblique.http.error.status.${error.status}`;
		const titleKey = `i18n.oblique.http.error.status.${error.status}.title`;
		this.translate
			.get([textKey, titleKey])
			.pipe(
				map(texts => ({
					text: texts[textKey] === textKey ? 'i18n.oblique.http.error.general' : textKey,
					title: texts[titleKey] === titleKey ? error.statusText : titleKey,
				}))
			)
			.subscribe(keys => {
				this.notificationService.send({
					message: notification.text || keys.text,
					title: notification.title || keys.title,
					type: notification.severity,
					sticky: notification.sticky,
				});
			});
	}

	private isApiCall(url: string): boolean {
		return url.includes(this.config.api.url);
	}
}
