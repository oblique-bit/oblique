import {Component, inject} from '@angular/core';
import {
	ObEScrollMode,
	type ObICollapseBreakpoints,
	type ObIServiceNavigationContact,
	type ObLoginState,
	ObMasterLayoutService
} from '@oblique/oblique';
import {type Observable, share} from 'rxjs';
import {map} from 'rxjs/operators';
import {DynamicNavigationService} from './dynamic-navigation.service';

@Component({
	selector: 'sb-master-layout-sample',
	templateUrl: './master-layout-sample.component.html',
	styleUrl: './master-layout-sample.component.scss',
	standalone: false
})
export class MasterLayoutSampleComponent {
	coverLayout = false;
	scrollMode = ObEScrollMode;
	loginState$: Observable<ObLoginState>;
	logoutUrl$: Observable<string>;
	isLoggedOut$: Observable<boolean>;
	private readonly masterLayout = inject(ObMasterLayoutService);
	private readonly dynamicNavigationService = inject(DynamicNavigationService);
	private readonly infoLinks = [...this.masterLayout.header.serviceNavigationConfiguration.infoLinks];
	private readonly infoContact = {...this.masterLayout.header.serviceNavigationConfiguration.infoContact};
	private readonly profileLinks = [...this.masterLayout.header.serviceNavigationConfiguration.profileLinks];

	constructor() {
		this.coverLayout = this.masterLayout.layout.hasCover;
		this.loginState$ = this.masterLayout.header.loginState$;
		this.logoutUrl$ = this.masterLayout.header.logoutUrl$;
		this.isLoggedOut$ = this.loginState$.pipe(
			map(loginState => !loginState?.includes('OK')),
			share()
		);
	}

	// Footer
	get isFooterCustom(): boolean {
		return this.masterLayout.footer.isCustom;
	}

	set isFooterCustom(value: boolean) {
		this.masterLayout.footer.isCustom = value;
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

	set breakpoint(breakpoint: ObICollapseBreakpoints) {
		this.dynamicNavigationService.collapseBreakpoint.set(breakpoint);
	}

	get breakpoint(): ObICollapseBreakpoints {
		return this.dynamicNavigationService.collapseBreakpoint();
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

	get hasApplicationsWidget(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.displayApplications;
	}

	set hasApplicationsWidget(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.displayApplications = value;
	}

	get hasAuthenticationWidget(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.displayAuthentication;
	}

	set hasAuthenticationWidget(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.displayAuthentication = value;
	}

	get hasInfoWidget(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.displayInfo;
	}

	set hasInfoWidget(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.displayInfo = value;
	}

	get hasLanguagesWidget(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.displayLanguages;
	}

	set hasLanguagesWidget(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.displayLanguages = value;
	}

	get hasMessageWidget(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.displayMessage;
	}

	set hasMessageWidget(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.displayMessage = value;
	}

	get hasProfileWidget(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.displayProfile;
	}

	set hasProfileWidget(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.displayProfile = value;
	}

	get hasInfoLinks(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoLinks?.length > 0;
	}

	set hasInfoLinks(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoLinks = value ? this.infoLinks : [];
	}

	get hasContactForm(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.formUrl?.length > 0;
	}
	set hasContactForm(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact = this.buildContactInfo(
			this.hasContactPhone,
			this.hasContactEmail,
			value
		);
	}

	get hasContactEmail(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.email?.length > 0;
	}

	set hasContactEmail(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact = this.buildContactInfo(
			this.hasContactPhone,
			value,
			this.hasContactForm
		);
	}

	get hasContactPhone(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.tel?.length > 0;
	}

	set hasContactPhone(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact = this.buildContactInfo(
			value,
			this.hasContactEmail,
			this.hasContactForm
		);
	}

	get hasProfileLinks(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.profileLinks?.length > 0;
	}

	set hasProfileLinks(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.profileLinks = value ? this.profileLinks : [];
	}

	get maxLastUsedApplications(): number {
		return this.masterLayout.header.serviceNavigationConfiguration.maxLastUsedApplications;
	}

	set maxLastUsedApplications(value: number) {
		this.masterLayout.header.serviceNavigationConfiguration.maxLastUsedApplications = value;
	}

	get maxFavoriteApplications(): number {
		return this.masterLayout.header.serviceNavigationConfiguration.maxFavoriteApplications;
	}

	set maxFavoriteApplications(value: number) {
		this.masterLayout.header.serviceNavigationConfiguration.maxFavoriteApplications = value;
	}

	get handleLogout(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.handleLogout;
	}

	set handleLogout(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.handleLogout = value;
	}

	addItem(): void {
		this.dynamicNavigationService.addLink({
			id: `id${crypto.randomUUID()}`,
			label: 'test',
			url: 'urlTest'
		});
	}

	removeItem(): void {
		this.dynamicNavigationService.removeLastLink();
	}

	private buildContactInfo(hasTel: boolean, hasEmail: boolean, hasContactForm: boolean): ObIServiceNavigationContact {
		return {
			tel: hasTel ? this.infoContact.tel : undefined,
			email: hasEmail ? this.infoContact.email : undefined,
			formUrl: hasContactForm ? this.infoContact.formUrl : undefined
		};
	}
}
