import {Component, ViewEncapsulation} from '@angular/core';
import {ObMasterLayoutConfig} from '../master-layout/master-layout.config';
import {ObMockTranslatePipe} from '../_mocks/mock-translate.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {RouterLink} from '@angular/router';

@Component({
	selector: 'ob-unknown-route',
	host: {class: 'ob-unknown-route'},
	templateUrl: './unknown-route.component.html',
	styleUrls: ['./unknown-route.component.scss'],
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	imports: [RouterLink, TranslateModule, ObMockTranslatePipe]
})
export class ObUnknownRouteComponent {
	public homePageRoute;

	constructor(private readonly masterLayoutConfig: ObMasterLayoutConfig) {
		this.homePageRoute = this.masterLayoutConfig.homePageRoute;
	}
}
