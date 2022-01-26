import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {merge, takeUntil} from 'rxjs/operators';
import {ObNavTreeComponent, ObNavTreeItemModel} from '@oblique/oblique';
import {Subject} from 'rxjs';

@Component({
	selector: 'sc-nav-tree-sample',
	templateUrl: './nav-tree-sample.component.html'
})
export class NavTreeSampleComponent implements OnInit, OnDestroy {
	public items: ObNavTreeItemModel[];
	public variant = ObNavTreeComponent.DEFAULTS.VARIANT;
	public activateAncestors = true;
	public useFakeFocus = false;

	public filter = {
		pattern: null,
		clear: () => {
			this.filter.pattern = null;
		}
	};
	private readonly unsubscribe = new Subject();

	constructor(private readonly route: ActivatedRoute) {}

	ngOnInit() {
		this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe((data: {sample: any}) => {
			this.items = data.sample.navTree.items.map((item: any) => new ObNavTreeItemModel(item));
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}

@Component({
	selector: 'sc-nav-tree-detail-sample',
	templateUrl: './nav-tree-detail-sample.component.html'
})
export class NavTreeDetailSampleComponent implements OnInit, OnDestroy {
	routing: string;
	private readonly unsubscribe = new Subject();

	constructor(private readonly route: ActivatedRoute, private readonly router: Router) {}

	ngOnInit() {
		this.route.params.pipe(merge(this.route.fragment), takeUntil(this.unsubscribe)).subscribe(() => {
			this.routing = this.router.routerState.snapshot.url;
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
