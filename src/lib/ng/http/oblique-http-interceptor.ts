import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import {finalize, tap} from 'rxjs/internal/operators';
import {NotificationService} from '../notification';
import {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
import {SpinnerService} from '../spinner';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class ObliqueHttpInterceptor implements HttpInterceptor {

	constructor(private config: ObliqueHttpInterceptorConfig,
				private spinner: SpinnerService,
				private notificationService: NotificationService) {

	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const started = Date.now();
		let ok: string;

		console.log(request.url);

		if (!ObliqueHttpInterceptor.isSilent(request) && !ObliqueHttpInterceptor.isBackground(request) && ObliqueHttpInterceptor.isApiCall(request.url)) {
			this.spinner.activateSpinner();
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
						//this.errorHandler.handleError(error);
						ok = 'failed';
					} else {
						ok = 'Unknown response error?';
					}
				}
			),
			// Log when response observable either completes or errors
			finalize(() => {
				const elapsed = Date.now() - started;
				const msg = `${request.method} "${request.urlWithParams}" ${ok} in ${elapsed} ms.`;
				this.notificationService.info(msg);
			})
		);
	}

	private isApiCall(url: string): boolean {
		return url.indexOf(this.config.api.url) > -1;
	}

	private static isSilent(request: HttpRequest<any>): boolean {
		//return config && (config.silent || (config.data && config.data.silent));
		return false;
	}


	private static isBackground(request: HttpRequest<any>): boolean {
		//return config && (config.background || (config.data && config.data.background));
		return false;
	}
}
