import {SelectionModel} from '@angular/cdk/collections';
import {Component} from '@angular/core';
import {ObNavTreeItemModel} from '@oblique/oblique';

@Component({
	selector: 'sb-table-page',
	templateUrl: './table-page.component.html',
	styleUrls: ['./table-page.component.scss'],
	standalone: false
})
export class TablePageComponent {
	selection = new SelectionModel<any>(true, []);
	displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol', 'actions'];
	dataSource = [
		{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
		{position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
		{position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
		{position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
		{position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
		{position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
		{position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
		{position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
		{position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
		{position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'}
	];

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

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	toggleAllRows(): void {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}

		this.selection.select(...this.dataSource);
	}
}
