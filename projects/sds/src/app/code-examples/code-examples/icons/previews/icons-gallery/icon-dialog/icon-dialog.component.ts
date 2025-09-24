import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {ObButtonModule, ObNotificationModule, ObNotificationService, ObPopoverModule} from '@oblique/oblique';
import type {IconMetadata} from '../icons.model';

@Component({
	selector: 'app-icon-dialog',
	templateUrl: './icon-dialog.component.html',
	styleUrl: './icon-dialog.component.scss',
	imports: [
		ObButtonModule,
		ObNotificationModule,
		ObPopoverModule,
		MatDialogModule,
		MatButtonModule,
		MatIconModule,
		MatCardModule,
		MatTooltipModule,
		MatChipsModule,
		TranslateModule
	]
})
export class IconDialogComponent {
	selectedIconMetaData = inject<IconMetadata>(MAT_DIALOG_DATA);
	selectedIconName: string = this.selectedIconMetaData.name;
	private readonly notificationService = inject(ObNotificationService);
	private readonly translateService = inject(TranslateService);

	public copy(text: string, element = 'Icon name'): void {
		const timeoutDuration = 4000;
		navigator.clipboard.writeText(text).then(
			() =>
				this.notificationService.success({
					message: this.translateService.instant('i18n.icons.copy.notification.success.message', {iconName: text}) as string,
					title: this.translateService.instant('i18n.icons.copy.notification.success.title', {element}) as string,
					timeout: timeoutDuration
				}),
			() =>
				this.notificationService.warning({
					message: this.translateService.instant('i18n.icons.notification.error.message', {iconName: text}) as string,
					title: this.translateService.instant('i18n.icons.notification.error.title', {element}) as string,
					timeout: timeoutDuration
				})
		);
	}
}
