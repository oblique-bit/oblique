import {Component, Input, ViewEncapsulation, input, output} from '@angular/core';

@Component({
	selector: 'ob-service-navigation-authentication',
	standalone: false,
	templateUrl: './service-navigation-authentication.component.html',
	styleUrls: ['./service-navigation-authentication.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-authentication'},
})
export class ObServiceNavigationAuthenticationComponent {
	@Input() loginUrl = '';
	readonly isLoggedIn = input(false);
	readonly logoutClicked = output();

	logoutClick(): void {
		this.logoutClicked.emit();
	}
}
