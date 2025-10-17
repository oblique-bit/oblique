import {Component} from '@angular/core';
import type {ObNavTreeItemModel} from '@oblique/oblique';

@Component({
	selector: 'sb-nav-page',
	standalone: false,
	templateUrl: './nav-page.component.html'
})
export class NavPageComponent {
	items: ObNavTreeItemModel[] = [
		{
			id: 'tree-item-1',
			label: 'Item 1',
			routes: [],
			items: [
				{
					id: 'tree-item-1-1',
					label: 'Item 1.1',
					routes: [],
					items: [
						{
							id: 'tree-item-1-1-1',
							label: 'Item 1.1.1',
							routes: [],
							items: [
								{
									id: 'tree-item-1-1-1-1',
									label: 'Item 1.1.1.1',
									routes: []
								}
							]
						}
					]
				}
			]
		},
		{
			id: 'tree-item-2',
			label: 'Item 2',
			routes: [],
			items: [
				{
					id: 'tree-item-2-1',
					label: 'Item 2.1',
					routes: [],
					items: [
						{
							id: 'tree-item-2-1-1',
							label: 'Item 2.1.1',
							routes: [],
							items: [
								{
									id: 'tree-item-2-1-1-1',
									label: 'Item 2.1.1.1',
									routes: []
								}
							]
						}
					]
				}
			]
		}
	];
}
