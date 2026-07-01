import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	ViewEncapsulation,
	inject,
	input,
	viewChild,
} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';
import {ObEUploadEventType, ObIUploadEvent} from '../file-upload.model';
import {ObAcceptAllPipe} from './accept-all.pipe';
import {ObDragDropDirective} from './drag-and-drop.directive';
import {ObValidationService} from './validation.service';

@Component({
	selector: 'ob-drop-zone',
	imports: [ObDragDropDirective, MatIconModule, TranslateModule, ObAcceptAllPipe],
	templateUrl: './ob-drop-zone.component.html',
	styleUrls: ['./ob-drop-zone.component.scss'],
	providers: [ObValidationService],
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-drop-zone'},
	exportAs: 'obDropZone',
})
export class ObDropZoneComponent {
	@Output() readonly uploadEvent = new EventEmitter<ObIUploadEvent>();
	@Input() accept = ['*'];
	readonly maxFileSize = input(5);
	readonly maxFileAmount = input(0);
	readonly multiple = input(true);
	private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

	private readonly validationService = inject(ObValidationService);

	addFiles(fileList: FileList): void {
		const fileArray = Array.from(fileList);
		const files: File[] = this.validationService.filterInvalidFiles({
			files: fileArray,
			accept: this.accept,
			maxSize: this.maxFileSize(),
			maxAmount: this.maxFileAmount(),
			multiple: this.multiple(),
		});
		if (files.length) {
			this.uploadEvent.emit({type: ObEUploadEventType.CHOSEN, files});
		}
		if (files.length !== fileArray.length) {
			this.uploadEvent.emit({type: ObEUploadEventType.ERRORED, files: fileArray.filter(file => !files.includes(file))});
		}
		this.fileInput().nativeElement.value = null;
	}
}
