import {Component, Signal, inject} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {Observable, filter, map} from 'rxjs';

@Component({
	selector: 'sb-nav-tree-detail-sample',
	templateUrl: './nav-tree-detail-sample.component.html',
	standalone: false
})
export class NavTreeDetailSampleComponent {
	url: Signal<{param: string; value: string}[]>;
	queryParams: Signal<{param: string; value: string}[]>;
	fragment: Signal<string>;

	constructor() {
		const route = inject(ActivatedRoute);
		this.url = toSignal(route.params.pipe(this.paramsToArray()));
		this.queryParams = toSignal(route.queryParams.pipe(this.paramsToArray()));
		this.fragment = toSignal(route.fragment);
	}

	private paramsToArray(): (source$: Observable<Params>) => Observable<{param: string; value: string}[]> {
		return source$ =>
			source$.pipe(
				map(params => Object.entries(params).map(([param, value]) => ({param, value}))),
				filter(params => params.length > 0)
			);
	}
}
