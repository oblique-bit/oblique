import {Component} from '@angular/core';
import {ObEUploadEventType, ObFileUploadModule, type ObIUploadEvent} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';
import {uploadInterceptor} from '../../../../../../main';

@Component({
	selector: 'app-file-upload-fully-functioning-preview',
	imports: [ObFileUploadModule],
	templateUrl: './file-upload-fully-functioning-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss'
})
export class FileUploadFullyFunctioningPreviewComponent {
	mockUrls = mockUrls;

	checkForCanceledUploads(event: ObIUploadEvent): void {
		if (event.type === ObEUploadEventType.CANCELED) {
			uploadInterceptor.mockCancel(event.files as File[], 0);
		}
	}
}
