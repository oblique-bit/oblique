import {inject} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {WINDOW} from '@oblique/oblique';
import {type Connectable, ReplaySubject, connectable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Data {
	isSelected?: boolean;
}

export class TableManager<T> {
	readonly dataSource = new MatTableDataSource<T & Data>();
	readonly isMasterRemoveDisabled$: Connectable<boolean>;
	readonly masterToggleState$: Connectable<string>;
	private readonly selection = new SelectionModel<T & Data>(true, []);
	private originalData: (T & Data)[];
	private readonly window = inject(WINDOW);

	constructor(data: (T & Data)[]) {
		this.originalData = data.map(item => ({...item, isSelected: false}));
		this.dataSource.data = [...this.originalData];
		this.isMasterRemoveDisabled$ = this.buildMasterRemoveObservable();
		this.isMasterRemoveDisabled$.connect();
		this.masterToggleState$ = this.buildMasterToggleObservable();
		this.masterToggleState$.connect();
	}

	toggleRow(row: T & Data): void {
		row.isSelected = !row.isSelected;
		this.selection.toggle(row);
	}

	addRow(value: T): void {
		this.dataSource.data = [{...value, isSelected: false}, ...this.dataSource.data];
	}

	removeRows(row?: T & Data): void {
		const items = row ? [row] : this.selection.selected;
		if (this.window.confirm('Delete Row?\nThis action will delete the selected row(s).\nDo you want to proceed?')) {
			this.dataSource.data = this.dataSource.data.filter(data => !items.find(item => Object.is(data, item)));
			this.originalData = [...this.dataSource.data];
			this.selection.deselect(...items);
		}
	}

	masterToggle(): void {
		if (this.areAllRowsSelected()) {
			this.selection.clear();
		} else {
			this.dataSource.data.forEach(row => this.selection.select(row));
		}
		this.dataSource.data.forEach(row => (row.isSelected = this.selection.isSelected(row)));
	}

	private buildMasterToggleObservable(): Connectable<string> {
		return connectable<string>(this.selection.changed.pipe(map(() => this.masterToggleState())), {connector: () => new ReplaySubject()});
	}

	private masterToggleState(): 'checked' | 'indeterminate' | undefined {
		if (this.selection.hasValue()) {
			return this.areAllRowsSelected() ? 'checked' : 'indeterminate';
		}
		return undefined;
	}

	private areAllRowsSelected(): boolean {
		return this.selection.selected.length === this.dataSource.data.length;
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
