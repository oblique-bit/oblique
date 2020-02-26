import {Component} from '@angular/core';
import {ObNotificationService, ObPopUpService} from 'oblique';

@Component({
	selector: 'ob-pop-up-sample',
	templateUrl: './pop-up-sample.component.html'
})
export class ObPopUpSampleComponent {

	constructor(private popup: ObPopUpService, private notification: ObNotificationService) {
	}

	confirm(text: string): void {
		if (this.popup.confirm(text)) {
			this.notification.success('You confirmed');
		} else {
			this.notification.warning('You denied');
		}
	}

	alert(text: string): void {
		this.popup.alert(text);
		console.log('asdf');
	}

	prompt(text: string): void {
		const data = this.popup.prompt(text);
		this.notification.info(`You entered ${data}`);
	}

}
