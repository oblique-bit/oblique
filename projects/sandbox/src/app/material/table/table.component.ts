import {type AfterViewInit, Component, type OnDestroy, type OnInit, inject, viewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {type AbstractControl, UntypedFormBuilder, type UntypedFormGroup, Validators} from '@angular/forms';
import {MatInput} from '@angular/material/input';
import {type Observable, ReplaySubject, Subject, combineLatest, share} from 'rxjs';
import {delay, filter, map, startWith, takeUntil, tap} from 'rxjs/operators';
import type {ObIPeriodicElement} from './table.model';
import {EditMode, Mode, TableManager} from './table-manager';

@Component({
	selector: 'sb-table',
	templateUrl: './table.component.html',
	styleUrl: './table.component.scss',
	standalone: false
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
	readonly sort = viewChild(MatSort);
	readonly paginator = viewChild(MatPaginator);
	readonly firstInput = viewChild(MatInput);
	controls: UntypedFormGroup;
	tableStyles$: Observable<Record<string, boolean>>;
	collapsedStyles$: Observable<Record<string, boolean>>;
	isStructureDefault$: Observable<boolean>;
	hasCaption$: Observable<boolean>;
	isScrollable$: Observable<boolean>;
	isOptionDisabled = false;
	editMode = EditMode;
	mode = Mode;
	readonly displayedColumns = ['position', 'name', 'weight', 'symbol'];
	readonly columns = [
		{key: 'position', name: 'Position', type: 'number'},
		{key: 'name', name: 'Name', type: 'text'},
		{key: 'weight', name: 'Weight', type: 'number'},
		{key: 'symbol', name: 'Symbol', type: 'text'}
	];
	readonly tableManager: TableManager<ObIPeriodicElement>;
	readonly COLUMN_NAME_SELECT = 'select';
	readonly COLUMN_NAME_ACTIONS = 'actions';

	private readonly unsubscribe = new Subject<void>();
	private readonly ELEMENT_DATA: ObIPeriodicElement[] = [
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
	private readonly formBuilder = inject(UntypedFormBuilder);

	constructor() {
		this.tableManager = new TableManager<ObIPeriodicElement>(this.ELEMENT_DATA);
	}

	ngOnInit(): void {
		this.controls = TableComponent.buildControlsFormGroup(this.formBuilder);
		this.controlChange();
		this.tableManager.setForm(TableComponent.buildEditFormGroup(this.formBuilder));
	}

	ngAfterViewInit(): void {
		this.tableManager.setExtras({sort: this.sort(), paginator: this.paginator()});
		this.tableManager.isEditMode$
			.pipe(
				filter(isEditMode => isEditMode),
				delay(0), // wait for Angular to render the inputs
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => {
				this.firstInput().focus();
			});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private static buildEditFormGroup(formBuilder: UntypedFormBuilder): UntypedFormGroup {
		return formBuilder.group({
			position: [null, Validators.required],
			name: [null, Validators.required],
			weight: [null, Validators.required],
			symbol: [null, Validators.required]
		});
	}

	private static buildControlsFormGroup(formBuilder: UntypedFormBuilder): UntypedFormGroup {
		return formBuilder.group({
			filter: '',
			default: true,
			selection: true,
			actions: true,
			caption: true,
			mode: Mode.DIALOG,
			style: formBuilder.group({
				'ob-table': true,
				'ob-table-plain': false,
				'ob-table-disable-hover-style': false,
				'ob-table-disable-checked-style': false,
				'ob-table-sm': false,
				'ob-table-lg': false
			}),
			collapsed: 'none'
		});
	}

	private controlChange(): void {
		this.valueChanges<string>('filter').subscribe(filterText => this.filter(filterText));
		this.valueChanges<boolean>('selection').subscribe(isEnabled => this.toggleSelectionVisibility(isEnabled));
		this.valueChanges<boolean>('actions').subscribe(isEnabled => this.toggleActionsVisibility(isEnabled));
		this.valueChanges<boolean>('style.ob-table').subscribe(isEnabled => this.handleDisableState(isEnabled));
		this.valueChanges<Mode>('mode').subscribe(mode => this.tableManager.setMode(mode));
		this.isStructureDefault$ = this.valueChanges<boolean>('default').pipe(tap(isDefault => this.structureChange(isDefault)));
		this.hasCaption$ = this.valueChanges<boolean>('caption');
		this.isScrollable$ = this.valueChanges<string>('collapsed').pipe(map(value => value === 'ob-table-scrollable'));
		this.tableStyles$ = this.getTableStylesObservable();
		this.collapsedStyles$ = this.getCollapsedStylesObservable();
	}

	private valueChanges<T>(field: string): Observable<T> {
		const control = this.controls.get(field);
		return control.valueChanges.pipe(startWith(control.value), share({connector: () => new ReplaySubject(1)}), takeUntil(this.unsubscribe));
	}

	private filter(filterText: string): void {
		this.tableManager.filter(row => row.name.toLowerCase().includes(filterText.trim().toLowerCase()));
	}

	private toggleSelectionVisibility(isEnabled: boolean): void {
		if (isEnabled) {
			this.displayedColumns.unshift(this.COLUMN_NAME_SELECT);
		} else {
			this.displayedColumns.shift();
		}
	}

	private toggleActionsVisibility(isEnabled: boolean): void {
		if (isEnabled) {
			this.displayedColumns.push(this.COLUMN_NAME_ACTIONS);
		} else {
			this.displayedColumns.pop();
		}
	}

	private structureChange(isDefault: boolean): void {
		['caption', 'collapsed'].map(key => this.controls.get(key)).forEach(control => TableComponent.setDisabledState(control, isDefault));
	}

	private static setDisabledState(control: AbstractControl, isEnabled: boolean): void {
		if (isEnabled) {
			control.enable();
		} else {
			control.disable();
		}
	}

	private getTableStylesObservable(): Observable<Record<string, boolean>> {
		return combineLatest([this.valueChanges<Record<string, boolean>>('style'), this.getCollapsedStylesObservable()]).pipe(
			map(classes => ({...classes[0], ...classes[1]}))
		);
	}

	private getCollapsedStylesObservable(): Observable<Record<string, boolean>> {
		const collapse = ['ob-table-collapse', 'ob-table-collapse-sm', 'ob-table-collapse-md'];
		return this.valueChanges<string>('collapsed').pipe(
			map(value => collapse.reduce<Record<string, boolean>>((total, current) => ({...total, [current]: current === value}), {}))
		);
	}

	private handleDisableState(isEnabled: boolean): void {
		this.isOptionDisabled = !isEnabled;
		this.getStyleControls(this.controls).forEach(control => TableComponent.setDisabledState(control, isEnabled));
	}

	private getStyleControls(formGroup: UntypedFormGroup): AbstractControl[] {
		return Object.keys((formGroup.get('style') as UntypedFormGroup).controls)
			.filter(key => key !== 'ob-table')
			.map(key => formGroup.get(`style.${key}`));
	}
}
