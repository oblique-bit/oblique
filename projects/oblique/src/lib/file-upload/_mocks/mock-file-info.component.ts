import {SelectionModel} from '@angular/cdk/collections';
import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation, input, output, viewChild} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {ObIFileDescription, ObIUploadEvent, ObTSelectionStatus} from '../file-upload.model';

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
	readonly deleteUrl = input<string>();
	readonly getUploadedFilesUrl = input<string>();
	readonly sort = viewChild(MatSort);

	dataSource = new MatTableDataSource<ObIFileDescription, MatPaginator>([]);
	displayedColumns: string[];
	fields: string[];
	selectionStatus: ObTSelectionStatus = 'none';
	readonly selection = new SelectionModel<ObIFileDescription>(true, []);
	readonly COLUMN_SELECT = 'select';
	readonly COLUMN_ACTION = 'action';

	readonly mapFunction = input((files: ObIFileDescription[]): ObIFileDescription[] => files);
	@Input() mapFilesToDeleteUrlFunction: (files: ObIFileDescription[]) => string = files =>
		btoa(JSON.stringify(files.map(file => file.name)));

	selectOrUnselectAllItems(): void {}

	toggle(row: ObIFileDescription): void {}

	delete(files: ObIFileDescription[]): void {}
}
