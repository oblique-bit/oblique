import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-file-upload',
	template: '',
	host: {class: 'ob-file-upload'},
	exportAs: 'obFileUpload',
})
export class ObMockFileUploadComponent {
	readonly uploadEvent = output<ObIUploadEvent>();
	readonly accept = input(['*']);
	readonly singleRequest = input(true);
	readonly maxFileSize = input(5);
	readonly maxFileAmount = input(0);
	readonly multiple = input(true);
	readonly uploadUrl = input<string>(undefined);
	readonly cancelConfirmation = input(true);
	showLoadingBox = false;
	files: File[];

	processEvent(event: ObIUploadEvent): void {}
}
