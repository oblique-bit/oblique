import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NavTreeItemModel} from '../../../../src/nav-tree/nav-tree-item.model';

@Component({
	selector: 'nav-tree-sample',
	templateUrl: './nav-tree-sample.component.html'
})
export class NavTreeSampleComponent implements OnInit {

	public items: Array<NavTreeItemModel>;

	public filter = {
		pattern: null,
		clear: () => {
			this.filter.pattern = null;
		}
	};

	public linkBuilder(item: NavTreeItemModel) {
		return `item-${item.id}`;
	}

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
		<div *ngIf="id" class="card">
			<div class="card-header">
				<h3 class="card-title">Output</h3>
			</div>
			<div class="card-block">
				<h4>RouterOutlet</h4>
				<span class="fa fa-link"></span>
				<code>{{id}}</code>
			</div>
		</div> 
	`
})
export class NavTreeDetailSampleComponent implements OnInit {

	public id: string;

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.route.params
			.map((params: Params) => params['id'])
			.subscribe((id: string) => this.id = id);
	}
}
