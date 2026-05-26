import {NgModule} from '@angular/core';
import {ObMockFileUploadComponent} from './mock-file-upload.component';
import {ObMockFileInfoComponent} from './mock-file-info.component';
import {ObMockDropZoneComponent} from './mock-drop-zone.component';

export {ObMockFileUploadComponent} from './mock-file-upload.component';
export {ObMockFileUploadService} from './mock-file-upload.sevice';
export {ObMockFileInfoComponent} from './mock-file-info.component';
export {ObMockDropZoneComponent} from './mock-drop-zone.component';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@NgModule({
	imports: [ObMockDropZoneComponent, ObMockFileInfoComponent, ObMockFileUploadComponent],
	exports: [ObMockFileInfoComponent, ObMockFileUploadComponent],
})
export class ObMockFileUploadModule {}
