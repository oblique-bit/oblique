import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ObEUploadEventType, ObIUploadEvent} from './file-upload.model';
import {ObProgressComponent} from './progress/progress.component';
import {ObDropZoneComponent} from './drop-zone/ob-drop-zone.component';
import {NgIf} from '@angular/common';

@Component({
	selector: 'ob-file-upload',
	exportAs: 'obFileUpload',
	templateUrl: './file-upload.component.html',
	host: {class: 'ob-file-upload'},
	standalone: true,
	imports: [NgIf, ObDropZoneComponent, ObProgressComponent]
})
export class ObFileUploadComponent {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept = ['*'];
	@Input() singleRequest = true;
	@Input() maxFileSize = 5;
	@Input() maxFileAmount = 0;
	@Input() multiple = true;
	@Input() uploadUrl: string;
	@Input() cancelConfirmation = true;
	showLoadingBox = false;
	files: File[];

	processEvent(event: ObIUploadEvent): void {
		this.uploadEvent.emit(event);
		if (event.type === ObEUploadEventType.UPLOADED || event.type === ObEUploadEventType.CANCELED) {
			this.showLoadingBox = false;
			this.files = undefined;
		} else if (event.type === ObEUploadEventType.CHOSEN && this.uploadUrl) {
			this.showLoadingBox = true;
			this.files = event.files as File[];
		}
	}
}
