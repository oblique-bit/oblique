import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {ObEUploadEventType, ObIUploadEvent} from './file-upload.model';
import {ObProgressComponent} from './progress/progress.component';
import {ObDropZoneComponent} from './drop-zone/ob-drop-zone.component';

@Component({
	selector: 'ob-file-upload',
	imports: [ObDropZoneComponent, ObProgressComponent],
	templateUrl: './file-upload.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {class: 'ob-file-upload'},
	exportAs: 'obFileUpload',
})
export class ObFileUploadComponent {
	readonly uploadEvent = output<ObIUploadEvent>();
	readonly accept = input(['*']);
	readonly singleRequest = input(true);
	readonly maxFileSize = input(5);
	readonly maxFileAmount = input(0);
	readonly multiple = input(true);
	readonly uploadUrl = input<string>(undefined);
	readonly cancelConfirmation = input(true);
	showLoadingBox = false;
	files: File[];

	processEvent(event: ObIUploadEvent): void {
		this.uploadEvent.emit(event);
		if (event.type === ObEUploadEventType.UPLOADED || event.type === ObEUploadEventType.CANCELED) {
			this.showLoadingBox = false;
			this.files = undefined;
		} else if (event.type === ObEUploadEventType.CHOSEN && this.uploadUrl()) {
			this.showLoadingBox = true;
			this.files = event.files as File[];
		}
	}
}
