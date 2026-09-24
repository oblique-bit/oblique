import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-form-sample',
	standalone: false,
	templateUrl: './form.component.html',
	styleUrl: './form.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class FormSampleComponent {}
