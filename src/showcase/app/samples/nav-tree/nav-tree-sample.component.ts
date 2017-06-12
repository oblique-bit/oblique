//TODO: remove if codelyzer 4 is out
/* tslint:disable no-access-missing-member */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NavTreeItemModel} from '../../../../lib/ng/nav-tree/nav-tree-item.model';
import {NavTreeComponent} from '../../../../lib/ng/nav-tree/nav-tree.component';

@Component({
	selector: 'nav-tree-sample',
	templateUrl: './nav-tree-sample.component.html'
})
export class NavTreeSampleComponent implements OnInit {

	public items: Array<NavTreeItemModel>;
	public variant = NavTreeComponent.DEFAULTS.VARIANT;

	public filter = {
		pattern: null,
		clear: () => {
			this.filter.pattern = null;
		}
	};

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.route.data.subscribe((data: {sample: any}) => {
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
			<div class="card-block">
				<h4>RouterOutlet</h4>
				<span class="fa fa-link"></span>
				<code>{{routing}}</code>
			</div>
		</div>`
})
export class NavTreeDetailSampleComponent implements OnInit {

	public routing: string;

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.route.params
			.subscribe((params: Params) => {
				this.routing = params['section'] +
					(params['subsection'] ? '/' + params['subsection'] : '') +
					(params['subsubsection'] ? '/' + params['subsubsection'] : '')
			});
	}
}
