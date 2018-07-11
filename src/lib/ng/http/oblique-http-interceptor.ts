import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';
import {NotificationConfig, NotificationService, NotificationType} from '../notification';
import {SpinnerService} from '../spinner';
import {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
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

@Injectable()
export class ObliqueHttpInterceptor implements HttpInterceptor {

	constructor(private config: ObliqueHttpInterceptorConfig,
				private spinner: SpinnerService,
				private notificationService: NotificationService) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const obliqueRequest = this.broadcast();
		const timer = this.setTimer();
		this.activateSpinner(obliqueRequest.spinner, request.url);
		return next.handle(request).pipe(
			tap(
				undefined,
				error => {
					if (error instanceof HttpErrorResponse) {
						this.notify(obliqueRequest.notification, error);
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
		this.config.requested.emit(evt);

		return evt;
	}

	private activateSpinner(isSpinnerActive: boolean, url: string): void {
		if (isSpinnerActive && this.isApiCall(url)) {
			console.log('activate spinner');
			this.spinner.activate();
		}
	}

	private deactivateSpinner(isSpinnerActive: boolean, url: string): void {
		if (isSpinnerActive && this.isApiCall(url)) {
			console.log('deactivate spinner');
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
