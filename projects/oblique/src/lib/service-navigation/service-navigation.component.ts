import {
	Component,
	ContentChildren,
	Input,
	OnInit,
	Output,
	QueryList,
	TemplateRef,
	ViewEncapsulation,
	inject,
} from '@angular/core';
import {Observable} from 'rxjs';
import {ObServiceNavigationService} from './service-navigation.service';
import {
	ObEPamsEnvironment,
	ObILanguage,
	ObISectionLink,
	ObIServiceNavigationApplication,
	ObIServiceNavigationContact,
	ObIServiceNavigationLink,
	ObLoginState,
} from './service-navigation.model';
import {ObServiceNavigationApplicationsService} from './applications/service-navigation-applications.service';
import {ObServiceNavigationTimeoutService} from './timeout/service-navigation-timeout.service';
import {ObServiceNavigationTimeoutCookieService} from './timeout/service-navigation-timeout-cookie.service';
import {ObServiceNavigationTimeoutCookieActivityService} from './timeout/service-navigation-timeout-cookie-activity.service';
import {ObServiceNavigationTimeoutRedirectorService} from './timeout/service-navigation-timeout-redirector.service';
import {ObServiceNavigationTimeoutReturnUrlService} from './timeout/service-navigation-timeout-return-url.service';
import {ObServiceNavigationLanguageSynchronizationService} from './language-synchronization/service-navigation-language-synchronization.service';
import {ObIServiceNavigationBackendInfo} from './api/service-navigation.api.model';

@Component({
	selector: 'ob-service-navigation',
	standalone: false,
	templateUrl: './service-navigation.component.html',
	styleUrls: ['./service-navigation.component.scss'],
	providers: [
		ObServiceNavigationService,
		ObServiceNavigationApplicationsService,
		ObServiceNavigationLanguageSynchronizationService,
		ObServiceNavigationTimeoutService,
		ObServiceNavigationTimeoutCookieService,
		ObServiceNavigationTimeoutRedirectorService,
		ObServiceNavigationTimeoutCookieActivityService,
		ObServiceNavigationTimeoutReturnUrlService,
	],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation'},
})
export class ObServiceNavigationComponent implements OnInit {
	@Input() profileLinks: ObIServiceNavigationLink[] = [];
	@Input() infoDescription: string;
	@Input() infoHelpText: string;
	@Input() infoLinks: ObIServiceNavigationLink[] = [];
	@Input() infoContactText: string;
	@Input() infoContact: ObIServiceNavigationContact;
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
	@Input()
	set eportalLanguageSynchronization(synchronization: boolean) {
		this.headerControlsService.setEportalLanguageSynchronization(synchronization);
	}
	@Output()
	readonly loginState: Observable<ObLoginState>;
	@Output() readonly logoutTriggered;
	@ContentChildren('customWidgetTemplate') customWidgetTemplate: QueryList<TemplateRef<unknown>>;
	readonly loginUrl$: Observable<string>;
	readonly loginState$: Observable<ObLoginState>;
	readonly userName$: Observable<string>;
	readonly profileUrls$: Observable<ObISectionLink[]>;
	readonly inboxMailUrl$: Observable<string>;
	readonly messageCount$: Observable<number>;
	readonly applicationsUrl$: Observable<string>;
	readonly lastUsedApplications$: Observable<ObIServiceNavigationApplication[]>;
	readonly favoriteApplications$: Observable<ObIServiceNavigationApplication[]>;
	readonly language$: Observable<string>;
	readonly languages: ObILanguage[];
	readonly infoBackend$: Observable<ObIServiceNavigationBackendInfo>;
	private readonly headerControlsService = inject(ObServiceNavigationService);

	constructor() {
		this.loginState = this.headerControlsService.getLoginState$();
		this.logoutTriggered = this.headerControlsService.getLogoutTrigger$();
		this.loginUrl$ = this.headerControlsService.getLoginUrl$();
		this.loginState$ = this.headerControlsService.getLoginState$();
		this.userName$ = this.headerControlsService.getUserName$();
		this.profileUrls$ = this.headerControlsService.getProfileUrls$();
		this.inboxMailUrl$ = this.headerControlsService.getInboxMailUrl$();
		this.messageCount$ = this.headerControlsService.getMessageCount$();
		this.applicationsUrl$ = this.headerControlsService.getApplicationsUrl$();
		this.lastUsedApplications$ = this.headerControlsService.getLastUsedApplications$();
		this.favoriteApplications$ = this.headerControlsService.getFavoriteApplications$();
		this.language$ = this.headerControlsService.getLanguage$();
		this.languages = this.headerControlsService.getLanguages();
		this.infoBackend$ = this.headerControlsService.getInfoBackend$();
	}

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
