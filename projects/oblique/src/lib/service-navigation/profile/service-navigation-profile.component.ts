import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ObIServiceNavigationLink} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-profile',
	templateUrl: './service-navigation-profile.component.html',
	styleUrls: ['./service-navigation-profile.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-profile'}
})
export class ObServiceNavigationProfileComponent {
	@Input() userName = '';
	@Input() settingsUrl = '';
	@Input() avatarImageUrl = '';
	@Input() links: ObIServiceNavigationLink[] = [];
}
