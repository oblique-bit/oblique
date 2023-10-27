import {Component} from '@angular/core';
import {ObFileUploadModule} from '@oblique/oblique';

@Component({
	selector: 'app-file-upload-example-first-preview',
	templateUrl: './file-upload-example-first-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [ObFileUploadModule]
})
export class FileUploadExampleFirstPreviewComponent {}
