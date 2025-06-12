import {Component} from '@angular/core';
import {ObAlertComponent, ObFileUploadModule} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';

@Component({
	selector: 'app-file-upload-cancel-upload-preview',
	templateUrl: './file-upload-cancel-upload-preview.component.html',
	styleUrl: './file-upload-cancel-upload-preview.component.scss',
	imports: [ObFileUploadModule, ObAlertComponent]
})
export class FileUploadCancelUploadPreviewComponent {
	mockUrls = mockUrls;
}
