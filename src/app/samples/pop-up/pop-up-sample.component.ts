import {Component} from '@angular/core';
import {ObNotificationService, ObPopUpService} from '@oblique/oblique';

@Component({
	selector: 'ob-pop-up-sample',
	templateUrl: './pop-up-sample.component.html'
})
export class ObPopUpSampleComponent {
	constructor(private readonly popup: ObPopUpService, private readonly notification: ObNotificationService) {}

	confirm(text: string): void {
		if (this.popup.confirm(text)) {
			this.notification.success('You confirmed');
		} else {
			this.notification.warning('You denied');
		}
	}

	alert(text: string): void {
		this.popup.alert(text);
	}

	prompt(text: string): void {
		const data = this.popup.prompt(text);
		this.notification.info(`You entered ${data}`);
	}
}
