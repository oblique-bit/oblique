import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SampleDataResolver implements Resolve<any> {

	constructor(private http: Http) {
	}

	resolve(): Observable<any> {
		return this.http.get('./assets/sample-data.json').map(response => response.json());
	}
}
