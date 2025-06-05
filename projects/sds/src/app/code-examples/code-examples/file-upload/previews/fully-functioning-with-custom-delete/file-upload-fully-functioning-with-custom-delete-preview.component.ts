import {Component} from '@angular/core';
import {ObEUploadEventType, ObFileUploadModule, ObIFileDescription, ObIUploadEvent} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';
import {CommonModule} from '@angular/common';
import {uploadInterceptor} from '../../../../../../main';

@Component({
	selector: 'app-file-upload-fully-functioning-with-custom-delete-preview',
	templateUrl: './file-upload-fully-functioning-with-custom-delete-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	standalone: true,
	imports: [CommonModule, ObFileUploadModule]
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
