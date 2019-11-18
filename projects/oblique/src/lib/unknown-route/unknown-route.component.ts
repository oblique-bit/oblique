import {Component} from '@angular/core';
import {MasterLayoutConfig} from '../master-layout/master-layout.config';

@Component({
	selector: 'or-unknown-route',
	templateUrl: './unknown-route.component.html',
	styleUrls: ['./unknown-route.component.scss']
})
export class UnknownRouteComponent {
	public homePageRoute;

	constructor(private readonly masterLayoutConfig: MasterLayoutConfig) {
		this.homePageRoute = this.masterLayoutConfig.homePageRoute;
	}
}
