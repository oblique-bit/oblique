//TODO: remove if codelyzer 4 is out
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {merge, takeUntil} from 'rxjs/operators';
import {ObNavTreeComponent, ObNavTreeItemModel} from 'oblique';
import {Subject} from 'rxjs';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-nav-tree-sample',
	templateUrl: './nav-tree-sample.component.html'
})
export class ObNavTreeSampleComponent implements OnInit, OnDestroy {
	public items: Array<ObNavTreeItemModel>;
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
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-nav-tree-detail-sample',
	template: ` <div *ngIf="routing" class="card">
		<div class="card-header">
			<h3 class="card-title">Output</h3>
		</div>
		<div class="card-body">
			<h4>RouterOutlet</h4>
			<span class="fa fa-link"></span>
			<code>{{ routing }}</code>
		</div>
	</div>`
})
export class ObNavTreeDetailSampleComponent implements OnInit, OnDestroy {
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
