import type {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable, inject} from '@angular/core';
import {ObSpinnerService} from '@oblique/oblique';
import {type Observable, throwError} from 'rxjs';
import {catchError, finalize} from 'rxjs/operators';

@Injectable()
export class HttpApiInterceptor implements HttpInterceptor {
	private readonly spinner = inject(ObSpinnerService);
	private readonly activeRequestUrls: string[] = [];

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.activateSpinner(request.url);

		return next.handle(request).pipe(
			catchError((error: unknown) => throwError({error, handled: false})),
			catchError((error: {error: unknown}) => throwError(error.error)),
			finalize(() => {
				this.deactivateSpinner(request.url);
			})
		);
	}

	private activateSpinner(url: string): void {
		this.activeRequestUrls.push(url);
		this.spinner.activate('main');
	}

	private deactivateSpinner(url: string): void {
		const request = this.activeRequestUrls.filter(activeRequestUrl => activeRequestUrl === url).pop();
		if (request) {
			this.activeRequestUrls.splice(this.activeRequestUrls.indexOf(request), 1);
		}
		if (!this.activeRequestUrls.length) {
			this.spinner.forceDeactivate('main');
		}
	}
}
