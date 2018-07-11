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
import {NotificationService} from '../notification';
import {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
import {SpinnerService} from '../spinner';

/**
 * @param {isSilent} boolean
 * Checks if the current request should be silenced in case of response error, i.e. no notification will be shown
 * For example, an application may try to authenticate user during application startup
 * but no error should be notified if we can't authenticate the user.
 *
 * @param {isBackground} boolean
 * Checks if the current request should run in the background, i.e. no spinner will be shown.
 * For example, a change on a form control may trigger an asynchronous request to fetch data for another dependent form control.
 * @returns {boolean}
 */
export interface ObliqueRequest {
	isSilent: boolean;
	isBackground: boolean;
}

@Injectable()
export class ObliqueHttpInterceptor implements HttpInterceptor {

	// TODO: event emitter here

	constructor(private config: ObliqueHttpInterceptorConfig,
				private spinner: SpinnerService,
				private notificationService: NotificationService) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const started = Date.now();
		let requestStatus: string;

		const obliqueRequest = this.activateSpinner(request.url);
		return next.handle(request).pipe(
			tap(
				(event: HttpEvent<any>) => {
					requestStatus = event instanceof HttpResponse ? 'succeeded' : 'Unknown response event?';
				},
				error => {
					if (error instanceof HttpErrorResponse) {
						requestStatus = 'failed';

						if (!obliqueRequest.isSilent || error.status >= 500 || error.status === 0) {
							console.log(error);
							this.notificationService.error('i18n.error.http.status.' + error.status, error.statusText);
						}
						// TODO
						// Emit event for a possible business handling:
						// let e = ...;
						// eventEmitter.emit(e);

						// if(!e.prevented) {
						// 	// Handle response error here:
						// }

					} else {
						requestStatus = 'Unknown response error?';
					}
				}
			),
			// Log when response observable either completes or errors
			finalize(() => {
				this.deactivateSpinner(obliqueRequest, request.url);
				const elapsed = Date.now() - started;
				const msg = `${request.method} "${request.urlWithParams}" ${requestStatus} in ${elapsed} ms.`;
				this.notificationService.info(msg);
			})
		);
	}

	private activateSpinner(url: string): ObliqueRequest {
		const evt: ObliqueRequest = {isSilent: false, isBackground: false};
		this.config.requested.emit(evt);
		if (!evt.isSilent && !evt.isBackground && this.isApiCall(url)) {
			console.log('activate spinner');
			this.spinner.activate();
		}
		return evt;
	}

	private deactivateSpinner(evt: ObliqueRequest, url: string): void {
		if (!evt.isSilent && !evt.isBackground && this.isApiCall(url)) {
			console.log('deactivate spinner');
			this.spinner.deactivate();
		}
	}

	private isApiCall(url: string): boolean {
		return url.indexOf(this.config.api.url) > -1;
	}
}
