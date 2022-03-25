import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {ObPopUpService} from '@oblique/oblique';
import {Connectable, ReplaySubject, connectable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Data {
	isSelected?: boolean;
}

export class TableManager<T> {
	readonly masterToggleState$: Connectable<string>;
	readonly isMasterRemoveDisabled$: Connectable<boolean>;
	readonly dataSource = new MatTableDataSource<T & Data>();
	private readonly selection = new SelectionModel<T & Data>(true, []);
	private originalData: (T & Data)[];

	constructor(data: (T & Data)[], private readonly popup: ObPopUpService) {
		this.originalData = [...data];
		this.dataSource.data = data.map(data => ({...data, isSelected: false}));

		this.masterToggleState$ = this.buildMasterToggleObservable();
		this.masterToggleState$.connect();

		this.isMasterRemoveDisabled$ = this.buildMasterRemoveObservable();
		this.isMasterRemoveDisabled$.connect();
	}

	setExtras(options: {sort: MatSort; paginator: MatPaginator}): void {
		Object.keys(options).forEach(option => {
			this.dataSource[option] = options[option];
		});
	}

	masterToggle(): void {
		if (this.areAllRowsSelected()) {
			this.selection.clear();
		} else {
			this.dataSource.data.forEach(row => this.selection.select(row));
		}
		this.dataSource.data.forEach(row => (row.isSelected = this.selection.isSelected(row)));
	}

	toggleRow(row: T & Data): void {
		row.isSelected = !row.isSelected;
		this.selection.toggle(row);
	}

	filter(filterFunction: (row: T & Data) => boolean): void {
		this.dataSource.data = this.originalData.filter(filterFunction);
	}

	removeRows(row?: T & Data): void {
		const items = row ? [row] : this.selection.selected;
		if (this.popup.confirm('Delete Row?\nThis action will delete the selected row(s).\nDo you want to proceed?')) {
			this.dataSource.data = this.dataSource.data.filter(data => !items.find(row => Object.is(data, row)));
			this.originalData = [...this.dataSource.data];
			this.selection.deselect(...items);
		}
	}

	private areAllRowsSelected(): boolean {
		return this.selection.selected.length === this.dataSource.data.length;
	}

	private masterToggleState(): 'checked' | 'indeterminate' | undefined {
		if (this.selection.hasValue()) {
			return this.areAllRowsSelected() ? 'checked' : 'indeterminate';
		}
		return undefined;
	}

	private buildMasterToggleObservable(): Connectable<string> {
		return connectable<string>(this.selection.changed.pipe(map(() => this.masterToggleState())), {connector: () => new ReplaySubject()});
	}

	private buildMasterRemoveObservable(): Connectable<boolean> {
		return connectable<boolean>(
			this.selection.changed.pipe(
				map(() => !this.selection.hasValue()),
				startWith(true)
			),
			{connector: () => new ReplaySubject()}
		);
	}
}
