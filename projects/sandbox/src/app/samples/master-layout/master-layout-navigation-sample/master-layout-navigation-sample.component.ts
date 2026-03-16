import {Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatTooltip} from '@angular/material/tooltip';
import {ObButtonDirective, ObEScrollMode, type ObLoginState, ObMasterLayoutService} from '@oblique/oblique';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DynamicNavigationService} from '../dynamic-navigation.service';
import {type Observable, share} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
	selector: 'sb-master-layout-navigation-sample',
	imports: [
		AsyncPipe,
		MatButton,
		MatButtonToggle,
		MatButtonToggleGroup,
		MatCard,
		MatCardContent,
		MatCardTitle,
		MatFormField,
		MatIcon,
		MatInput,
		MatLabel,
		MatSlideToggle,
		MatTooltip,
		ObButtonDirective,
		ReactiveFormsModule,
		FormsModule,
	],
	templateUrl: './master-layout-navigation-sample.component.html',
	styleUrl: './master-layout-navigation-sample.component.scss',
})
export class MasterLayoutNavigationSampleComponent {
	loginState$: Observable<ObLoginState>;
	logoutUrl$: Observable<string>;
	isLoggedOut$: Observable<boolean>;
	protected readonly scrollMode = ObEScrollMode;
	private readonly masterLayout = inject(ObMasterLayoutService);
	private readonly dynamicNavigationService = inject(DynamicNavigationService);
	private readonly infoLinks = [...this.masterLayout.header.serviceNavigationConfiguration.infoLinks];
	private readonly infoContact = {...this.masterLayout.header.serviceNavigationConfiguration.infoContact};
	private readonly profileLinks = [...this.masterLayout.header.serviceNavigationConfiguration.profileLinks];
	private useCustomNavigationInternal = false;
	constructor() {
		this.loginState$ = this.masterLayout.header.loginState$;
		this.logoutUrl$ = this.masterLayout.header.logoutUrl$;
		this.isLoggedOut$ = this.loginState$.pipe(
			map(loginState => !loginState?.includes('OK')),
			share()
		);
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

	get hasEportalLanguageSynchronization(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.eportalLanguageSynchronization;
	}

	set hasEportalLanguageSynchronization(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.eportalLanguageSynchronization = value;
	}

	get hasInfoLinks(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoLinks?.length > 0;
	}

	set hasInfoLinks(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoLinks = value ? this.infoLinks : [];
	}

	get hasInfoBackend(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.useInfoBackend ?? false;
	}
	set hasInfoBackend(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.useInfoBackend = value;
	}

	get hasContactForm(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.formUrl?.length > 0;
	}
	set hasContactForm(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact.formUrl = value
			? this.infoContact.formUrl
			: undefined;
	}

	get hasContactFormText(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.formUrlText?.length > 0;
	}
	set hasContactFormText(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact.formUrlText = value
			? this.infoContact.formUrlText
			: undefined;
	}

	get hasContactEmail(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.email?.length > 0;
	}
	set hasContactEmail(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact.email = value
			? this.infoContact.email
			: undefined;
	}

	get hasContactEmailText(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.emailText?.length > 0;
	}
	set hasContactEmailText(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact.emailText = value
			? this.infoContact.emailText
			: undefined;
	}

	get hasContactPhone(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.phone?.length > 0;
	}
	set hasContactPhone(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact.phone = value
			? this.infoContact.phone
			: undefined;
	}

	get hasContactPhoneText(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.infoContact.phoneText?.length > 0;
	}
	set hasContactPhoneText(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.infoContact.phoneText = value
			? this.infoContact.phoneText
			: undefined;
	}

	get hasProfileLinks(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.profileLinks?.length > 0;
	}

	set hasProfileLinks(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.profileLinks = value ? this.profileLinks : [];
	}

	get handleLogout(): boolean {
		return this.masterLayout.header.serviceNavigationConfiguration.handleLogout;
	}

	set handleLogout(value: boolean) {
		this.masterLayout.header.serviceNavigationConfiguration.handleLogout = value;
	}

	get useCustomNavigation(): boolean {
		return this.useCustomNavigationInternal;
	}

	set useCustomNavigation(value: boolean) {
		this.useCustomNavigationInternal = value;
		this.dynamicNavigationService.useCustomNavigation(value);
	}

	addItem(): void {
		this.dynamicNavigationService.addLink({
			id: `id${crypto.randomUUID()}`,
			label: 'test',
			url: 'urlTest',
		});
	}

	removeItem(): void {
		this.dynamicNavigationService.removeLastLink();
	}

	get homePageRoute(): string {
		return this.masterLayout.homePageRoute;
	}

	set homePageRoute(value: string) {
		this.masterLayout.homePageRoute = value;
	}
}
