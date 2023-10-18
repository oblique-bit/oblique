import {Component} from '@angular/core';
import {ObFileUploadModule, ObIFileDescription} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';

@Component({
	selector: 'app-file-upload-map-function-and-ob-file-info-preview',
	templateUrl: './file-upload-map-function-and-ob-file-info-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [ObFileUploadModule]
})
export class FileUploadMapFunctionAndObFileInfoPreviewComponent {
	mockUrls = mockUrls;

	mapData(files: ObIFileDescription[]): ObIFileDescription[] {
		return files.map((file, idx) => ({...file, number: idx + 1}));
	}
}
