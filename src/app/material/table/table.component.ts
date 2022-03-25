import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {Observable, Subject, combineLatest} from 'rxjs';
import {map, shareReplay, startWith, takeUntil, tap} from 'rxjs/operators';
import {ObIPeriodicElement} from './table.model';

@Component({
	selector: 'sc-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild(MatPaginator) paginator: MatPaginator;
	controls: FormGroup;
	obliqueStyles$: Observable<Record<string, boolean>>;
	isStructureDefault$: Observable<boolean>;
	hasCaption$: Observable<boolean>;
	isScrollable$: Observable<boolean>;
	isOptionDisabled = false;
	readonly displayedColumns = ['position', 'name', 'weight', 'symbol'];
	readonly columns = [
		{key: 'position', name: 'Position'},
		{key: 'name', name: 'Name'},
		{key: 'weight', name: 'Weight'},
		{key: 'symbol', name: 'Symbol'}
	];
	readonly dataSource: MatTableDataSource<ObIPeriodicElement>;
	readonly selection = new SelectionModel<ObIPeriodicElement>(true, []);
	readonly COLUMN_NAME_SELECT = 'select';

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

	constructor(private readonly formBuilder: FormBuilder) {
		this.dataSource = new MatTableDataSource<ObIPeriodicElement>(this.ELEMENT_DATA);
	}

	ngOnInit(): void {
		this.controls = TableComponent.buildControlsFormGroup(this.formBuilder);
		this.controlChange();
	}

	ngAfterViewInit(): void {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
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

	private static buildControlsFormGroup(formBuilder: FormBuilder): FormGroup {
		return formBuilder.group({
			filter: '',
			default: true,
			selection: true,
			caption: true,
			style: formBuilder.group({
				'ob-table': true,
				'ob-table-cicd': false,
				'ob-table-plain': false,
				'ob-table-hover': false,
				'ob-table-sm': false,
				'ob-table-lg': false
			}),
			collapsed: 'none'
		});
	}

	private controlChange(): void {
		this.valueChanges<string>('filter').subscribe(filter => this.filter(filter));
		this.valueChanges<boolean>('selection').subscribe(isEnabled => this.toggleSelectionVisibility(isEnabled));
		this.valueChanges<boolean>('style.ob-table').subscribe(isEnabled => this.handleDisableState(isEnabled));
		this.isStructureDefault$ = this.valueChanges<boolean>('default').pipe(tap(isDefault => this.structureChange(isDefault)));
		this.hasCaption$ = this.valueChanges<boolean>('caption');
		this.isScrollable$ = this.valueChanges<string>('collapsed').pipe(map(value => value === 'ob-table-scrollable'));
		this.obliqueStyles$ = this.getCollapsedStylesObservable();
	}

	private valueChanges<T>(field: string): Observable<T> {
		const control = this.controls.get(field);
		return control.valueChanges.pipe(startWith(control.value), shareReplay(1), takeUntil(this.unsubscribe));
	}

	private filter(filter: string): void {
		this.dataSource.data = this.ELEMENT_DATA;
		if (filter) {
			this.dataSource.data = this.ELEMENT_DATA.filter(row => row.name.toLowerCase().includes(filter.trim().toLowerCase()));
		}
	}

	private toggleSelectionVisibility(isEnabled: boolean): void {
		if (isEnabled) {
			this.displayedColumns.unshift(this.COLUMN_NAME_SELECT);
		} else {
			this.displayedColumns.shift();
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

	private getCollapsedStylesObservable(): Observable<Record<string, boolean>> {
		const collapse = ['ob-table-collapse', 'ob-table-collapse-sm', 'ob-table-collapse-md'];
		return combineLatest([
			this.valueChanges<Record<string, boolean>>('style'),
			this.valueChanges<string>('collapsed').pipe(
				map(value => collapse.reduce<Record<string, boolean>>((total, current) => ({...total, [current]: current === value}), {}))
			)
		]).pipe(map(classes => ({...classes[0], ...classes[1]})));
	}

	private handleDisableState(isEnabled: boolean): void {
		this.isOptionDisabled = !isEnabled;
		this.getStyleControls(this.controls).forEach(control => TableComponent.setDisabledState(control, isEnabled));
	}

	private getStyleControls(formGroup: FormGroup): AbstractControl[] {
		return Object.keys((formGroup.get('style') as FormGroup).controls)
			.filter(key => key !== 'ob-table')
			.map(key => formGroup.get(`style.${key}`));
	}
}
