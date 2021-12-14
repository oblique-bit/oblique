import {SelectionModel} from '@angular/cdk/collections';
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
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
	private subscription: Subscription;

	constructor(
		private readonly fileUploadService: ObFileUploadService,
		private readonly popup: ObPopUpService,
		private readonly translate: TranslateService
	) {}

	@Input() mapFunction = (files: ObIFileDescription[]): ObIFileDescription[] => files;

	ngOnInit(): void {
		this.setTableHeaders(this.fields);
		this.loadData();
		this.subscription = this.fileUploadService.uploadComplete$.subscribe(() => this.loadData());
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	areAllItemsSelected(): boolean {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	selectOrUnselectAllItems(): void {
		// eslint-disable-next-line no-unused-expressions
		this.areAllItemsSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
		this.uploadEvent.emit({type: ObEUploadEventType.SELECTED, files: this.selection.selected.map(file => file.name)});
	}

	toggle(row: ObIFileDescription): void {
		this.selection.toggle(row);
		this.uploadEvent.emit({type: ObEUploadEventType.SELECTED, files: this.selection.selected.map(file => file.name)});
	}

	delete(files: ObIFileDescription[]): void {
		const fileNames = files.map(file => file.name);
		if (this.deleteUrl && this.popup.confirm(this.translate.instant('i18n.oblique.file-upload.selected.remove'))) {
			this.fileUploadService.delete(this.deleteUrl, fileNames).subscribe(
				() => {
					this.dataSource.data = this.dataSource.data.filter(file => !fileNames.includes(file.name));
					files.forEach(file => this.selection.deselect(file));
					this.uploadEvent.emit({type: ObEUploadEventType.DELETED, files: fileNames});
				},
				error => {
					this.uploadEvent.emit({type: ObEUploadEventType.ERRORED, files: fileNames, error});
				}
			);
		}
	}

	private loadData(): void {
		this.fileUploadService
			.getUploadedFiles(this.getUploadedFilesUrl)
			.pipe(map(this.mapFunction))
			.subscribe(
				files => {
					this.dataSource.data = files;
					this.setTableHeaders(files.length ? Object.keys(files[0]) : this.fields);
				},
				error => {
					this.uploadEvent.emit({type: ObEUploadEventType.ERRORED, files: [], error});
				}
			);
	}

	private setTableHeaders(headers: string[]) {
		this.fields = headers;
		this.displayedColumns = this.deleteUrl ? [this.COLUMN_SELECT, ...this.fields, this.COLUMN_ACTION] : [this.COLUMN_SELECT, ...this.fields];
	}
}
