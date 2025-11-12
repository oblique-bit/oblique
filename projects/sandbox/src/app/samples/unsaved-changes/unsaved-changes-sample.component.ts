import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {UntypedFormBuilder} from '@angular/forms';

@Component({
	selector: 'sb-unsaved-changes',
	standalone: false,
	templateUrl: './unsaved-changes-sample.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnsavedChangesSampleComponent {
	standAloneReactive = inject(UntypedFormBuilder).group({text: '', number: '', integer: ''});
	tabModels = {
		standAloneTemplate: {number: null, text: null, integer: null},
	};
}
