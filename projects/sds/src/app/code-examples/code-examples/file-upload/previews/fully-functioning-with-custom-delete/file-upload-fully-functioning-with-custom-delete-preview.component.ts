import {Component} from '@angular/core';
import {ObFileUploadModule, type ObIFileDescription} from '@oblique/oblique';
import {mockCustomDeleteURL, mockGetUploadedFilesURL, mockUploadURL} from '../../file-upload-simulate-interceptor';

@Component({
	selector: 'app-file-upload-fully-functioning-with-custom-delete-preview',
	imports: [ObFileUploadModule],
	standalone: true,
	templateUrl: './file-upload-fully-functioning-with-custom-delete-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
})
export class FileUploadFullyFunctioningWithCustomDeletePreviewComponent {
	readonly uploadURL = `${mockUploadURL}/custom-delete`;
	readonly getUploadedFilesURL = `${mockGetUploadedFilesURL}/custom-delete`;
	readonly deleteURL = `${mockCustomDeleteURL}/custom-delete`;

	// the default map function is
	// files => btoa(JSON.stringify(files.map(file => file.name)));
	customMapForDelete = (files: ObIFileDescription[]): string => files.map(file => file.name).join(':');
}
