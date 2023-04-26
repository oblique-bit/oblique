import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {TranslateModule} from '@ngx-translate/core';
import {obliqueProviders} from '../utilities';
import {ObFileUploadComponent} from './file-upload.component';
import {ObFileInfoComponent} from './file-info/file-info.component';
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
		MatSortModule,
		MatTableModule,
		MatTooltipModule,
		ObAlertModule,
		ObButtonModule,
		ObNotificationModule,
		TranslateModule
	],
	declarations: [
		ObAcceptAllPipe,
		ObDragDropDirective,
		ObDropZoneComponent,
		ObFileInfoComponent,
		ObFileUploadComponent,
		ObProgressComponent
	],
	exports: [ObDropZoneComponent, ObFileInfoComponent, ObFileUploadComponent],
	providers: obliqueProviders()
})
export class ObFileUploadModule {}
