import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {NavTreeItemModel} from '../../../../src/nav-tree/nav-tree-item.model';

@Component({
	selector: 'nav-tree-sample',
	templateUrl: './nav-tree-sample.component.html'
})
export class NavTreeSampleComponent implements OnInit {

	public search = {
		pattern: null,
		results: [],
		count: 0,
		clear: () => {
			this.search.pattern = null;
		}
	};

	public items: Array<NavTreeItemModel>;

	constructor(private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.route.data
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
		<code>{{id}}</code>
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
