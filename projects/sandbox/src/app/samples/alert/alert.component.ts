import {Component} from '@angular/core';
import {ObIAlertType} from '@oblique/oblique';

@Component({
	selector: 'sb-alert-sample',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertSampleComponent {
	type: ObIAlertType = 'info';
	hasAlertRole: boolean = undefined;
}
