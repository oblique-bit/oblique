import {Component} from '@angular/core';

import {NotificationService} from '../../src';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {

	constructor(notificationService: NotificationService) {
		notificationService.success('Welcome to Oblique2-Reactive'); // TODO: remove this
	}
}
