import {Component, ViewEncapsulation, input} from '@angular/core';
import {ObIServiceNavigationApplication} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-applications',
	standalone: false,
	templateUrl: './service-navigation-applications.component.html',
	styleUrls: ['./service-navigation-applications.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-applications'},
})
export class ObServiceNavigationApplicationsComponent {
	readonly applicationsUrl = input('');
	readonly isLoggedIn = input(false);
	readonly lastUsedApplications = input<ObIServiceNavigationApplication[]>([]);
	readonly favoriteApplications = input<ObIServiceNavigationApplication[]>([]);
}
