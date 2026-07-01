import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation, input} from '@angular/core';
import {ObISectionLink, ObIServiceNavigationLink} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-profile',
	standalone: false,
	templateUrl: './service-navigation-profile.component.html',
	styleUrls: ['./service-navigation-profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-profile'},
})
export class ObServiceNavigationProfileComponent {
	readonly userName = input('');
	readonly profileUrls = input<ObISectionLink[]>([]);
	@Input() links: ObIServiceNavigationLink[] = [];
}
