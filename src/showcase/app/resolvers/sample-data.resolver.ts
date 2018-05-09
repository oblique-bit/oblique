import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class SampleDataResolver implements Resolve<any> {

	constructor(private http: HttpClient) {
	}

	resolve(): Observable<any> {
		return this.http.get('./assets/sample-data.json');
	}
}
