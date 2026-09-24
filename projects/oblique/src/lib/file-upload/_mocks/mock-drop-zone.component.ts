import {ChangeDetectionStrategy, Component, input, output} from '@angular/core';
import {ObIUploadEvent} from '../file-upload.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-drop-zone',
	template: '',
	host: {class: 'ob-drop-zone'},
	exportAs: 'obDropZone',
})
export class ObMockDropZoneComponent {
	readonly uploadEvent = output<ObIUploadEvent>();
	readonly accept = input(['*']);
	readonly maxFileSize = input(5);
	readonly maxFileAmount = input(0);
	readonly multiple = input(true);

	addFiles(fileList: FileList): void {}
}
