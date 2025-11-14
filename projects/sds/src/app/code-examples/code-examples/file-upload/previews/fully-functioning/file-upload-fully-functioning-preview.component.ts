import {Component} from '@angular/core';
import {ObFileUploadModule} from '@oblique/oblique';
import {mockDeleteURL, mockGetUploadedFilesURL, mockUploadURL} from '../../file-upload-simulate-interceptor';

@Component({
	selector: 'app-file-upload-fully-functioning-preview',
	imports: [ObFileUploadModule],
	templateUrl: './file-upload-fully-functioning-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
})
export class FileUploadFullyFunctioningPreviewComponent {
	readonly uploadURL = `${mockUploadURL}/fully-functioning`;
	readonly getUploadedFilesURL = `${mockGetUploadedFilesURL}/fully-functioning`;
	readonly deleteURL = `${mockDeleteURL}/fully-functioning`;
}
