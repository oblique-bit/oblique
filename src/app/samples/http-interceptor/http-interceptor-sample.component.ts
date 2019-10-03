import {Component} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {NotificationService, NotificationType, ObliqueHttpInterceptorEvents, ObliqueRequest} from 'oblique';
import {delay, mergeMap, take, tap} from 'rxjs/operators';
import {from, Observable} from 'rxjs';
import {HttpMockErrorInterceptor} from './http-mock-error.interceptor';

let requestId = 0;

@Component({
	selector: 'oblique-http-interceptor-sample',
	templateUrl: './http-interceptor-sample.component.html'
})
export class HttpInterceptorSampleComponent {

	static readonly API_URL = 'https://jsonplaceholder.typicode.com';
	logs = [];
	notification = {
		active: true,
		severity: NotificationType.ERROR,
		title: undefined,
		text: undefined,
		sticky: false,
		timeout: 3500
	};
	spinner = true;
	variants = NotificationType;
	parallelRequests = 5;

	constructor(private readonly notificationService: NotificationService,
				private readonly http: HttpClient,
				private readonly interceptorEvents: ObliqueHttpInterceptorEvents) {

		this.interceptorEvents.sessionExpired.subscribe(() => {
			this.notificationService.warning('The session has expired');
		});
	}

	request(code: number): void {
		this.configInterceptor();

		this.createSampleRequest(code).subscribe();
	}

	parallelRequest() {
		this.configInterceptor();
		const arrayOfObservables: Array<Observable<any>> = [];
		for (let index = 0; index < this.parallelRequests; index++) {
			arrayOfObservables.push(this.createSampleRequest(200));
		}

		const mergedObservable = from(arrayOfObservables).pipe(
			mergeMap(save => save)
		);

		mergedObservable.subscribe();
	}

	log(message: string) {
		this.logs.unshift(message);
	}

	private static getUrl(code: number): string {
		if (code === 200) {
			return HttpInterceptorSampleComponent.API_URL + '/users';
		}
		return HttpInterceptorSampleComponent.API_URL + '/' + code;
	}

	private createSampleRequest(code: number): Observable<any> {
		const url = HttpInterceptorSampleComponent.getUrl(code);
		this.log(`${++requestId} - GET ${url}, expecting: ${code} ${HttpMockErrorInterceptor.getStatusText(code)}...`);
		return this.createRequest(url, requestId);
	}

	private configInterceptor(number = 1): void {
		this.interceptorEvents.requestIntercepted.pipe(take(number)).subscribe((evt: ObliqueRequest) => {
			evt.notification.active = this.notification.active;
			evt.notification.severity = this.notification.severity;
			evt.notification.title = this.notification.title;
			evt.notification.text = this.notification.text;
			evt.notification.sticky = this.notification.sticky;
			evt.spinner = this.spinner;
		});
	}

	private createRequest(url: string, currentId: number): Observable<any> {
		const started = Date.now();
		const d = Math.ceil(Math.random() * 1000);
		return this.http.get(url).pipe(
			delay(d),
			tap(
				() => {
					const elapsed = Date.now() - started;
					this.log(`${currentId} - Received 200 OK in ${elapsed} ms with ${d} ms delay.`);
				},
				(error: HttpErrorResponse) => {
					const elapsed = Date.now() - started;
					this.log(`${currentId} - Received ${error.status} ${error.statusText} in ${elapsed} ms with ${d} ms delay.`);
					if (!this.notification.active) {
						this.notificationService.info('Oblique error handling is disabled. The component itself is responsible for error handling.');
					}
				}
			)
		);
	}
}
