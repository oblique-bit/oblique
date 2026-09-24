import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatTooltip} from '@angular/material/tooltip';
import {
	ObButtonDirective,
	ObEScrollMode,
	type ObIServiceNavigationContact,
	type ObLoginState,
	ObMasterLayoutService,
} from '@oblique/oblique';
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
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class MasterLayoutNavigationSampleComponent {
	loginState$: Observable<ObLoginState>;
	logoutUrl$: Observable<string>;
	isLoggedOut$: Observable<boolean>;
	protected readonly scrollMode = ObEScrollMode;
	private readonly masterLayout = inject(ObMasterLayoutService);
	private readonly dynamicNavigationService = inject(DynamicNavigationService);
	private readonly serviceNavigationConfiguration = this.masterLayout.header.serviceNavigationConfiguration;
	private readonly infoLinks = [...(this.serviceNavigationConfiguration().infoLinks ?? [])];
	private readonly infoContact: ObIServiceNavigationContact = {
		...(this.serviceNavigationConfiguration().infoContact ?? {}),
	};
	private readonly profileLinks = [...(this.serviceNavigationConfiguration().profileLinks ?? [])];
	private useCustomNavigationInternal = false;
	private dynamicItemIndex = 0;
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
		return this.serviceNavigationConfiguration().displayApplications ?? false;
	}

	set hasApplicationsWidget(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({displayApplications: value});
	}

	get hasAuthenticationWidget(): boolean {
		return this.serviceNavigationConfiguration().displayAuthentication ?? false;
	}

	set hasAuthenticationWidget(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({displayAuthentication: value});
	}

	get hasInfoWidget(): boolean {
		return this.serviceNavigationConfiguration().displayInfo ?? false;
	}

	set hasInfoWidget(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({displayInfo: value});
	}

	get hasLanguagesWidget(): boolean {
		return this.serviceNavigationConfiguration().displayLanguages ?? false;
	}

	set hasLanguagesWidget(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({displayLanguages: value});
	}

	get hasMessageWidget(): boolean {
		return this.serviceNavigationConfiguration().displayMessage ?? false;
	}

	set hasMessageWidget(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({displayMessage: value});
	}

	get hasProfileWidget(): boolean {
		return this.serviceNavigationConfiguration().displayProfile ?? false;
	}

	set hasProfileWidget(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({displayProfile: value});
	}

	get hasEportalLanguageSynchronization(): boolean {
		return this.serviceNavigationConfiguration().eportalLanguageSynchronization ?? false;
	}

	set hasEportalLanguageSynchronization(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({eportalLanguageSynchronization: value});
	}

	get hasInfoLinks(): boolean {
		return (this.serviceNavigationConfiguration().infoLinks?.length ?? 0) > 0;
	}

	set hasInfoLinks(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({infoLinks: value ? this.infoLinks : []});
	}

	get hasInfoBackend(): boolean {
		return this.serviceNavigationConfiguration().useInfoBackend ?? false;
	}
	set hasInfoBackend(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({useInfoBackend: value});
	}

	get hasContactForm(): boolean {
		return (this.serviceNavigationConfiguration().infoContact?.formUrl?.length ?? 0) > 0;
	}
	set hasContactForm(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({
			infoContact: {formUrl: value ? this.infoContact.formUrl : undefined},
		});
	}

	get hasContactFormText(): boolean {
		return (this.serviceNavigationConfiguration().infoContact?.formUrlText?.length ?? 0) > 0;
	}
	set hasContactFormText(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({
			infoContact: {formUrlText: value ? this.infoContact.formUrlText : undefined},
		});
	}

	get hasContactEmail(): boolean {
		return (this.serviceNavigationConfiguration().infoContact?.email?.length ?? 0) > 0;
	}
	set hasContactEmail(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({
			infoContact: {email: value ? this.infoContact.email : undefined},
		});
	}

	get hasContactEmailText(): boolean {
		return (this.serviceNavigationConfiguration().infoContact?.emailText?.length ?? 0) > 0;
	}
	set hasContactEmailText(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({
			infoContact: {emailText: value ? this.infoContact.emailText : undefined},
		});
	}

	get hasContactPhone(): boolean {
		return (this.serviceNavigationConfiguration().infoContact?.phone?.length ?? 0) > 0;
	}
	set hasContactPhone(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({
			infoContact: {phone: value ? this.infoContact.phone : undefined},
		});
	}

	get hasContactPhoneText(): boolean {
		return (this.serviceNavigationConfiguration().infoContact?.phoneText?.length ?? 0) > 0;
	}
	set hasContactPhoneText(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({
			infoContact: {phoneText: value ? this.infoContact.phoneText : undefined},
		});
	}

	get hasProfileLinks(): boolean {
		return (this.serviceNavigationConfiguration().profileLinks?.length ?? 0) > 0;
	}

	set hasProfileLinks(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({profileLinks: value ? this.profileLinks : []});
	}

	get handleLogout(): boolean {
		return this.serviceNavigationConfiguration().handleLogout ?? false;
	}

	set handleLogout(value: boolean) {
		this.masterLayout.header.updateServiceNavigationConfiguration({handleLogout: value});
	}

	get useCustomNavigation(): boolean {
		return this.useCustomNavigationInternal;
	}

	set useCustomNavigation(value: boolean) {
		this.useCustomNavigationInternal = value;
		this.dynamicNavigationService.useCustomNavigation(value);
	}

	addItem(): void {
		this.dynamicItemIndex += 1;
		this.dynamicNavigationService.addLink({
			id: `master-layout-dynamic-${this.dynamicItemIndex}`,
			label: `Dynamic test item ${this.dynamicItemIndex}`,
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
