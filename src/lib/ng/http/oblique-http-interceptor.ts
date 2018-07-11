import {Injectable} from '@angular/core';
import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse
} from '@angular/common/http';

import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/internal/operators';
import {NotificationConfig, NotificationService, NotificationType} from '../notification';
import {SpinnerService} from '../spinner';
import {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';

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
		let requestStatus: string;
		const obliqueRequest = this.broadcast();
		this.activateSpinner(obliqueRequest.spinner, request.url);
		return next.handle(request).pipe(
			tap(
				(event: HttpEvent<any>) => {
					requestStatus = event instanceof HttpResponse ? 'succeeded' : 'Unknown response event?';
				},
				error => {
					if (error instanceof HttpErrorResponse) {
						requestStatus = 'failed';
						this.notify(obliqueRequest.notification, error);
					} else {
						requestStatus = 'Unknown response error?';
					}
				}
			),
			finalize(() => this.deactivateSpinner(obliqueRequest.spinner, request.url))
		);
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
