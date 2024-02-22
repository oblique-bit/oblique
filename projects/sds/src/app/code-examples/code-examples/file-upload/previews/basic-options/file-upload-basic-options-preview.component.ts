import {Component} from '@angular/core';
import {ObFileUploadModule} from '@oblique/oblique';

@Component({
	selector: 'app-file-upload-basic-options-preview',
	templateUrl: './file-upload-basic-options-preview.component.html',
	styleUrls: ['../../../../code-example-flex-layout.scss'],
	standalone: true,
	imports: [ObFileUploadModule]
})
export class FileUploadBasicOptionsPreviewComponent {}
