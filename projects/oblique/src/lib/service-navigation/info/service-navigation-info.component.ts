import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ObIServiceNavigationLink} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-info',
	templateUrl: './service-navigation-info.component.html',
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-info'}
})
export class ObServiceNavigationInfoComponent {
	@Input() links: ObIServiceNavigationLink[] = [];
}
