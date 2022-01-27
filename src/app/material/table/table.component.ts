import {Component, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {ObIPeriodicElement} from './table.model';

@Component({
	selector: 'sc-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	@ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

	ELEMENT_DATA: ObIPeriodicElement[] = [
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
	dataSource = new MatTableDataSource<ObIPeriodicElement>(this.ELEMENT_DATA);
	pageSizeOptions = [10, 5, 2];
	displayedColumns: string[];
	tableClasses: string[] = [];
	tableParentClasses: string[] = [];
	obliqueStylingActive = false;
	flexTable = false;

	readonly COLUMN_NAME_POSITION = 'position';
	readonly COLUMN_NAME_NAME = 'name';
	readonly COLUMN_NAME_WEIGHT = 'weight';
	readonly COLUMN_NAME_SYMBOL = 'symbol';
	readonly COLUMN_NAME_SELECT = 'select';

	readonly OBLIQUE_CLASS_TABLE = 'ob-table';
	readonly OBLIQUE_CLASS_TABLE_CICD = 'ob-table-cicd';
	readonly OBLIQUE_CLASS_TABLE_SM = 'ob-table-sm';
	readonly OBLIQUE_CLASS_TABLE_LG = 'ob-table-lg';
	readonly OBLIQUE_CLASS_TABLE_PLAIN = 'ob-table-plain';
	readonly OBLIQUE_CLASS_TABLE_COLLAPSE = 'ob-table-collapse';

	private readonly selection = new SelectionModel<ObIPeriodicElement>(true, []);
	private totalWeight: number;
	private readonly SORT_DIRECTION_ASCENDING = 'asc';
	private readonly SORT_DIRECTION_DESCENDING = 'desc';

	ngOnInit(): void {
		this.displayedColumns = [this.COLUMN_NAME_POSITION, this.COLUMN_NAME_NAME, this.COLUMN_NAME_WEIGHT, this.COLUMN_NAME_SYMBOL];
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
		this.updateFooterRow();
		this.paginator.page.subscribe(page => {
			this.updateFooterRowByPage(page);
		});
	}

	updateFooterRow(): void {
		this.totalWeight = this.dataSource.data.map(x => x.weight).reduce((a, b) => a + b, 0);
	}

	updateFooterRowByPage(page: PageEvent): void {
		const elementsCount = (page.pageIndex + 1) * page.pageSize;
		const firstIndex = page.pageIndex * page.pageSize;
		const visibleElements = this.dataSource.data.slice(firstIndex, firstIndex + elementsCount);
		this.totalWeight = visibleElements.map(x => x.weight).reduce((a, b) => a + b, 0);
	}

	applyFilter(event): void {
		const filter = event.target.value;
		if (filter === undefined) {
			this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
		} else {
			this.dataSource = new MatTableDataSource(this.ELEMENT_DATA.filter(element => element.name.toLowerCase().includes(filter.trim().toLowerCase())));
		}
		this.updateFooterRow();
	}

	isAllSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	masterToggle(): void {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.dataSource.data.forEach(row => this.selection.select(row));
		}
	}

	toggleSelectionVisibility(): void {
		if (this.displayedColumns.indexOf(this.COLUMN_NAME_SELECT) === 0) {
			this.displayedColumns.shift();
		} else {
			this.displayedColumns.unshift(this.COLUMN_NAME_SELECT);
		}
	}

	toggleFlexTableVisibility(): void {
		this.flexTable = !this.flexTable;
	}

	toggleTableClass(stylingClass: string): void {
		if (this.tableClasses.includes(stylingClass)) {
			if (stylingClass === this.OBLIQUE_CLASS_TABLE) {
				this.obliqueStylingActive = false;
			}
			this.tableClasses.splice(this.tableClasses.indexOf(stylingClass), 1);
		} else {
			if (stylingClass === this.OBLIQUE_CLASS_TABLE) {
				this.obliqueStylingActive = true;
			}
			if (this.obliqueStylingActive) {
				this.tableClasses.push(stylingClass);
			}
		}
	}

	toggleTableParentClass(stylingClass: string): void {
		if (this.tableParentClasses.includes(stylingClass)) {
			this.tableParentClasses.splice(this.tableParentClasses.indexOf(stylingClass), 1);
		} else {
			this.tableParentClasses.push(stylingClass);
		}
	}

	sortData(event: any): void {
		const sortColumn = event.active;
		const sortDirection = event.direction;
		this.dataSource = new MatTableDataSource(
			this.ELEMENT_DATA.sort((left, right) => {
				switch (sortDirection) {
					case this.SORT_DIRECTION_ASCENDING:
						return this.sortAscending(left, right, sortColumn);
					case this.SORT_DIRECTION_DESCENDING:
						return this.sortDescending(left, right, sortColumn);
					default:
						return this.sortAscending(left, right, sortColumn);
				}
			})
		);
	}

	private sortAscending(left: ObIPeriodicElement, right: ObIPeriodicElement, sortColumn: string): number {
		if (left[sortColumn] > right[sortColumn]) {
			return 1;
		} else if (left[sortColumn] === right[sortColumn]) {
			return 0;
		}
		return -1;
	}

	private sortDescending(left: ObIPeriodicElement, right: ObIPeriodicElement, sortColumn: string): number {
		if (right[sortColumn] > left[sortColumn]) {
			return 1;
		} else if (left[sortColumn] === right[sortColumn]) {
			return 0;
		}
		return -1;
	}
}
