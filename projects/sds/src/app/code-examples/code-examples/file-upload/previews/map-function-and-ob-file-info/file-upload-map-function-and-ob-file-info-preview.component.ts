import {Component} from '@angular/core';
import {ObFileUploadModule, type ObIFileDescription} from '@oblique/oblique';
import {mockCustomDeleteURL, mockGetUploadedFilesURL, mockUploadURL} from '../../file-upload-simulate-interceptor';

@Component({
	selector: 'app-file-upload-map-function-and-ob-file-info-preview',
	imports: [ObFileUploadModule],
	templateUrl: './file-upload-map-function-and-ob-file-info-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
})
export class FileUploadMapFunctionAndObFileInfoPreviewComponent {
	readonly uploadURL = `${mockUploadURL}/map`;
	readonly getUploadedFilesURL = `${mockGetUploadedFilesURL}/map`;
	readonly deleteURL = `${mockCustomDeleteURL}/map`;

	mapData(files: ObIFileDescription[]): ObIFileDescription[] {
		return files.map((file, idx) => ({...file, number: idx + 1}));
	}
}
