import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {ObIServiceNavigationApplication} from '../service-navigation.model';
import {base64StatusImages} from './service-navigation-applications-images';

@Component({
	selector: 'ob-service-navigation-applications',
	templateUrl: './service-navigation-applications.component.html',
	styleUrls: ['./service-navigation-applications.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-applications'}
})
export class ObServiceNavigationApplicationsComponent implements OnChanges {
	@Input() applicationsUrl = '';
	@Input() isLoggedIn = false;
	@Input() lastUsedApplications: ObIServiceNavigationApplication[] = [];
	@Input() maxLastUsedApplications = 3;
	@Input() favoriteApplications: ObIServiceNavigationApplication[] = [];
	@Input() maxFavoriteApplications = 3;
	statusImage = base64StatusImages;

	ngOnChanges(changes: SimpleChanges): void {
		['maxLastUsedApplications', 'maxFavoriteApplications']
			.filter(property => changes[property]?.currentValue < 0)
			.forEach(property => {
				throw new Error(`${property} cannot be negative.`);
			});
	}
}
