//TODO: remove if codelyzer 4 is out
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {merge, takeUntil} from 'rxjs/operators';
import {NavTreeComponent, NavTreeItemModel, Unsubscribable} from 'oblique-reactive';

@Component({
	selector: 'nav-tree-sample',
	templateUrl: './nav-tree-sample.component.html'
})
export class NavTreeSampleComponent extends Unsubscribable implements OnInit {

	public items: Array<NavTreeItemModel>;
	public variant = NavTreeComponent.DEFAULTS.VARIANT;
	public activateAncestors = true;
	public useFakeFocus = true;

	public filter = {
		pattern: null,
		clear: () => {
			this.filter.pattern = null;
		}
	};

	constructor(private readonly route: ActivatedRoute) {
		super();
	}

	ngOnInit() {
		this.route.data.pipe(takeUntil(this.unsubscribe))
			.subscribe((data: {sample: any}) => {
				this.items = data.sample.navTree.items.map((item: any) => {
					return new NavTreeItemModel(item);
				});
			});
	}
}

@Component({
	selector: 'nav-tree-detail-sample',
	template: `
		<div *ngIf="routing" class="card">
			<div class="card-header">
				<h3 class="card-title">Output</h3>
			</div>
			<div class="card-body">
				<h4>RouterOutlet</h4>
				<span class="fa fa-link"></span>
				<code>{{routing}}</code>
			</div>
		</div>`
})
export class NavTreeDetailSampleComponent extends Unsubscribable implements OnInit {
	routing: string;

	constructor(private readonly route: ActivatedRoute, private readonly router: Router) {
		super();
	}

	ngOnInit() {
		this.route.params
			.pipe(merge(this.route.fragment), takeUntil(this.unsubscribe))
			.subscribe(() => {
				this.routing = this.router.routerState.snapshot.url;
			});
	}
}

