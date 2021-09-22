import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

@Component({
	selector: 'ob-drop-zone',
	exportAs: 'obDropZone',
	template: '',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-drop-zone'}
})
export class ObMockDropZoneComponent {
	@Output() uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept = ['*'];
	@Input() maxFileSize: number = 5;
	@Input() multiple = true;

	addFiles(fileList: FileList): void {}
}
