import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgModelGroup} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UnsavedChangesService} from '../../../../lib';
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
	`],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsavedChangesSampleComponent implements OnInit {
	standAloneReactive: FormGroup;
	nestedReactive: FormGroup;
	tabForm8Reactive: FormGroup;
	tabForm9Reactive: FormGroup;
	tabModels = {
		standAloneTemplate: {},
		nestedForm1: {},
		nestedForm2: {},
		nestedForm3: {},
		tabForm1: {}
	};

	@ViewChild('form1') form1 = <NgModelGroup>{};
	@ViewChild('form3') form3 = <NgModelGroup>{};
	@ViewChild('form7') form7 = <NgModelGroup>{};


	constructor(private modalService: NgbModal,
				private formBuilder: FormBuilder,
				private unsavedChangesService: UnsavedChangesService) {
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

	modal() {
		this.modalService.open(UnsavedChangesSampleModalComponent, {
			beforeDismiss: () => this.unsavedChangesService.ignoreChanges(['template'])
		});
	}
}
