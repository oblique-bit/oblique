import {Component} from '@angular/core';
import {NotificationService, NotificationType, ObliqueRequest} from '../../../../lib';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ObliqueHttpInterceptorConfig} from '../../../../lib/ng/http';
import {first} from 'rxjs/operators';

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
	variants = NotificationType.VALUES;

	constructor(private notificationService: NotificationService,
				private http: HttpClient,
				private config: ObliqueHttpInterceptorConfig) {
		// Redefine default API URL for showcase sample only:
		this.config.api.url = HttpInterceptorSampleComponent.API_URL;
	}

	request200(): void {
		const url = HttpInterceptorSampleComponent.API_URL + '/users';
		this.log(`GET ${url}, expecting: 200 OK...`);
		this.configInterceptor();
		this.sendRequest(url);
	}

	request404(): void {
		const url = HttpInterceptorSampleComponent.API_URL + '/unknown';
		this.log(`GET ${url}, expecting: 404 NOT FOUND...`);
		this.configInterceptor();
		this.sendRequest(url);
	}

	// Debug:
	log(message: string) {
		this.logs.unshift(`${this.logs.length} - ${message}`);
	}

	private configInterceptor() {
		this.config.requestIntercepted.pipe(first()).subscribe((evt: ObliqueRequest) => {
			evt.notification.active = this.notification.active;
			evt.notification.severity = this.notification.severity;
			evt.notification.title = this.notification.title;
			evt.notification.text = this.notification.text;
			evt.notification.config.timeout = this.notification.timeout;
			evt.notification.config.sticky = this.notification.sticky;
			evt.spinner = this.spinner;
		});
	}

	private sendRequest(url: string) {
		const started = Date.now();
		this.http.get(url).subscribe(
			() => {
				const elapsed = Date.now() - started;
				this.log(`Received: 200 OK in ${elapsed} ms.`);
			},
			(error: HttpErrorResponse) => {
				const elapsed = Date.now() - started;
				this.log(`Received: ${error.status} ${error.statusText} in ${elapsed} ms.`);
				if (!this.notification.active) {
					this.notificationService.info('Oblique error handling is disabled. The component itself is responsible for error handling.');
				}
			}
		);
	}
}
