import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NgForm} from '@angular/forms';
import {NotificationService} from '../../../../lib/ng/notification/notification.service';
import {UnsavedChangesService} from '../../../../lib/ng/unsaved-changes/unsaved-changes.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UnsavedChangesSampleModalComponent} from './unsaved-changes-sample-modal.component';

@Component({
	selector: 'app-unsaved-changes',
	templateUrl: 'unsaved-changes-sample.component.html',
	styles: [`
		.unsaved-changes .tab-content {
			padding: 15px;
			border: 1px solid #ddd;
			border-top-width: 0;
		}
		
		.unsaved-changes > .row + .row,
		 nbg-tabset + .row {
			margin-top: 2rem;
		}
	`],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsavedChangesSampleComponent implements OnInit {
	public tabModels: {zero: any, one: any; two: any; three: any, four: any, five: any, six: any};



	constructor(private notificationService: NotificationService,
				private modalService: NgbModal,
				public unsavedChangesService: UnsavedChangesService) {
	}

	ngOnInit() {
		this.tabModels = {
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
