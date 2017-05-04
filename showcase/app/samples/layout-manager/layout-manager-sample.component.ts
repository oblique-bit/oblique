import {Component, OnDestroy} from '@angular/core';
import {LayoutManagerService} from '../../../../src/layout-manager/layout-manager.service';

@Component({
	selector: 'layout-manager-sample',
	templateUrl: './layout-manager-sample.component.html'
})
export class LayoutManagerSampleComponent implements OnDestroy {

	constructor(private uiLayoutService: LayoutManagerService) {

	}

	get cover(): boolean {
		return this.uiLayoutService.cover;
	}

	set cover(value: boolean) {
		this.uiLayoutService.cover = value;
	}

	set navigation(value: boolean) {
		this.uiLayoutService.navigation = value;
	}

	ngOnDestroy() {
		// Ensure navigation is restored:
		this.navigation = true;
	}
}
