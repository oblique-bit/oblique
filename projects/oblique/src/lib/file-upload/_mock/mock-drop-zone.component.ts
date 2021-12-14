import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

@Component({
	selector: 'ob-drop-zone',
	exportAs: 'obDropZone',
	template: '',
	host: {class: 'ob-drop-zone'}
})
export class ObMockDropZoneComponent {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept = ['*'];
	@Input() maxFileSize = 5;
	@Input() multiple = true;

	addFiles(fileList: FileList): void {}
}
