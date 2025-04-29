import {Injectable, inject} from '@angular/core';
import type {Resolve} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import type {Observable} from 'rxjs';

@Injectable()
export class SampleDataResolver implements Resolve<unknown> {
	private readonly http = inject(HttpClient);

	resolve(): Observable<unknown> {
		return this.http.get('./assets/sample-data.json');
	}
}
