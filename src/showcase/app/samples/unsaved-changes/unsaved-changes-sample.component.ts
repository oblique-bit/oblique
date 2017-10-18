import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {UnsavedChangesService} from '../../../../lib/ng/unsaved-changes/unsaved-changes.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UnsavedChangesSampleModalComponent} from './unsaved-changes-sample-modal.component';

@Component({
	selector: 'app-unsaved-changes',
	templateUrl: 'unsaved-changes-sample.component.html',
	styles: [`
		.unsaved-changes .form-horizontal label {
			text-align: right;
		}
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
	public standAloneReactive: FormGroup;
	public nestedReactive: FormGroup;
	public tabForm8Reactive: FormGroup;
	public tabForm9Reactive: FormGroup;
	public tabModels = {
		standAloneTemplate: {},
		nestedForm1: {},
		nestedForm2: {},
		nestedForm3: {},
		tabForm1: {}
	};



	constructor(private modalService: NgbModal,
				private formBuilder: FormBuilder,
				public unsavedChangesService: UnsavedChangesService) {
	}

	ngOnInit() {
		this.standAloneReactive = this.formBuilder.group({text: '', number: '', integer: '', date: ''});
		this.nestedReactive = this.formBuilder.group({
			form4: this.formBuilder.group({text: '', number: '', integer: '', date: ''}),
			form5: this.formBuilder.group({text: '', number: '', integer: '', date: ''}),
			form6: this.formBuilder.group({text: '', number: '', integer: '', date: ''})
		});
		this.tabForm8Reactive = this.formBuilder.group({text: '', number: '', integer: '', date: ''});
		this.tabForm9Reactive = this.formBuilder.group({text: '', number: '', integer: '', date: ''});
	}

	reset() {
		this.standAloneReactive.reset();
	}

	modal() {
		this.modalService.open(UnsavedChangesSampleModalComponent, {
			beforeDismiss: () => {
				return this.unsavedChangesService.discardChanges('template');
			}
		})
	}
}
