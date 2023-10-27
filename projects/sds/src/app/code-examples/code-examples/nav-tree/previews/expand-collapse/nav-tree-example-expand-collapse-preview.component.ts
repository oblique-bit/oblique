import {Component, OnInit} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObNavTreeItemModel, ObNavTreeModule} from '@oblique/oblique';

@Component({
	selector: 'app-nav-tree-example-expand-collapse-preview',
	templateUrl: './nav-tree-example-expand-collapse-preview.component.html',
	standalone: true,
	imports: [ObNavTreeModule, MatListModule, ObButtonModule, MatButtonModule],
	styleUrls: ['./nav-tree-example-expand-collapse-preview.component.scss']
})
export class NavTreeExampleExpandCollapsePreviewComponent implements OnInit {
	public items: ObNavTreeItemModel[];
	private readonly tree = {
		label: 'Navigation Tree',
		items: [
			{
				id: 'tree-item-1',
				label: 'Tree item 1'
			},
			{
				id: 'tree-item-2',
				label: 'New to Oblique? Sign up!',
				labelParams: {title: 'Oblique'},
				items: [
					{
						id: 'tree-item-2-1',
						label: 'Tree item 2.1'
					},
					{
						id: 'tree-item-2-2',
						label: 'Tree item 2.2',
						items: [
							{
								id: 'tree-item-2-2-alpha',
								label: 'Tree item 2.2#alpha'
							},
							{
								id: 'tree-item-2-2-beta',
								label: 'Tree item 2.2#beta'
							}
						]
					}
				]
			}
		]
	};

	ngOnInit(): void {
		this.items = this.tree.items.map(item => new ObNavTreeItemModel(item));
	}
}
