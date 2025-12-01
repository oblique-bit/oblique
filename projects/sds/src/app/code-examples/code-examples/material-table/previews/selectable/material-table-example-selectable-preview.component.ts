import {Component} from '@angular/core';
import type {ObIPeriodicElement} from './table.model';
import {TableManager} from './table-manager';
import {AsyncPipe, NgTemplateOutlet} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
	selector: 'app-table',
	imports: [
		AsyncPipe,
		NgTemplateOutlet,
		MatTableModule,
		MatTooltip,
		MatCheckboxModule,
		MatIconModule,
		MatButtonModule,
		ObButtonModule,
	],
	templateUrl: './material-table-example-selectable-preview.component.html',
	styleUrl: './material-table-example-selectable-preview.component.scss',
})
export class MaterialTableExampleSelectablePreviewComponent {
	readonly displayedColumns = ['select', 'position', 'name', 'weight', 'symbol', 'actions'];
	readonly columns = [
		{key: 'position', name: 'No.', type: 'number'},
		{key: 'name', name: 'Name', type: 'text'},
		{key: 'weight', name: 'Weight', type: 'number'},
		{key: 'symbol', name: 'Symbol', type: 'text'},
	];
	readonly tableManager: TableManager<ObIPeriodicElement>;

	private readonly elementData: ObIPeriodicElement[] = [
		{position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
		{position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
		{position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
		{position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
		{position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
		{position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
		{position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
		{position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
		{position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
		{position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
	];

	constructor() {
		this.tableManager = new TableManager<ObIPeriodicElement>(this.elementData);
	}

	addRow(): void {
		this.tableManager.addRow({
			position: 0,
			name: 'EXAMPLIUM',
			weight: 1.2345,
			symbol: 'XYZ',
		});
	}
}
