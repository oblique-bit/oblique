import {Component, Input} from '@angular/core';

@Component({
	selector: 'ob-icon',
	templateUrl: './ob-icon.component.html',
	host: {class: 'ob-icon-wrapper'}
})
export class ObIconComponent {
	@Input() icon: string;
}
