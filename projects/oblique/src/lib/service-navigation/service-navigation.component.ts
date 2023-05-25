import {Component, ContentChildren, Input, OnInit, Output, QueryList, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {ObLanguageSelectorType} from '../master-layout/master-layout.model';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObEPamsEnvironment, ObIServiceNavigationContact, ObIServiceNavigationLink, ObLoginState} from './service-navigation.model';
import {ObServiceNavigationApplicationsService} from './applications/service-navigation-applications.service';
import {ObServiceNavigationTimeoutService} from './timeout/service-navigation-timeout.service';
import {ObServiceNavigationTimeoutCookieService} from './timeout/service-navigation-timeout-cookie.service';
import {ObServiceNavigationTimeoutCookieActivityService} from './timeout/service-navigation-timeout-cookie-activity.service';
import {ObServiceNavigationTimeoutRedirectorService} from './timeout/service-navigation-timeout-redirector.service';
import {ObServiceNavigationTimeoutReturnUrlService} from './timeout/service-navigation-timeout-return-url.service';

@Component({
	selector: 'ob-service-navigation',
	templateUrl: './service-navigation.component.html',
	styleUrls: ['./service-navigation.component.scss'],
	providers: [
		ObServiceNavigationService,
		ObServiceNavigationApplicationsService,
		ObServiceNavigationTimeoutService,
		ObServiceNavigationTimeoutCookieService,
		ObServiceNavigationTimeoutRedirectorService,
		ObServiceNavigationTimeoutCookieActivityService,
		ObServiceNavigationTimeoutReturnUrlService
	],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation'}
})
export class ObServiceNavigationComponent implements OnInit {
	@Input() profileLinks: ObIServiceNavigationLink[] = [];
	@Input() infoLinks: ObIServiceNavigationLink[] = [];
	@Input() infoContact: ObIServiceNavigationContact;
	@Input() languageSelectorStyle: ObLanguageSelectorType = 'dropdown';
	@Input() maxLastUsedApplications = 3;
	@Input() maxFavoriteApplications = 3;
	@Input() environment: ObEPamsEnvironment;
	@Input() rootUrl: string;
	@Input()
	set returnUrl(newReturnUrl) {
		this.headerControlsService.setReturnUrl(newReturnUrl);
	}
	@Input() displayMessage = false;
	@Input() displayInfo = false;
	@Input() displayApplications = false;
	@Input() displayProfile = false;
	@Input() displayAuthentication = false;
	@Input() displayLanguages = true;
	@Input()
	set handleLogout(newHandleLogout: boolean) {
		this.headerControlsService.setHandleLogout(newHandleLogout);
	}
	@Output()
	readonly loginState: Observable<ObLoginState> = this.headerControlsService.getLoginState$();
	@Output() readonly logoutTriggered = this.headerControlsService.getLogoutTrigger$();
	@ContentChildren('customWidgetTemplate') customWidgetTemplate: QueryList<unknown>;
	readonly loginUrl$ = this.headerControlsService.getLoginUrl$();
	readonly loginState$ = this.headerControlsService.getLoginState$();
	readonly userName$ = this.headerControlsService.getUserName$();
	readonly settingsUrl$ = this.headerControlsService.getSettingsUrl$();
	readonly avatarUrl$ = this.headerControlsService.getAvatarUrl$();
	readonly inboxMailUrl$ = this.headerControlsService.getInboxMailUrl$();
	readonly messageCount$ = this.headerControlsService.getMessageCount$();
	readonly applicationsUrl$ = this.headerControlsService.getApplicationsUrl$();
	readonly lastUsedApplications$ = this.headerControlsService.getLastUsedApplications$();
	readonly favoriteApplications$ = this.headerControlsService.getFavoriteApplications$();
	readonly language$ = this.headerControlsService.getLanguage$();
	readonly languages = this.headerControlsService.getLanguages();

	constructor(private readonly headerControlsService: ObServiceNavigationService) {}

	ngOnInit(): void {
		this.headerControlsService.setUpRootUrls(this.environment, this.rootUrl);
		this.headerControlsService.setHandleLogout(this.handleLogout);
	}

	changeLanguage(language: string): void {
		this.headerControlsService.setLanguage(language);
	}

	logoutClick(): void {
		this.headerControlsService.logout();
	}
}
