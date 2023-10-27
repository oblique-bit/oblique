import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObNotificationModule, ObNotificationService} from '@oblique/oblique';
import {Component, inject} from '@angular/core';

@Component({
	selector: 'app-notification-example-default-preview',
	templateUrl: './notification-example-default-preview.component.html',
	standalone: true,
	imports: [ObNotificationModule, ObButtonModule, MatButtonModule]
})
export class NotificationExampleDefaultPreviewComponent {
	private readonly obNotificationService = inject(ObNotificationService);

	send(): void {
		this.obNotificationService.send({
			title: 'Title',
			message: 'Hello this is the notification message'
		});
	}
}
