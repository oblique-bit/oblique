import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {NotificationService} from '../../../../src/notification/notification.service';

@Component({
	selector: 'app-unsaved-changes',
	templateUrl: 'unsaved-changes-sample.component.html',
	// styleUrls: ['./unsaved-changes.component.css']
})
export class UnsavedChangesComponent {
	public tabs: {one: {}; two: {}; three: {}};

	constructor(private notificationService: NotificationService) {}

	ngOnInit() {
		this.tabs = {
			one: {},
			two: {},
			three: {}
		};
	}

	save(form: NgForm) {
		if (form.valid) {
			form.resetForm();
			this.notificationService.success('Form has been successfully saved!');
		}
		return false;
	}
}

