import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {TranslateModule} from '@ngx-translate/core';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObFileUploadComponent} from './file-upload.component';
import {ObFileInfoComponent} from './file-info/file-info.component';
import {ObIconModule} from '../icon/icon.module';
import {ObDragDropDirective} from './drop-zone/drag-and-drop.directive';
import {ObAlertModule} from '../alert/alert.module';
import {ObNotificationModule} from '../notification/notification.module';
import {ObButtonModule} from '../button/button.module';
import {ObAcceptAllPipe} from './drop-zone/accept-all.pipe';
import {ObDropZoneComponent} from './drop-zone/ob-drop-zone.component';
import {ObProgressComponent} from './progress/progress.component';

export {ObFileUploadComponent} from './file-upload.component';
export {ObDropZoneComponent} from './drop-zone/ob-drop-zone.component';
export {ObFileUploadService} from './file-upload.service';
export {ObFileInfoComponent} from './file-info/file-info.component';
export {ObIFileDescription, ObIUploadEvent, ObEUploadEventType} from './file-upload.model';

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatCheckboxModule,
		MatIconModule,
		MatProgressBarModule,
		MatTableModule,
		MatSortModule,
		MatTooltipModule,
		TranslateModule,
		ObAlertModule,
		ObButtonModule,
		ObIconModule,
		ObNotificationModule
	],
	declarations: [
		ObFileUploadComponent,
		ObFileInfoComponent,
		ObDragDropDirective,
		ObAcceptAllPipe,
		ObDropZoneComponent,
		ObProgressComponent
	],
	exports: [ObFileUploadComponent, ObDropZoneComponent, ObFileInfoComponent],
	providers: obliqueProviders()
})
export class ObFileUploadModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObFileUploadModule);
	}
}
