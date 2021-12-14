import {Component} from '@angular/core';

@Component({
	selector: 'sc-tabs',
	templateUrl: './tabs.component.html',
	styles: [
		`
			[role='tabpanel'] {
				padding: 16px;
			}
		`
	]
})
export class TabsComponent {}
