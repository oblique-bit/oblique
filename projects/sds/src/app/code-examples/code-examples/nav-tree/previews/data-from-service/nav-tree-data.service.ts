import {Injectable} from '@angular/core';
import {ObNavTreeItemModel} from '@oblique/oblique';
import {Observable, of} from 'rxjs';

@Injectable({providedIn: 'root'})
export class DataService {
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

	getData(): Observable<ObNavTreeItemModel[]> {
		return of(this.tree.items.map(item => new ObNavTreeItemModel(item)));
	}
}
