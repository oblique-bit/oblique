import {NgFor, NgIf} from '@angular/common';
import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {ObEUploadEventType, ObIUploadEvent} from '../file-upload.model';
import {ObAcceptAllPipe} from './accept-all.pipe';
import {ObDragDropDirective} from './drag-and-drop.directive';
import {ObValidationService} from './validation.service';

@Component({
	selector: 'ob-drop-zone',
	exportAs: 'obDropZone',
	templateUrl: './ob-drop-zone.component.html',
	styleUrls: ['./ob-drop-zone.component.scss'],
	providers: [ObValidationService],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-drop-zone'},
	standalone: true,
	imports: [ObDragDropDirective, MatIconModule, NgIf, NgFor, TranslateModule, ObAcceptAllPipe]
})
export class ObDropZoneComponent {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept = ['*'];
	@Input() maxFileSize = 5;
	@Input() multiple = true;
	@ViewChild('fileInput') private readonly fileInput: ElementRef<HTMLInputElement>;

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
		this.fileInput.nativeElement.value = null;
	}
}
