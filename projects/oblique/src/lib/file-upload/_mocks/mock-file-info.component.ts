import {SelectionModel} from '@angular/cdk/collections';
import {Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ObIFileDescription, ObIUploadEvent} from '../file-upload.model';

@Component({
	selector: 'ob-file-info',
	exportAs: 'obFileInfo',
	template: '',
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-file-info'}
})
export class ObMockFileInfoComponent {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() allowTableInfo = true;
	@Input() getUploadedFilesUrl: string;
	@Input() deleteUrl: string;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	dataSource = new MatTableDataSource<ObIFileDescription>([]);
	displayedColumns: string[];
	fields: string[];
	readonly selection = new SelectionModel<ObIFileDescription>(true, []);
	readonly COLUMN_SELECT = 'select';
	readonly COLUMN_ACTION = 'action';

	@Input() mapFunction = (files: ObIFileDescription[]): ObIFileDescription[] => files;

	isAllSelected(): boolean {
		return true;
	}

	selectOrUnselectAllItems(): void {}

	toggle(row: ObIFileDescription): void {}

	delete(files: ObIFileDescription[]): void {}
}
