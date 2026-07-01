import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, input} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-drop-zone',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {class: 'ob-drop-zone'},
	exportAs: 'obDropZone',
})
export class ObMockDropZoneComponent {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept = ['*'];
	readonly maxFileSize = input(5);
	readonly maxFileAmount = input(0);
	readonly multiple = input(true);

	addFiles(fileList: FileList): void {}
}
