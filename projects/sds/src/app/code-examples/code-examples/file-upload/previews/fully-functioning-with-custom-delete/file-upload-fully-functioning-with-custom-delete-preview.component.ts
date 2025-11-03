import {Component} from '@angular/core';
import {ObEUploadEventType, ObFileUploadModule, type ObIFileDescription, type ObIUploadEvent} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';
import {uploadInterceptor} from '../../../../../../main';

@Component({
	selector: 'app-file-upload-fully-functioning-with-custom-delete-preview',
	imports: [ObFileUploadModule],
	standalone: true,
	templateUrl: './file-upload-fully-functioning-with-custom-delete-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss'
})
export class FileUploadFullyFunctioningWithCustomDeletePreviewComponent {
	mockUrls = mockUrls;

	checkForCanceledUploads(event: ObIUploadEvent): void {
		if (event.type === ObEUploadEventType.CANCELED) {
			uploadInterceptor.mockCancel(event.files as File[], 0);
		}
	}

	// the default map function is
	// files => btoa(JSON.stringify(files.map(file => file.name)));
	customMapForDelete = (files: ObIFileDescription[]): string => files.map(file => file.name).join(':');
}
