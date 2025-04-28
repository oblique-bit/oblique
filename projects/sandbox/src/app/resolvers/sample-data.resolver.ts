import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class SampleDataResolver implements Resolve<unknown> {
	constructor(private readonly http: HttpClient) {}

	resolve(): Observable<unknown> {
		return this.http.get('./assets/sample-data.json');
	}
}
