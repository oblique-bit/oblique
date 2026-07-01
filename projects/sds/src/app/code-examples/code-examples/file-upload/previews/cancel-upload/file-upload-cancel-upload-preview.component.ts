import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObAlertComponent, ObFileUploadModule} from '@oblique/oblique';
import {mockUploadURL} from '../../file-upload-simulate-interceptor';

@Component({
	selector: 'app-file-upload-cancel-upload-preview',
	imports: [ObFileUploadModule, ObAlertComponent],
	templateUrl: './file-upload-cancel-upload-preview.component.html',
	styleUrl: './file-upload-cancel-upload-preview.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class FileUploadCancelUploadPreviewComponent {
	readonly uploadURL = `${mockUploadURL}/cancel-upload`;
}
