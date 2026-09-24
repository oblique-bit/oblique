import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-slider',
	standalone: false,
	templateUrl: './spinner.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class SpinnerComponent {}
