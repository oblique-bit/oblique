import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SampleDataResolver implements Resolve<any> {

	constructor(private http: Http) {
	}

	resolve(): Promise<any> {
		return this.http.get('./assets/sample-data.json').toPromise().then(response => {
			return Promise.resolve(response.json());
		});
	}
}
