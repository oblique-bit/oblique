import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation, input} from '@angular/core';
import {ObIServiceNavigationContact, ObIServiceNavigationLink} from '../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-info',
	standalone: false,
	templateUrl: './service-navigation-info.component.html',
	styleUrls: ['./service-navigation-info.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-info'},
})
export class ObServiceNavigationInfoComponent {
	readonly helpText = input<string>(undefined);
	@Input() description: string;
	@Input() links: ObIServiceNavigationLink[] = [];
	readonly contactText = input<string>(undefined);
	@Input() contact: ObIServiceNavigationContact;
}
