import {Component, ContentChildren, Input, OnInit, Output, QueryList, TemplateRef, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
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
	standalone: false,
	templateUrl: './service-navigation.component.html',
	styleUrls: ['./service-navigation.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [
		ObServiceNavigationService,
		ObServiceNavigationApplicationsService,
		ObServiceNavigationTimeoutService,
		ObServiceNavigationTimeoutCookieService,
		ObServiceNavigationTimeoutRedirectorService,
		ObServiceNavigationTimeoutCookieActivityService,
		ObServiceNavigationTimeoutReturnUrlService
	],
	host: {class: 'ob-service-navigation'}
})
export class ObServiceNavigationComponent implements OnInit {
	@Input() profileLinks: ObIServiceNavigationLink[] = [];
	@Input() infoDescription: string;
	@Input() infoHelpText: string;
	@Input() infoLinks: ObIServiceNavigationLink[] = [];
	@Input() infoContactText: string;
	@Input() infoContact: ObIServiceNavigationContact;
	/**
	 * @deprecated since Oblique 13.3.2. It will be removed in the next major version.
	 */
	@Input() maxLastUsedApplications = 3;
	@Input() maxFavoriteApplications = 8;
	@Input() environment: ObEPamsEnvironment;
	@Input() rootUrl: string;
	@Input()
	set returnUrl(newReturnUrl) {
		this.headerControlsService.setReturnUrl(newReturnUrl);
	}
	@Input() pamsAppId: string | undefined = undefined;
	@Input() displayMessage = false;
	@Input() useInfoBackend = false;
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
	@ContentChildren('customWidgetTemplate') customWidgetTemplate: QueryList<TemplateRef<unknown>>;
	readonly loginUrl$ = this.headerControlsService.getLoginUrl$();
	readonly loginState$ = this.headerControlsService.getLoginState$();
	readonly userName$ = this.headerControlsService.getUserName$();
	readonly profileUrls$ = this.headerControlsService.getProfileUrls$();
	readonly inboxMailUrl$ = this.headerControlsService.getInboxMailUrl$();
	readonly messageCount$ = this.headerControlsService.getMessageCount$();
	readonly applicationsUrl$ = this.headerControlsService.getApplicationsUrl$();
	readonly lastUsedApplications$ = this.headerControlsService.getLastUsedApplications$();
	readonly favoriteApplications$ = this.headerControlsService.getFavoriteApplications$();
	readonly language$ = this.headerControlsService.getLanguage$();
	readonly languages = this.headerControlsService.getLanguages();
	readonly infoBackend$ = this.headerControlsService.getInfoBackend$();
	constructor(private readonly headerControlsService: ObServiceNavigationService) {}

	ngOnInit(): void {
		this.headerControlsService.setUpRootUrls(this.environment, this.rootUrl);
		this.headerControlsService.setPamsAppId(this.pamsAppId);
		this.headerControlsService.setFavoriteApplicationsCount(this.maxFavoriteApplications);
	}

	changeLanguage(language: string): void {
		this.headerControlsService.setLanguage(language);
	}

	logoutClick(): void {
		this.headerControlsService.logout();
	}
}
