import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ObIServiceNavigationApplication} from '../service-navigation.model';
import {base64StatusImages} from './service-navigation-applications-images';

@Component({
	selector: 'ob-service-navigation-applications',
	templateUrl: './service-navigation-applications.component.html',
	styleUrls: ['./service-navigation-applications.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-applications'}
})
export class ObServiceNavigationApplicationsComponent {
	@Input() applicationsUrl = '';
	@Input() isLoggedIn = false;
	@Input() lastUsedApplications: ObIServiceNavigationApplication[] = [];
	@Input() favoriteApplications: ObIServiceNavigationApplication[] = [];
	statusImage = base64StatusImages;
}
