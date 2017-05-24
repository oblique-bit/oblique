import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {NotificationService} from '../../../../src/notification/notification.service';
import {UnsavedChangesService} from '../../../../src/unsaved-changes/unsaved-changes.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UnsavedChangesSampleModalComponent} from './unsaved-changes-sample-modal.component';

@Component({
	selector: 'app-unsaved-changes',
	templateUrl: 'unsaved-changes-sample.component.html',
	// styleUrls: ['./unsaved-changes.component.css']
})
export class UnsavedChangesSampleComponent {
	public tabs: {zero: {}, one: {}; two: {}; three: {}, four: {}, five: {}, six: {}};

	constructor(private notificationService: NotificationService,
				private modalService: NgbModal,
				public unsavedChangesService:UnsavedChangesService) {}

	ngOnInit() {
		this.tabs = {
			zero: {},
			one: {},
			two: {},
			three: {},
			four: {},
			five: {},
			six: {}
		};
	}

	save(form: NgForm) {
		if (form.valid) {
			form.resetForm();
			this.notificationService.success('Form has been successfully saved!');
		}
		return false;
	}

	modal() {
		this.modalService.open(UnsavedChangesSampleModalComponent)
	}
}

