import {Component, ViewEncapsulation} from '@angular/core';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {TranslateModule} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
	selector: 'ob-unknown-route',
	imports: [RouterLink, TranslateModule],
	templateUrl: './unknown-route.component.html',
	styleUrls: ['./unknown-route.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-unknown-route'}
})
export class ObUnknownRouteComponent {
	public homePageRoute;

	constructor(private readonly masterLayoutConfig: ObMasterLayoutConfig) {
		this.homePageRoute = this.masterLayoutConfig.homePageRoute;
	}
}
