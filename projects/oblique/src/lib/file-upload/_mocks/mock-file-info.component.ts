import {SelectionModel} from '@angular/cdk/collections';
import {Component, Input, ViewChild, ViewEncapsulation, output} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ObIFileDescription, ObIUploadEvent} from '../file-upload.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-file-info',
	template: '',
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-file-info'},
	exportAs: 'obFileInfo',
})
export class ObMockFileInfoComponent {
	readonly uploadEvent = output<ObIUploadEvent>();
	@Input() allowTableInfo = true;
	@Input() getUploadedFilesUrl: string;
	@Input() deleteUrl: string;
	@ViewChild(MatSort, {static: true}) sort: MatSort;
	dataSource = new MatTableDataSource<ObIFileDescription, MatPaginator>([]);
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
