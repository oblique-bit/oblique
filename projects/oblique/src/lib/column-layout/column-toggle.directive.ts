import {Directive, inject} from '@angular/core';
import {ObColumnPanelDirective} from './column-panel.directive';

@Directive({
	selector: '[obColumnToggle]',
	standalone: false,
	host: {
		class: 'ob-column-toggle',
		'(click)': 'onclick()',
	},
	exportAs: 'obColumnToggle',
})
export class ObColumnToggleDirective {
	private readonly parent = inject(ObColumnPanelDirective);

	onclick(): void {
		this.parent.toggle();
	}
}
