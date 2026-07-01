import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-file-upload',
	template: '',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {class: 'ob-file-upload'},
	exportAs: 'obFileUpload',
})
export class ObMockFileUploadComponent {
	readonly uploadEvent = output<ObIUploadEvent>();
	readonly accept = input<string[]>(undefined);
	readonly multiple = input(true);
	readonly singleRequest = input(true);
	readonly uploadUrl = input<string>(undefined);
	readonly maxFileSize = input(5);
	showLoadingBox = false;
	files: File[];

	addFiles(event: ObIUploadEvent): void {}

	uploadComplete(): void {}
}
