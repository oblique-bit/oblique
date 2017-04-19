import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {NotificationService} from '../../../../src/notification/notification.service';
import {UnsavedChangesService} from '../../../../src/unsaved-changes/unsaved-changes.service';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-unsaved-changes',
	templateUrl: 'unsaved-changes-sample.component.html',
	// styleUrls: ['./unsaved-changes.component.css']
})
export class UnsavedChangesComponent {
	public tabs: {one: {}; two: {}; three: {}, four: {}, five: {}, six: {}};

	constructor(private notificationService: NotificationService, private unsavedChangesService: UnsavedChangesService) {}

	ngOnInit() {
		this.tabs = {
			one: {},
			two: {},
			three: {},
			four: {},
			five: {},
			six: {}
		};
	}

	tabChange(event: NgbTabChangeEvent) {
		this.unsavedChangesService.checkForTabChanges(event);
	}

	nestedFormTabChange(event: NgbTabChangeEvent) {
		this.unsavedChangesService.canDeactivate();
	}

	save(form: NgForm) {
		if (form.valid) {
			form.resetForm();
			this.notificationService.success('Form has been successfully saved!');
		}
		return false;
	}
}

