import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ObIServiceNavigationContact, ObIServiceNavigationLink} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-info',
	templateUrl: './service-navigation-info.component.html',
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-info'},
	standalone: false
})
export class ObServiceNavigationInfoComponent {
	@Input() description: string;
	@Input() links: ObIServiceNavigationLink[] = [];
	@Input() contact: ObIServiceNavigationContact;
}
