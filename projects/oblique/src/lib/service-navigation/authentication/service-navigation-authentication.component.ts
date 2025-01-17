import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'ob-service-navigation-authentication',
	templateUrl: './service-navigation-authentication.component.html',
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./service-navigation-authentication.component.scss'],
	host: {class: 'ob-service-navigation-authentication'},
	standalone: false
})
export class ObServiceNavigationAuthenticationComponent {
	@Input() loginUrl = '';
	@Input() isLoggedIn = false;
	@Output() readonly logoutClicked = new EventEmitter();

	logoutClick(): void {
		this.logoutClicked.emit();
	}
}
