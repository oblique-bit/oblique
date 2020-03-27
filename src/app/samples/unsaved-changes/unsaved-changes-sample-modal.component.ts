import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ngbd-modal-content',
	templateUrl: './unsaved-changes-sample-modal.component.html'
})
export class UnsavedChangesSampleModalComponent {
	data: any = {};

	constructor(public activeModal: NgbActiveModal) {}
}
