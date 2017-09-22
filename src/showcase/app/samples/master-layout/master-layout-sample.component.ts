import {Component} from '@angular/core';
import {MasterLayoutApplicationService} from '../../../../lib';

@Component({
	selector: 'master-layout-sample',
	templateUrl: './master-layout-sample.component.html'
})
export class MasterLayoutSampleComponent {

	constructor(private applicationService: MasterLayoutApplicationService) {
	}

	get cover(): boolean {
		return this.applicationService.cover;
	}

	set cover(value: boolean) {
		this.applicationService.cover = value;
	}

	get navigation() {
		return this.applicationService.navigation;
	}

	set navigation(value: boolean) {
		this.applicationService.navigation = value;
	}

	get applicationFixed() {
		return this.applicationService.applicationFixed;
	}

	set applicationFixed(value: boolean) {
		this.applicationService.applicationFixed = value;
	}
}
