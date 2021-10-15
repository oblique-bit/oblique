import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

@Component({
	selector: 'ob-file-upload',
	exportAs: 'obFileUpload',
	template: '',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-file-upload'}
})
export class ObMockFileUploadComponent {
	@Output() uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept: string[];
	@Input() multiple = true;
	@Input() singleRequest = true;
	@Input() uploadUrl: string;
	@Input() maxFileSize = 5;
	showLoadingBox = false;
	files: File[];

	addFiles(event: ObIUploadEvent): void {}

	uploadComplete(): void {}
}
