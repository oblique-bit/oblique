import {Component} from '@angular/core';
import {ObEScrollMode, ObMasterLayoutService} from 'oblique';
import {DynamicNavigationService} from './dynamic-navigation.service';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-master-layout-sample',
	templateUrl: './master-layout-sample.component.html'
})
export class ObMasterLayoutSampleComponent {
	coverLayout = false;
	scrollMode = ObEScrollMode;

	constructor(private readonly masterLayout: ObMasterLayoutService, private readonly dynamicNavigationService: DynamicNavigationService) {
		this.coverLayout = this.masterLayout.layout.hasCover;
	}

	get applicationFixed() {
		return this.masterLayout.layout.isFixed;
	}

	set applicationFixed(value: boolean) {
		this.masterLayout.layout.isFixed = value;
	}

	get hasLayout() {
		return this.masterLayout.layout.hasLayout;
	}

	set hasLayout(value: boolean) {
		this.masterLayout.layout.hasLayout = value;
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

	get navigationScrollMode() {
		return this.masterLayout.navigation.scrollMode;
	}

	set navigationScrollMode(value: ObEScrollMode) {
		this.masterLayout.navigation.scrollMode = value;
	}

	get cover(): boolean {
		return this.masterLayout.layout.hasCover;
	}

	set cover(value: boolean) {
		this.masterLayout.layout.hasCover = value;
	}

	addItem() {
		this.dynamicNavigationService.addLink({
			label: 'test',
			url: 'urlTest'
		});
	}

	removeItem() {
		this.dynamicNavigationService.removeLastLink();
	}
}
