import {Component} from '@angular/core';
import type {ObIAlertType} from '@oblique/oblique';

@Component({
	selector: 'sb-alert-sample',
	standalone: false,
	templateUrl: './alert.component.html',
	styleUrl: './alert.component.scss',
})
export class AlertSampleComponent {
	type: ObIAlertType = 'info';
	hasAlertRole: boolean = undefined;
}
