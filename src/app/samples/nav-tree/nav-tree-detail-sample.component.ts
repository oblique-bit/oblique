import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {merge, takeUntil} from 'rxjs/operators';

@Component({
	selector: 'sc-nav-tree-detail-sample',
	templateUrl: './nav-tree-detail-sample.component.html'
})
export class NavTreeDetailSampleComponent implements OnInit, OnDestroy {
	routing: string;
	private readonly unsubscribe = new Subject();

	constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

	ngOnInit(): void {
		this.route.params.pipe(merge(this.route.fragment), takeUntil(this.unsubscribe)).subscribe(() => {
			this.routing = this.router.routerState.snapshot.url;
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
