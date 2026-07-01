import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation, input} from '@angular/core';
import {ObISectionLink} from '../../service-navigation.model';

@Component({
	selector: 'ob-service-navigation-popover-section',
	standalone: false,
	templateUrl: './service-navigation-popover-section.component.html',
	styleUrls: ['./service-navigation-popover-section.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-popover-section'},
})
export class ObServiceNavigationPopoverSectionComponent {
	readonly header = input('');
	@Input() links: ObISectionLink[] = [];
	@Input() text = '';
}
