import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'ob-service-navigation-message',
	templateUrl: './service-navigation-message.component.html',
	styleUrls: ['./service-navigation-message.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation-message'}
})
export class ObServiceNavigationMessageComponent implements OnChanges {
	@Input() linkHref = '';
	@Input() count = 0;
	tooManyCount = false;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.count) {
			this.tooManyCount = this.count > 99;
		}
	}
}
