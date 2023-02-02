import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NgModelGroup, UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';

@Component({
	selector: 'sc-unsaved-changes',
	templateUrl: './unsaved-changes-sample.component.html',
	styleUrls: ['./unsaved-changes-sample.component.scss'],
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsavedChangesSampleComponent implements OnInit {
	standAloneReactive: UntypedFormGroup;
	tabModels = {
		standAloneTemplate: {number: null, text: null, integer: null}
	};

	@ViewChild('form1') form1 = {} as NgModelGroup;

	constructor(private readonly formBuilder: UntypedFormBuilder) {}

	ngOnInit(): void {
		this.standAloneReactive = this.formBuilder.group({text: '', number: '', integer: ''});
	}
}
