import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ObISectionLink} from '../../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-popover-section',
	templateUrl: './service-navigation-popover-section.component.html',
	styleUrls: ['./service-navigation-popover-section.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-popover-section'}
})
export class ObServiceNavigationPopoverSectionComponent {
	@Input() header = '';
	@Input() links: ObISectionLink[] = [];
}
