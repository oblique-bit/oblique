import {Component} from '@angular/core';
import {ObAlertComponent, ObFileUploadModule} from '@oblique/oblique';
import {mockUrls} from '../../file-upload-simulate-interceptor';
import {CommonModule} from '@angular/common';

@Component({
	selector: 'app-file-upload-cancel-upload-preview',
	templateUrl: './file-upload-cancel-upload-preview.component.html',
	styleUrls: ['./file-upload-cancel-upload-preview.component.scss'],
	standalone: true,
	imports: [CommonModule, ObFileUploadModule, ObAlertComponent, ObAlertComponent]
})
export class FileUploadCancelUploadPreviewComponent {
	mockUrls = mockUrls;
}
