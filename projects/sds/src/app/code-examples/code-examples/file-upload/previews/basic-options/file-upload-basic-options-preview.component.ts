import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ObFileUploadModule} from '@oblique/oblique';

@Component({
	selector: 'app-file-upload-basic-options-preview',
	imports: [ObFileUploadModule],
	templateUrl: './file-upload-basic-options-preview.component.html',
	styleUrl: '../../../../code-example-flex-layout.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class FileUploadBasicOptionsPreviewComponent {}
