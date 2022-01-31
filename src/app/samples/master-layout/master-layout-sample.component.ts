import {Component} from '@angular/core';
import {ObEScrollMode, ObMasterLayoutService} from '@oblique/oblique';
import {DynamicNavigationService} from './dynamic-navigation.service';

@Component({
	selector: 'sc-master-layout-sample',
	templateUrl: './master-layout-sample.component.html',
	styleUrls: ['./master-layout-sample.component.scss']
})
export class MasterLayoutSampleComponent {
	coverLayout = false;
	scrollMode = ObEScrollMode;

	constructor(private readonly masterLayout: ObMasterLayoutService, private readonly dynamicNavigationService: DynamicNavigationService) {
		this.coverLayout = this.masterLayout.layout.hasCover;
	}

	// Footer
	get isFooterCustom(): boolean {
		return this.masterLayout.footer.isCustom;
	}

	set isFooterCustom(value: boolean) {
		this.masterLayout.footer.isCustom = value;
	}

	get hasLogoOnScroll(): boolean {
		return this.masterLayout.footer.hasLogoOnScroll;
	}

	set hasLogoOnScroll(value: boolean) {
		this.masterLayout.footer.hasLogoOnScroll = value;
	}

	get isFooterSticky(): boolean {
		return this.masterLayout.footer.isSticky;
	}

	set isFooterSticky(value: boolean) {
		this.masterLayout.footer.isSticky = value;
	}

	// Header
	get isHeaderCustom(): boolean {
		return this.masterLayout.header.isCustom;
	}

	set isHeaderCustom(value: boolean) {
		this.masterLayout.header.isCustom = value;
	}

	get isHeaderSticky(): boolean {
		return this.masterLayout.header.isSticky;
	}

	set isHeaderSticky(value: boolean) {
		this.masterLayout.header.isSticky = value;
	}

	get reduceOnScroll(): boolean {
		return this.masterLayout.header.reduceOnScroll;
	}

	set reduceOnScroll(value: boolean) {
		this.masterLayout.header.reduceOnScroll = value;
	}

	get isHeaderSmall(): boolean {
		return this.masterLayout.header.isSmall;
	}

	set isHeaderSmall(value: boolean) {
		this.masterLayout.header.isSmall = value;
	}

	// Layout
	get hasCover(): boolean {
		return this.masterLayout.layout.hasCover;
	}

	set hasCover(value: boolean) {
		this.masterLayout.layout.hasCover = value;
	}

	get hasLayout(): boolean {
		return this.masterLayout.layout.hasLayout;
	}

	set hasLayout(value: boolean) {
		this.masterLayout.layout.hasLayout = value;
	}

	get hasMaxWidth(): boolean {
		return this.masterLayout.layout.hasMaxWidth;
	}

	set hasMaxWidth(value: boolean) {
		this.masterLayout.layout.hasMaxWidth = value;
	}

	get hasMainNavigation(): boolean {
		return this.masterLayout.layout.hasMainNavigation;
	}

	set hasMainNavigation(value: boolean) {
		this.masterLayout.layout.hasMainNavigation = value;
	}

	get hasOffCanvas(): boolean {
		return this.masterLayout.layout.hasOffCanvas;
	}

	set hasOffCanvas(value: boolean) {
		this.masterLayout.layout.hasOffCanvas = value;
	}

	get homePageRoute(): string {
		return this.masterLayout.homePageRoute;
	}

	set homePageRoute(value: string) {
		this.masterLayout.homePageRoute = value;
	}

	get isNavigationFullWidth(): boolean {
		return this.masterLayout.navigation.isFullWidth;
	}

	set isNavigationFullWidth(value: boolean) {
		this.masterLayout.navigation.isFullWidth = value;
	}

	get navigationScrollMode(): ObEScrollMode {
		return this.masterLayout.navigation.scrollMode;
	}

	set navigationScrollMode(value: ObEScrollMode) {
		this.masterLayout.navigation.scrollMode = value;
	}

	addItem(): void {
		this.dynamicNavigationService.addLink({
			label: 'test',
			url: 'urlTest'
		});
	}

	removeItem(): void {
		this.dynamicNavigationService.removeLastLink();
	}
}
