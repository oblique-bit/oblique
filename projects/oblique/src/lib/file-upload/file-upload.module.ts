import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule} from '@ngx-translate/core';
import {ObAlertModule} from '../alert/alert.module';
import {ObButtonModule} from '../button/button.module';
import {ObNotificationModule} from '../notification/notification.module';
import {obliqueProviders} from '../utilities';
import {ObAcceptAllPipe} from './drop-zone/accept-all.pipe';
import {ObDragDropDirective} from './drop-zone/drag-and-drop.directive';
import {ObDropZoneComponent} from './drop-zone/ob-drop-zone.component';
import {ObFileInfoComponent} from './file-info/file-info.component';
import {ObFileUploadComponent} from './file-upload.component';
import {ObProgressComponent} from './progress/progress.component';

export {ObDropZoneComponent} from './drop-zone/ob-drop-zone.component';
export {ObFileInfoComponent} from './file-info/file-info.component';
export {ObFileUploadComponent} from './file-upload.component';
export {ObEUploadEventType, ObIFileDescription, ObIUploadEvent} from './file-upload.model';
export {ObFileUploadService} from './file-upload.service';

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
		ObAcceptAllPipe,
		ObAlertModule,
		ObButtonModule,
		ObDragDropDirective,
		ObDropZoneComponent,
		ObFileInfoComponent,
		ObFileUploadComponent,
		ObNotificationModule,
		ObProgressComponent,
		TranslateModule
	],
	exports: [ObDropZoneComponent, ObFileInfoComponent, ObFileUploadComponent],
	providers: obliqueProviders()
})
export class ObFileUploadModule {}
