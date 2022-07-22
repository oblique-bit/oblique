import {SelectionModel} from '@angular/cdk/collections';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {map, takeUntil, tap} from 'rxjs/operators';
import {ObFileUploadService} from '../file-upload.service';
import {ObPopUpService} from '../../pop-up/pop-up.service';
import {ObEUploadEventType, ObIFileDescription, ObIUploadEvent} from '../file-upload.model';

@Component({
	selector: 'ob-file-info',
	exportAs: 'obFileInfo',
	templateUrl: './file-info.component.html',
	styleUrls: ['./file-info.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-file-info'}
})
export class ObFileInfoComponent implements OnInit, OnDestroy {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() deleteUrl: string;
	@Input() getUploadedFilesUrl: string;
	@ViewChild(MatSort) set sorting(sort: MatSort) {
		this.dataSource.sort = sort;
	}
	dataSource = new MatTableDataSource<ObIFileDescription>([]);
	displayedColumns: string[];
	fields = ['name'];
	readonly selection = new SelectionModel<ObIFileDescription>(true, []);
	readonly COLUMN_SELECT = 'select';
	readonly COLUMN_ACTION = 'action';
	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly fileUploadService: ObFileUploadService,
		private readonly popup: ObPopUpService,
		private readonly translate: TranslateService
	) {}

	@Input() mapFunction = (files: ObIFileDescription[]): ObIFileDescription[] => files;

	ngOnInit(): void {
		this.setTableHeaders(this.fields);
		this.loadData();
		this.fileUploadService.uploadComplete$.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.loadData());
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	areAllItemsSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	selectOrUnselectAllItems(): void {
		if (this.areAllItemsSelected()) {
			this.selection.clear();
		} else {
			this.dataSource.data.forEach(row => this.selection.select(row));
		}
		this.uploadEvent.emit({type: ObEUploadEventType.SELECTED, files: this.selection.selected.map(file => file.name)});
	}

	toggle(row: ObIFileDescription): void {
		this.selection.toggle(row);
		this.uploadEvent.emit({type: ObEUploadEventType.SELECTED, files: this.selection.selected.map(file => file.name)});
	}

	delete(files: ObIFileDescription[]): void {
		const fileNames = files.map(file => file.name);
		if (this.deleteUrl && this.popup.confirm(this.translate.instant('i18n.oblique.file-upload.selected.remove'))) {
			this.fileUploadService
				.delete(this.deleteUrl, fileNames)
				.pipe(
					tap(() => (this.dataSource.data = this.dataSource.data.filter(file => !fileNames.includes(file.name)))),
					tap(() => files.forEach(file => this.selection.deselect(file)))
				)
				.subscribe({
					next: () => this.uploadEvent.emit({type: ObEUploadEventType.DELETED, files: fileNames}),
					error: error => this.uploadEvent.emit({type: ObEUploadEventType.ERRORED, files: fileNames, error})
				});
		}
	}

	private loadData(): void {
		if (this.getUploadedFilesUrl) {
			this.fileUploadService
				.getUploadedFiles(this.getUploadedFilesUrl)
				.pipe(
					map(this.mapFunction),
					tap(files => (this.dataSource.data = files))
				)
				.subscribe({
					next: files => this.setTableHeaders(files.length ? Object.keys(files[0]) : this.fields),
					error: error => this.uploadEvent.emit({type: ObEUploadEventType.ERRORED, files: [], error})
				});
		}
	}

	private setTableHeaders(headers: string[]): void {
		this.fields = headers;
		this.displayedColumns = this.deleteUrl
			? [this.COLUMN_SELECT, ...this.fields, this.COLUMN_ACTION]
			: [this.COLUMN_SELECT, ...this.fields];
	}
}
