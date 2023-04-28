import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'ob-service-navigation-authentication',
	templateUrl: './service-navigation-authentication.component.html',
	styleUrls: ['./service-navigation-authentication.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-authentication'}
})
export class ObServiceNavigationAuthenticationComponent {
	@Input() loginUrl = '';
	@Input() logoutUrl = '';
	@Input() isLoggedIn = false;
}
