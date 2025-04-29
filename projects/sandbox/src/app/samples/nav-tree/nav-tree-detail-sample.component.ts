import {Component, type Signal, inject} from '@angular/core';
import {ActivatedRoute, type Params} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {type Observable, filter, map} from 'rxjs';

@Component({
	selector: 'sb-nav-tree-detail-sample',
	templateUrl: './nav-tree-detail-sample.component.html',
	standalone: false
})
export class NavTreeDetailSampleComponent {
	readonly url: Signal<{param: string; value: string}[]>;
	readonly queryParams: Signal<{param: string; value: string}[]>;
	readonly fragment: Signal<string>;

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
