import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'sc-modal-content',
	templateUrl: './unsaved-changes-sample-modal.component.html'
})
export class UnsavedChangesSampleModalComponent {
	data: any = {};

	constructor(public activeModal: NgbActiveModal) {}
}
