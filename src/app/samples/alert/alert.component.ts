import {Component} from '@angular/core';
import {ObIAlertType} from '@oblique/oblique';

@Component({
	selector: 'ob-alert-sample',
	templateUrl: './alert.component.html'
})
export class ObAlertSampleComponent {
	type: ObIAlertType = 'info';
}
