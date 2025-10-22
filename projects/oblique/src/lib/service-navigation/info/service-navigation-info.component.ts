import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ObIServiceNavigationContact, ObIServiceNavigationLink} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-info',
	standalone: false,
	templateUrl: './service-navigation-info.component.html',
	styleUrls: ['./service-navigation-info.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-info'}
})
export class ObServiceNavigationInfoComponent {
	@Input() helpText: string;
	@Input() description: string;
	@Input() links: ObIServiceNavigationLink[] = [];
	@Input() contactText: string;
	@Input() contact: ObIServiceNavigationContact;
}
