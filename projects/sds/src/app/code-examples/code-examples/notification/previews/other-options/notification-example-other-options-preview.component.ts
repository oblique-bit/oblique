import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, ObENotificationPlacement, ObENotificationType, ObNotificationModule, ObNotificationService} from '@oblique/oblique';
import {Component, inject} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

@Component({
	selector: 'app-notification-example-other-options-preview',
	templateUrl: './notification-example-other-options-preview.component.html',
	standalone: true,
	imports: [ObNotificationModule, ObButtonModule, MatButtonModule, TranslateModule, MatSlideToggleModule],
	styleUrls: ['../../../../code-example-flex-layout.scss', './notification-example-other-options-preview.component.scss']
})
export class NotificationExampleOtherOptionsPreviewComponent {
	public types = ObENotificationType;
	public placements = ObENotificationPlacement;
	public channel = 'demo';

	private readonly obNotificationService = inject(ObNotificationService);

	sendPlacement(placement: ObENotificationPlacement): void {
		this.obNotificationService.placement = placement;
		this.obNotificationService.send({
			channel: this.channel,
			title: 'Title',
			message: 'Hello this is the notification message'
		});
	}

	sendInfo(): void {
		this.obNotificationService.info({
			channel: this.channel,
			title: 'Title of the info message',
			message: 'This is the message text'
		});
	}
	sendSuccess(): void {
		this.obNotificationService.success({
			channel: this.channel,
			title: 'Title of the success message',
			message: 'This is the message text'
		});
	}
	sendWarning(): void {
		this.obNotificationService.warning({
			channel: this.channel,
			title: 'Title of the warning message',
			message: 'This is the message text'
		});
	}
	sendError(): void {
		this.obNotificationService.error({
			channel: this.channel,
			title: 'Title of error message',
			message: 'This is the message text'
		});
	}

	sendMessageParams(messageParams: {message: string; parameters: string}): void {
		this.obNotificationService.send({
			channel: this.channel,
			message: 'i18n.notification.sampleMessage',
			title: 'This is the title of the message with params',
			messageParams
		});
	}

	sendGroupSimilar(type: ObENotificationType): void {
		this.obNotificationService.send({
			channel: this.channel,
			title: 'Title of message using group similar',
			message: 'This is the message text',
			groupSimilar: true,
			type
		});
	}

	sendSticky(sticky: boolean): void {
		this.obNotificationService.info({
			channel: this.channel,
			message: sticky ? 'This message is sticky' : 'This message is not sticky',
			title: 'Title',
			sticky
		});
	}

	sendTimeout(timeout: number): void {
		this.obNotificationService.info({
			channel: this.channel,
			title: `Title of the message with timeout  ${String(timeout)} ms`,
			message: 'This is the message text',
			sticky: false,
			timeout
		});
	}

	clear(): void {
		this.obNotificationService.clear(this.channel);
	}

	clearAllChannels(): void {
		this.obNotificationService.clearAll();
	}
}
