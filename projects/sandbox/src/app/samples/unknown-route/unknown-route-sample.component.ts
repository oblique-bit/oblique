import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-unknown-route-sample',
	standalone: false,
	templateUrl: './unknown-route-sample.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class UnknownRouteSampleComponent {}
