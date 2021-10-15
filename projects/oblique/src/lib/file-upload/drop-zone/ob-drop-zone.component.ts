import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {ObValidationService} from './validation.service';
import {ObEUploadEventType, ObIUploadEvent} from '../file-upload.model';

@Component({
	selector: 'ob-drop-zone',
	exportAs: 'obDropZone',
	templateUrl: './ob-drop-zone.component.html',
	styleUrls: ['./ob-drop-zone.component.scss'],
	providers: [ObValidationService],
	encapsulation: ViewEncapsulation.None,
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-drop-zone'}
})
export class ObDropZoneComponent {
	@Output() uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept = ['*'];
	@Input() maxFileSize: number = 5;
	@Input() multiple = true;

	constructor(private readonly validationService: ObValidationService) {}

	addFiles(fileList: FileList): void {
		const fileArray = Array.from(fileList);
		const files: File[] = this.validationService.filterInvalidFiles(fileArray, this.accept, this.maxFileSize, this.multiple);
		if (files.length) {
			this.uploadEvent.emit({type: ObEUploadEventType.CHOSEN, files});
		}
		if (files.length !== fileArray.length) {
			this.uploadEvent.emit({type: ObEUploadEventType.ERRORED, files: fileArray.filter(file => !files.includes(file))});
		}
	}
}
