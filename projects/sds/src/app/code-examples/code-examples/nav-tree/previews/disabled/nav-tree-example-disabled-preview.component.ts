import {Component, OnInit} from '@angular/core';
import {ObNavTreeItemModel, ObNavTreeModule} from '@oblique/oblique';

@Component({
	selector: 'app-nav-tree-example-disabled-preview',
	templateUrl: './nav-tree-example-disabled-preview.component.html',
	imports: [ObNavTreeModule]
})
export class NavTreeExampleDisabledPreviewComponent implements OnInit {
	public items: ObNavTreeItemModel[];
	private readonly tree = {
		label: 'Navigation Tree',
		items: [
			{
				id: 'tree-item-1',
				label: 'Disabled Tree item 1',
				disabled: true
			},
			{
				id: 'tree-item-2',
				label: 'New to Oblique? Sign up!',
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
