import {Component} from '@angular/core';
import {MasterLayoutService} from 'oblique';

@Component({
	selector: 'master-layout-sample',
	templateUrl: './master-layout-sample.component.html'
})
export class MasterLayoutSampleComponent {
	coverLayout = false;

	get applicationFixed() {
		return this.masterLayout.layout.isFixed;
	}

	set applicationFixed(value: boolean) {
		this.masterLayout.layout.isFixed = value;
	}

	get footerSM() {
		return this.masterLayout.footer.isSmall;
	}

	set footerSM(value: boolean) {
		this.masterLayout.footer.isSmall = value;
	}

	get footerTransition() {
		return this.masterLayout.footer.hasScrollTransition;
	}

	set footerTransition(value: boolean) {
		this.masterLayout.footer.hasScrollTransition = value;
	}

	get headerMD() {
		return this.masterLayout.header.isMedium;
	}

	set headerMD(value: boolean) {
		this.masterLayout.header.isMedium = value;
	}

	get headerSticky() {
		return this.masterLayout.header.isSticky;
	}

	set headerSticky(value: boolean) {
		this.masterLayout.header.isSticky = value;
	}

	get headerAnimate() {
		return this.masterLayout.header.isAnimated;
	}

	set headerAnimate(value: boolean) {
		this.masterLayout.header.isAnimated = value;
	}

	get headerTransition() {
		return this.masterLayout.header.hasScrollTransition;
	}

	set headerTransition(value: boolean) {
		this.masterLayout.header.hasScrollTransition = value;
	}

	get navigation() {
		return this.masterLayout.layout.hasMainNavigation;
	}

	set navigation(value: boolean) {
		this.masterLayout.layout.hasMainNavigation = value;
	}

	get navigationFW() {
		return this.masterLayout.navigation.isFullWidth;
	}

	set navigationFW(value: boolean) {
		this.masterLayout.navigation.isFullWidth = value;
	}

	get navigationScroll() {
		return this.masterLayout.navigation.isScrollable;
	}

	set navigationScroll(value: boolean) {
		this.masterLayout.navigation.isScrollable = value;
	}

	get cover(): boolean {
		return this.masterLayout.layout.hasCover;
	}

	set cover(value: boolean) {
		this.masterLayout.layout.hasCover = value;
	}

	constructor(private readonly masterLayout: MasterLayoutService) {
		this.coverLayout = this.masterLayout.layout.hasCover;
	}
}
