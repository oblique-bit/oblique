import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'ob-service-navigation-profile',
	templateUrl: './service-navigation-profile.component.html',
	styleUrls: ['./service-navigation-profile.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-profile'}
})
export class ObServiceNavigationProfileComponent {
	@Input() userName = '';
}
