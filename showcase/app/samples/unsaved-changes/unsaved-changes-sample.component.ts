import {Component} from '@angular/core';
import {NotificationService} from '../../../../src/notification/notification.service';

@Component({
	selector: 'app-unsaved-changes',
	templateUrl: 'unsaved-changes-sample.component.html',
	// styleUrls: ['./unsaved-changes.component.css']
})
export class UnsavedChangesComponent {
	private tabs: {one: {}; two: {}; three: {}};

	constructor(private notificationService: NotificationService) {}

	ngOnInit() {
		this.tabs = {
			one: {},
			two: {},
			three: {}
		};
	}

	save(form) {
		console.log(form);
		if (form.valid) {
			this.ngOnInit();
			this.notificationService.success('Form has been successfully saved!');
		}
		return false;
	}
}

