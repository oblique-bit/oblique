import {Component} from '@angular/core';
import {NgFor} from '@angular/common';
import {PreviewComponent} from '../../../../code-examples.model';
import {ObEUploadEventType, ObFileUploadModule, ObIUploadEvent} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';

@Component({
	selector: 'app-file-upload-example-second-preview',
	templateUrl: './file-upload-example-second-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [ObFileUploadModule, NgFor]
})
export class FileUploadExampleSecondPreviewComponent implements PreviewComponent {
	readonly mockUrls = mockUrls;

	last5UploadEvents: UploadEventLog[] = [];

	uploadEvent(event: ObIUploadEvent): void {
		this.last5UploadEvents.unshift({
			eventType: event.type,
			fileNames: event.files.map((file: File | string) => (file instanceof File ? file.name : file)).join(', ')
		});

		this.last5UploadEvents.length = this.last5UploadEvents.length > 5 ? 5 : this.last5UploadEvents.length;
	}
}

interface UploadEventLog {
	eventType: ObEUploadEventType;
	fileNames: string;
}