import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
	Output,
	TemplateRef,
	ViewEncapsulation,
	contentChildren,
	inject,
	input,
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
	changeDetection: ChangeDetectionStrategy.Eager,
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation'},
})
export class ObServiceNavigationComponent implements OnInit {
	readonly profileLinks = input<ObIServiceNavigationLink[]>([]);
	readonly infoDescription = input<string>(undefined);
	readonly infoHelpText = input<string>(undefined);
	readonly infoLinks = input<ObIServiceNavigationLink[]>([]);
	readonly infoContactText = input<string>(undefined);
	readonly infoContact = input<ObIServiceNavigationContact>(undefined);
	readonly maxFavoriteApplications = input(8);
	readonly environment = input<ObEPamsEnvironment>(undefined);
	readonly rootUrl = input<string>(undefined);
	@Input()
	set returnUrl(newReturnUrl) {
		this.headerControlsService.setReturnUrl(newReturnUrl);
	}
	readonly pamsAppId = input<string | undefined>(undefined);
	readonly displayMessage = input(false);
	readonly useInfoBackend = input(false);
	readonly displayInfo = input(false);
	readonly displayApplications = input(false);
	readonly displayProfile = input(false);
	readonly displayAuthentication = input(false);
	readonly displayLanguages = input(true);
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
	readonly customWidgetTemplate = contentChildren<TemplateRef<unknown>>('customWidgetTemplate');
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
		this.headerControlsService.setUpRootUrls(this.environment(), this.rootUrl());
		this.headerControlsService.setPamsAppId(this.pamsAppId());
		this.headerControlsService.setFavoriteApplicationsCount(this.maxFavoriteApplications());
	}

	changeLanguage(language: string): void {
		this.headerControlsService.setLanguage(language);
	}

	logoutClick(): void {
		this.headerControlsService.logout();
	}
}
