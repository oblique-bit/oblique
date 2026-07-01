import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
	selector: 'sb-alert',
	standalone: false,
	templateUrl: './alert.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class AlertComponent {}
