import {Component} from '@angular/core';
import {PreviewComponent} from '../../../../code-examples.model';
import {ObFileUploadModule, ObIFileDescription} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';

@Component({
	selector: 'app-file-upload-example-third-preview',
	templateUrl: './file-upload-example-third-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [ObFileUploadModule]
})
export class FileUploadExampleThirdPreviewComponent implements PreviewComponent {
	mockUrls = mockUrls;

	mapData(files: ObIFileDescription[]): ObIFileDescription[] {
		return files.map((file, idx) => ({...file, number: idx + 1}));
	}
}
