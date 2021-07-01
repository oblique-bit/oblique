import {Component, Inject, Input, Optional} from '@angular/core';
import {ObUseObliqueIcons} from './icon.model';

@Component({
	selector: 'ob-icon',
	templateUrl: './ob-icon.component.html'
})
export class ObIconComponent {
	@Input() icon: string;
	fontAwesomeAliases = {
		cancel: 'fa-times',
		checkmark: 'fa-check',
		'chevron-down': 'fa-angle-down',
		'chevron-left': 'fa-angle-left',
		'chevron-right': 'fa-angle-right',
		'chevron-up': 'fa-angle-up',
		info: 'fa-info',
		refresh: 'fa-spinner',
		search: 'fa-search',
		warning: 'fa-exclamation',
		wheelchair: 'fa-universal-access'
	};

	constructor(@Optional() @Inject(ObUseObliqueIcons) public readonly useObliqueIcons: boolean) {}
}
