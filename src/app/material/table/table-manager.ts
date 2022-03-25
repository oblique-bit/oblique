import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {SelectionModel} from '@angular/cdk/collections';
import {ObPopUpService} from '@oblique/oblique';
import {Connectable, ReplaySubject, connectable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

interface Data {
	isSelected?: boolean;
	editMode?: EditMode;
}

export enum EditMode {
	NONE,
	EDIT,
	ADD
}

export class TableManager<T> {
	readonly masterToggleState$: Connectable<string>;
	readonly isMasterRemoveDisabled$: Connectable<boolean>;
	isEditMode$: Connectable<boolean>;
	readonly dataSource = new MatTableDataSource<T & Data>();
	editForm: FormGroup;
	private readonly selection = new SelectionModel<T & Data>(true, []);
	private originalData: (T & Data)[];
	private readonly EDIT_MODE_NAME = 'editMode';

	constructor(data: (T & Data)[], private readonly popup: ObPopUpService) {
		this.originalData = data.map(data => ({...data, isSelected: false, editMode: EditMode.NONE}));
		this.dataSource.data = [...this.originalData];

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

	setForm(formGroup: FormGroup): void {
		this.editForm = formGroup;
		this.editForm.addControl(this.EDIT_MODE_NAME, new FormControl(EditMode.NONE));
		this.isEditMode$ = this.buildEditModeObservable();
		this.isEditMode$.connect();
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

	editRow(row: T & Data): void {
		row.editMode = EditMode.EDIT;
		this.editForm.patchValue(row);
	}

	addRow(): void {
		this.dataSource.data.unshift({editMode: EditMode.ADD} as T & Data);
		this.dataSource.data = [...this.dataSource.data];
		this.editForm.patchValue({editMode: EditMode.ADD});
	}

	saveRow(row: T & Data): void {
		if (this.editForm.valid) {
			const value = {...this.editForm.value, editMode: EditMode.NONE};
			this.dataSource.data = this.dataSource.data.map(item => (Object.is(item, row) ? value : item));
			this.cancel(row);
		}
	}

	cancel(row: T & Data): void {
		this.dataSource.data = this.dataSource.data.filter(item => item.editMode !== EditMode.ADD);
		row.editMode = EditMode.NONE;
		this.editForm.reset({editMode: EditMode.NONE});
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

	private buildEditModeObservable(): Connectable<boolean> {
		return connectable<boolean>(
			this.editForm.get(this.EDIT_MODE_NAME).valueChanges.pipe(
				map(mode => mode !== EditMode.NONE),
				startWith(false)
			),
			{connector: () => new ReplaySubject()}
		);
	}
}
