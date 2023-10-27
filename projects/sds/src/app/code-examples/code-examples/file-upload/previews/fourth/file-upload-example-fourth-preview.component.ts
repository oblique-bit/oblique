import {Component} from '@angular/core';
import {ObEUploadEventType, ObFileUploadModule, ObIUploadEvent} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';
import {CommonModule} from '@angular/common';
import {uploadInterceptor} from '../../../../../../main';

@Component({
	selector: 'app-file-upload-example-fourth-preview',
	templateUrl: './file-upload-example-fourth-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [CommonModule, ObFileUploadModule]
})
export class FileUploadExampleFourthPreviewComponent {
	mockUrls = mockUrls;

	checkForCanceledUploads(event: ObIUploadEvent): void {
		if (event.type === ObEUploadEventType.CANCELED) {
			uploadInterceptor.mockCancel(event.files as File[], 0);
		}
	}
}
