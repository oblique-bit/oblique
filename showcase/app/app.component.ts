import {Component} from '@angular/core';
import {NgbTooltipConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(tooltipConfig: NgbTooltipConfig) {
		tooltipConfig.container = 'body';
	}
}
