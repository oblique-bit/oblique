import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgModelGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UnsavedChangesSampleModalComponent} from './unsaved-changes-sample-modal.component';
import {ObUnsavedChangesService} from '@oblique/oblique';

@Component({
	selector: 'sc-unsaved-changes',
	templateUrl: './unsaved-changes-sample.component.html',
	styleUrls: ['./unsaved-changes-sample.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsavedChangesSampleComponent implements OnInit {
	standAloneReactive: UntypedFormGroup;
	nestedReactive: UntypedFormGroup;
	tabForm8Reactive: UntypedFormGroup;
	tabForm9Reactive: UntypedFormGroup;
	tabModels = {
		standAloneTemplate: {number: null, text: null, integer: null, date: null},
		nestedForm1: {number: null, text: null, integer: null, date: null},
		nestedForm2: {number: null, text: null, integer: null, date: null},
		nestedForm3: {number: null, text: null, integer: null, date: null},
		tabForm1: {number: null, text: null, integer: null, date: null}
	};

	@ViewChild('form1') form1 = {} as NgModelGroup;
	@ViewChild('form3') form3 = {} as NgModelGroup;
	@ViewChild('form7') form7 = {} as NgModelGroup;

	constructor(
		private readonly modalService: NgbModal,
		private readonly formBuilder: UntypedFormBuilder,
		private readonly unsavedChangesService: ObUnsavedChangesService
	) {}

	ngOnInit(): void {
		this.standAloneReactive = this.formBuilder.group({text: '', number: '', integer: '', date: ['f', Validators.required]});
		this.nestedReactive = this.formBuilder.group({
			form4: this.formBuilder.group({text: '', number: '', integer: '', date: ''}),
			form5: this.formBuilder.group({text: '', number: '', integer: '', date: ''}),
			form6: this.formBuilder.group({text: '', number: '', integer: '', date: ''})
		});
		this.tabForm8Reactive = this.formBuilder.group({text: '', number: '', integer: '', date: ''});
		this.tabForm9Reactive = this.formBuilder.group({text: '', number: '', integer: '', date: ''});
	}

	modal(): void {
		this.modalService.open(UnsavedChangesSampleModalComponent, {
			beforeDismiss: () => this.unsavedChangesService.ignoreChanges(['template'])
		});
	}
}
