import {Component} from '@angular/core';
import {MasterLayoutApplicationService} from '../../../../lib';
import {MasterLayoutFooterService} from '../../../../lib/ng/master-layout/master-layout-footer.service';

@Component({
	selector: 'master-layout-sample',
	templateUrl: './master-layout-sample.component.html'
})
export class MasterLayoutSampleComponent {

	constructor(private readonly applicationService: MasterLayoutApplicationService,
				private readonly footerService: MasterLayoutFooterService) {
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

	get footerSM() {
		return this.footerService.small;
	}

	set footerSM(value: boolean) {
		this.footerService.small = value;
	}
}
