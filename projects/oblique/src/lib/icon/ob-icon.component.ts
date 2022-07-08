import {Component, Inject, Input, Optional} from '@angular/core';
import {ObUseObliqueIcons} from './icon.model';

@Component({
	selector: 'ob-icon',
	templateUrl: './ob-icon.component.html',
	host: {class: 'ob-icon-wrapper'}
})
export class ObIconComponent {
	@Input() icon: string;
	useFontAwesomeIcons = false;
	fontAwesomeAliases = {
		cancel: 'fa-times',
		checkmark: 'fa-check',
		'chevron-down': 'fa-angle-down',
		'chevron-left': 'fa-angle-left',
		'chevron-right': 'fa-angle-right',
		'chevron-small-right': 'fa-angle-right',
		'chevron-up': 'fa-angle-up',
		'cloud-upload': 'fa-cloud-upload-alt',
		info: 'fa-info',
		refresh: 'fa-spinner',
		repeat: 'fa-redo',
		search: 'fa-search',
		trash: 'fa-trash-alt',
		'universal-access': 'fa-universal-access',
		warning: 'fa-exclamation'
	};

	constructor(@Optional() @Inject(ObUseObliqueIcons) useObliqueIcons: boolean) {
		this.useFontAwesomeIcons = !(useObliqueIcons ?? true);
	}
}
