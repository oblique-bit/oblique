import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import {finalize, tap} from 'rxjs/internal/operators';
import {NotificationService} from '../notification';
import {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
import {SpinnerService} from '../spinner';

@Injectable()
export class ObliqueHttpInterceptor implements HttpInterceptor {

	// TODO: event emitter here

	constructor(private config: ObliqueHttpInterceptorConfig,
				private spinner: SpinnerService,
				private notificationService: NotificationService) {

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const started = Date.now();
		let ok: string;

		console.log(request.url);

		if (!this.isSilent(request) && !this.isBackground(request) && this.isApiCall(request.url)) {
			this.spinner.activate();
		}

		return next.handle(request).pipe(
			tap(
				(event: HttpEvent<any>) => {
					if (event instanceof HttpResponse) {
						// this.loadingService.stop();
						ok = 'succeeded';
					} else {
						ok = 'Unknown response event?';
					}
				},
				error => {
					// this.loadingService.stop();
					if (error instanceof HttpErrorResponse) {
						ok = 'failed';

						// TODO
						// Emit event for a possible business handling:
						// let e = ...;
						// eventEmitter.emit(e);

						// if(!e.prevented) {
						// 	// Handle response error here:
						// }

					} else {
						ok = 'Unknown response error?';
					}
				}
			),
			// Log when response observable either completes or errors
			finalize(() => {
				this.spinner.deactivate();
				const elapsed = Date.now() - started;
				const msg = `${request.method} "${request.urlWithParams}" ${ok} in ${elapsed} ms.`;
				this.notificationService.info(msg);
			})
		);
	}

	private isApiCall(url: string): boolean {
		return url.indexOf(this.config.api.url) > -1;
	}

	/**
	 * Checks if the current request should be silenced in case of response error.
	 *
	 * For example, an application may try to authenticate user during application startup
	 * but no error should be notified if we can't authenticate the user.
	 *
	 * @param {HttpRequest<any>} request
	 * @returns {boolean}
	 */
	private isSilent(request: HttpRequest<any>): boolean {
		//return config && (config.silent || (config.data && config.data.silent));
		return false;
	}


	/**
	 * Checks if the current request should run in the background,
	 * i.e. user should not get any visual feedback about the running request.
	 *
	 * For example, a change on a form control may trigger an asynchronous
	 * request to fetch date for another dependent form control. In that case,
	 * we don't
	 *
	 * @param {HttpRequest<any>} request
	 * @returns {boolean}
	 */
	private isBackground(request: HttpRequest<any>): boolean {
		//return config && (config.background || (config.data && config.data.background));
		return false;
	}
}
