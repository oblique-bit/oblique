import {Component} from '@angular/core';
import {LayoutManagerService} from '../../../../src';

@Component({
	selector: 'layout-manager-sample',
	templateUrl: './layout-manager-sample.component.html'
})
export class LayoutManagerSampleComponent {

	constructor(private layoutManager: LayoutManagerService) {

	}

	get cover(): boolean {
		return this.layoutManager.cover;
	}

	set cover(value: boolean) {
		this.layoutManager.cover = value;
	}

	set navigation(value: boolean) {
		this.layoutManager.navigation = value;
	}
}
