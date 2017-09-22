import {Component} from '@angular/core';
import {NgbTooltipConfig, NgbDatepickerConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	constructor(tooltipConfig: NgbTooltipConfig, datepickerConfig: NgbDatepickerConfig) {
		tooltipConfig.container = 'body';
		datepickerConfig.navigation = 'arrows';
	}
}
