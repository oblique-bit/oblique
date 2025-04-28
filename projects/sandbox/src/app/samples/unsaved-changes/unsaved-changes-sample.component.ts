import {ChangeDetectionStrategy, Component, ViewChild, inject} from '@angular/core';
import {type NgModelGroup, UntypedFormBuilder} from '@angular/forms';

@Component({
	selector: 'sb-unsaved-changes',
	templateUrl: './unsaved-changes-sample.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: false
})
export class UnsavedChangesSampleComponent {
	standAloneReactive = inject(UntypedFormBuilder).group({text: '', number: '', integer: ''});
	tabModels = {
		standAloneTemplate: {number: null, text: null, integer: null}
	};

	@ViewChild('form1') form1 = {} as NgModelGroup;
}
