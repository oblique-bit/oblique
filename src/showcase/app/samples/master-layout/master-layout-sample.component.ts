import {Component, OnInit, AfterViewInit} from '@angular/core';
import {MasterLayoutService} from '../../../../lib/ng/master-layout/master-layout.service';
import {Unsubscribable} from '../../../../lib/ng/unsubscribe';
import {takeUntil} from 'rxjs/operators';

@Component({
	selector: 'master-layout-sample',
	templateUrl: './master-layout-sample.component.html'
})
export class MasterLayoutSampleComponent {
	coverLayout = false;

	get applicationFixed() {
		return this.masterLayout.applicationFixed;
	}

	set applicationFixed(value: boolean) {
		this.masterLayout.applicationFixed = value;
	}

	get footerSM() {
		return this.masterLayout.smallFooter;
	}

	set footerSM(value: boolean) {
		this.masterLayout.smallFooter = value;
	}

	get headerMD() {
		return this.masterLayout.mediumHeader;
	}

	set headerMD(value: boolean) {
		this.masterLayout.mediumHeader = value;
	}

	get headerSticky() {
		return this.masterLayout.stickyHeader;
	}

	set headerSticky(value: boolean) {
		this.masterLayout.stickyHeader = value;
	}

	get headerAnimate() {
		return this.masterLayout.animateHeader;
	}

	set headerAnimate(value: boolean) {
		this.masterLayout.animateHeader = value;
	}


	get cover(): boolean {
		return this.masterLayout.coverLayout;
	}

	set cover(value: boolean) {
		this.masterLayout.coverLayout = value;
	}

	get navigation() {
		return !this.masterLayout.noNavigation;
	}

	set navigation(value: boolean) {
		this.masterLayout.noNavigation = !value;
	}

	constructor(private readonly masterLayout: MasterLayoutService) {
		this.coverLayout = this.masterLayout.coverLayout;
	}
}
