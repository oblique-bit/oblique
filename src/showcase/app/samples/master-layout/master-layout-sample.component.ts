import {Component} from '@angular/core';
import {MasterLayoutService} from '../../../../lib/ng/master-layout/master-layout.service';

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

	get navigation() {
		return !this.masterLayout.noNavigation;
	}

	set navigation(value: boolean) {
		this.masterLayout.noNavigation = !value;
	}

	get navigationFW() {
		return this.masterLayout.navigationFullWidth;
	}

	set navigationFW(value: boolean) {
		this.masterLayout.navigationFullWidth = value;
	}

	get navigationScroll() {
		return this.masterLayout.navigationScrollable;
	}

	set navigationScroll(value: boolean) {
		this.masterLayout.navigationScrollable = value;
	}

	get cover(): boolean {
		return this.masterLayout.coverLayout;
	}

	set cover(value: boolean) {
		this.masterLayout.coverLayout = value;
	}

	constructor(private readonly masterLayout: MasterLayoutService) {
		this.coverLayout = this.masterLayout.coverLayout;
	}
}
