import {Component} from '@angular/core';
import {NotificationService, NotificationConfig, NotificationType} from '../../../../lib';
import {HttpClient} from '@angular/common/http';
import {ObliqueHttpInterceptorConfig} from '../../../../lib/ng/http';

@Component({
	selector: 'oblique-http-interceptor-sample',
	templateUrl: './http-interceptor-sample.component.html'
})
export class HttpInterceptorSampleComponent {

	public API_URL = 'https://jsonplaceholder.typicode.com';

	logs = [];

	constructor(private notificationService: NotificationService,
				private http: HttpClient,
				private config: ObliqueHttpInterceptorConfig) {
		// Redefine default API URL for showcase sample only:
		this.config.api.url = this.API_URL;
	}

	request200() {
		const url = this.API_URL + '/users';
		this.log(`GET ${url}, expecting 200 OK...`);
		this.http.get(url).subscribe(
			data => {
				this.log(`Received: ${data}`);
			}
		)
	}

	request404() {
		const url = 'https://jsonplaceholder.typicode.com/unknown';
		this.log(`GET ${url}, expecting 404 NOT FOUND...`);
		this.http.get(url).subscribe(
			data => {
				this.log(`Received: ${data}`);
			}
		)
	}

	// Debug:
	log(message: string) {
		this.logs.unshift(`${this.logs.length} - ${message}`);
	}
}
