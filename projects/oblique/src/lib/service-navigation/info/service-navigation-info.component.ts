import {Component, ViewEncapsulation, input} from '@angular/core';
import {ObIServiceNavigationContact, ObIServiceNavigationLink} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-info',
	standalone: false,
	templateUrl: './service-navigation-info.component.html',
	styleUrls: ['./service-navigation-info.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-info'},
})
export class ObServiceNavigationInfoComponent {
	readonly helpText = input<string>();
	readonly description = input<string>();
	readonly links = input<ObIServiceNavigationLink[]>([]);
	readonly contactText = input<string>();
	readonly contact = input<ObIServiceNavigationContact>();
}
