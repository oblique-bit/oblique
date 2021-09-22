import {NgModule} from '@angular/core';
import {ObMockFileUploadComponent} from './mock-file-upload.component';
import {ObMockFileInfoComponent} from './mock-file-info.component';
import {ObMockDropZoneComponent} from './mock-drop-zone.component';

export {ObMockFileUploadComponent} from './mock-file-upload.component';
export {ObMockFileUploadService} from './mock-file-upload.sevice';
export {ObMockFileInfoComponent} from './mock-file-info.component';
export {ObMockDropZoneComponent} from './mock-drop-zone.component';

@NgModule({
	declarations: [ObMockFileUploadComponent, ObMockFileInfoComponent, ObMockDropZoneComponent],
	exports: [ObMockFileUploadComponent, ObMockFileInfoComponent]
})
export class ObMockFileUploadModule {}
