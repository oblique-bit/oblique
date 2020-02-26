import {Component, ViewEncapsulation} from '@angular/core';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';

@Component({
	selector: 'ob-unknown-route',
	templateUrl: './unknown-route.component.html',
	styleUrls: ['./unknown-route.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ObUnknownRouteComponent {
	public homePageRoute;

	constructor(private readonly masterLayoutConfig: ObMasterLayoutConfig) {
		this.homePageRoute = this.masterLayoutConfig.homePageRoute;
	}
}
