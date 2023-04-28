import {Component, Input, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'ob-service-navigation-message',
	templateUrl: './service-navigation-message.component.html',
	styleUrls: ['./service-navigation-message.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-message'}
})
export class ObServiceNavigationMessageComponent {
	@Input() linkHref = '';
	@Input() count = 0;
}
