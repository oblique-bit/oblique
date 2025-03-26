import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule} from '@oblique/oblique';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSort, MatSortModule} from '@angular/material/sort';

@Component({
	selector: 'app-table',
	templateUrl: './material-table-example-sortable-preview.component.html',
	imports: [MatTableModule, MatSortModule, MatCheckboxModule, MatIconModule, MatButtonModule, ObButtonModule]
})
export class MaterialTableExampleSortablePreviewComponent implements AfterViewInit {
	displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
	dataSource = new MatTableDataSource([
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
	]);
	@ViewChild(MatSort) sort: MatSort;
	ngAfterViewInit(): void {
		this.dataSource.sort = this.sort;
	}
}
