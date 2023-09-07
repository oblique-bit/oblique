import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

@Component({
	selector: 'ob-file-upload',
	exportAs: 'obFileUpload',
	template: '',
	host: {class: 'ob-file-upload'},
	standalone: true
})
export class ObMockFileUploadComponent {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
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
