import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
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
