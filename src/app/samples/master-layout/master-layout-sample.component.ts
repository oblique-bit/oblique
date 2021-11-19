import {Component} from '@angular/core';
import {ObEScrollMode, ObMasterLayoutService} from '@oblique/oblique';
import {DynamicNavigationService} from './dynamic-navigation.service';

@Component({
	// eslint-disable-next-line @angular-eslint/component-selector
	selector: 'ob-master-layout-sample',
	templateUrl: './master-layout-sample.component.html',
	styleUrls: ['./master-layout-sample.component.scss']
})
export class ObMasterLayoutSampleComponent {
	coverLayout = false;
	scrollMode = ObEScrollMode;

	constructor(private readonly masterLayout: ObMasterLayoutService, private readonly dynamicNavigationService: DynamicNavigationService) {
		this.coverLayout = this.masterLayout.layout.hasCover;
	}

	// Footer
	get isFooterCustom() {
		return this.masterLayout.footer.isCustom;
	}

	set isFooterCustom(value: boolean) {
		this.masterLayout.footer.isCustom = value;
	}

	get hasLogoOnScroll() {
		return this.masterLayout.footer.hasScrollTransition;
	}

	set hasLogoOnScroll(value: boolean) {
		this.masterLayout.footer.hasScrollTransition = value;
	}

	get isFooterSmall() {
		return this.masterLayout.footer.isSmall;
	}

	set isFooterSmall(value: boolean) {
		this.masterLayout.footer.isSmall = value;
	}

	// Header
	get isHeaderCustom() {
		return this.masterLayout.header.isCustom;
	}

	set isHeaderCustom(value: boolean) {
		this.masterLayout.header.isCustom = value;
	}

	get isHeaderSticky() {
		return this.masterLayout.header.isSticky;
	}

	set isHeaderSticky(value: boolean) {
		this.masterLayout.header.isSticky = value;
	}

	get reduceOnScroll() {
		return this.masterLayout.header.hasScrollTransition;
	}

	set reduceOnScroll(value: boolean) {
		this.masterLayout.header.hasScrollTransition = value;
	}

	get isHeaderSmall() {
		return this.masterLayout.header.isMedium;
	}

	set isHeaderSmall(value: boolean) {
		this.masterLayout.header.isMedium = value;
	}

	// Layout
	get isFixed(): boolean {
		return this.masterLayout.layout.isFixed;
	}

	set isFixed(value: boolean) {
		this.masterLayout.layout.isFixed = value;
	}
	get hasCover(): boolean {
		return this.masterLayout.layout.hasCover;
	}

	set hasCover(value: boolean) {
		this.masterLayout.layout.hasCover = value;
	}

	get hasLayout() {
		return this.masterLayout.layout.hasLayout;
	}

	set hasLayout(value: boolean) {
		this.masterLayout.layout.hasLayout = value;
	}

	get hasMaxWidth() {
		return this.masterLayout.layout.hasMaxWidth;
	}

	set hasMaxWidth(value: boolean) {
		this.masterLayout.layout.hasMaxWidth = value;
	}

	get hasMainNavigation() {
		return this.masterLayout.layout.hasMainNavigation;
	}

	set hasMainNavigation(value: boolean) {
		this.masterLayout.layout.hasMainNavigation = value;
	}

	get hasOffCanvas() {
		return this.masterLayout.layout.hasOffCanvas;
	}

	set hasOffCanvas(value: boolean) {
		this.masterLayout.layout.hasOffCanvas = value;
	}

	get homePageRoute() {
		return this.masterLayout.homePageRoute;
	}

	set homePageRoute(value: string) {
		this.masterLayout.homePageRoute = value;
	}

	get isNavigationFullWidth() {
		return this.masterLayout.navigation.isFullWidth;
	}

	set isNavigationFullWidth(value: boolean) {
		this.masterLayout.navigation.isFullWidth = value;
	}

	get navigationScrollMode() {
		return this.masterLayout.navigation.scrollMode;
	}

	set navigationScrollMode(value: ObEScrollMode) {
		this.masterLayout.navigation.scrollMode = value;
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
