import {Component} from '@angular/core';
import type {ObIAlertType} from '@oblique/oblique';

@Component({
	selector: 'sb-alert-sample',
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.scss',
	standalone: false
})
export class AlertSampleComponent {
	type: ObIAlertType = 'info';
	hasAlertRole: boolean = undefined;
}
