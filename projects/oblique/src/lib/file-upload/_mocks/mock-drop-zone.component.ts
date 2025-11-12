import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Component({
	selector: 'ob-drop-zone',
	standalone: true,
	template: '',
	host: {class: 'ob-drop-zone'},
	exportAs: 'obDropZone',
})
export class ObMockDropZoneComponent {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept = ['*'];
	@Input() maxFileSize = 5;
	@Input() multiple = true;

	addFiles(fileList: FileList): void {}
}
