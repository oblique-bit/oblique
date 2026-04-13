import {Component, ViewEncapsulation, inject} from '@angular/core';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {TranslateModule} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';
import {ObLocalizePipe} from '../router/ob-localize.pipe';

@Component({
	selector: 'ob-unknown-route',
	imports: [RouterLink, TranslateModule, ObLocalizePipe],
	templateUrl: './unknown-route.component.html',
	styleUrls: ['./unknown-route.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-unknown-route'},
})
export class ObUnknownRouteComponent {
	public homePageRoute;
	private readonly masterLayoutConfig = inject(ObMasterLayoutConfig);

	constructor() {
		this.homePageRoute = this.masterLayoutConfig.homePageRoute;
	}
}
