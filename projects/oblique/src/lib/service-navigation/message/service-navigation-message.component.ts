import {Component, ViewEncapsulation, computed, input} from '@angular/core';

@Component({
	selector: 'ob-service-navigation-message',
	standalone: false,
	templateUrl: './service-navigation-message.component.html',
	styleUrls: ['./service-navigation-message.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-message'},
})
export class ObServiceNavigationMessageComponent {
	readonly linkHref = input('');
	readonly count = input(0);
	readonly tooManyCount = computed(() => this.count() > 99);
}
