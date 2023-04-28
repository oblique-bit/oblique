import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {takeUntil} from 'rxjs/operators';
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

	public filter = {
		pattern: null,
		clear: (): void => {
			this.filter.pattern = null;
		}
	};
	private readonly unsubscribe = new Subject<void>();

	constructor(private readonly route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe((data: {sample: any}) => {
			this.items = data.sample.navTree.items.map((item: any) => new ObNavTreeItemModel(item));
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
