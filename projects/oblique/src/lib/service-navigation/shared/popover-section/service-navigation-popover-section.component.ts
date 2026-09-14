import {Component, ViewEncapsulation, input} from '@angular/core';
import {ObISectionLink} from '../../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-popover-section',
	standalone: false,
	templateUrl: './service-navigation-popover-section.component.html',
	styleUrls: ['./service-navigation-popover-section.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-popover-section'},
})
export class ObServiceNavigationPopoverSectionComponent {
	readonly header = input('');
	readonly links = input<ObISectionLink[]>([]);
	readonly text = input('');
}
