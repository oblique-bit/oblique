import {
	Component,
	OnInit,
	TemplateRef,
	ViewEncapsulation,
	computed,
	contentChildren,
	inject,
	input,
} from '@angular/core';
import {outputFromObservable, takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObIServiceNavigationBackendInfo} from './api/service-navigation.api.model';
import {
	ObEPamsEnvironment,
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
	readonly profileLinks = input<ObIServiceNavigationLink[]>([]);
	readonly infoDescription = input<string>();
	readonly infoHelpText = input<string>();
	readonly infoLinks = input<ObIServiceNavigationLink[]>([]);
	readonly infoContactText = input<string>();
	readonly infoContact = input<ObIServiceNavigationContact>();
	readonly maxFavoriteApplications = input(8);
	readonly environment = input<ObEPamsEnvironment>();
	readonly rootUrl = input<string>();
	readonly returnUrl = input<string>();
	readonly pamsAppId = input<string>();
	readonly displayMessage = input(false);
	readonly useInfoBackend = input(false);
	readonly displayInfo = input(false);
	readonly displayApplications = input(false);
	readonly displayProfile = input(false);
	readonly displayAuthentication = input(false);
	readonly displayLanguages = input(true);
	readonly handleLogout = input(false);
	readonly eportalLanguageSynchronization = input(false);
	readonly loginStateChange = outputFromObservable<ObLoginState | undefined>(
		toObservable(inject(ObServiceNavigationService).loginState)
	);
	readonly logoutTriggered = outputFromObservable<string>(inject(ObServiceNavigationService).getLogoutTrigger$());
	readonly customWidgetTemplate = contentChildren<TemplateRef<unknown>>('customWidgetTemplate');
	readonly loginUrl = inject(ObServiceNavigationService).loginUrl;
	readonly loginState = inject(ObServiceNavigationService).loginState;
	readonly userName = inject(ObServiceNavigationService).userName;
	readonly profileUrls = inject(ObServiceNavigationService).profileUrls;
	readonly inboxMailUrl = inject(ObServiceNavigationService).inboxMailUrl;
	readonly messageCount = inject(ObServiceNavigationService).messageCount;
	readonly applicationsUrl = inject(ObServiceNavigationService).applicationsUrl;
	readonly lastUsedApplications = inject(ObServiceNavigationService).lastUsedApplications;
	readonly favoriteApplications = inject(ObServiceNavigationService).favoriteApplications;
	readonly language = inject(ObServiceNavigationService).language;
	readonly languages = inject(ObServiceNavigationService).languages;
	readonly infoBackend = inject(ObServiceNavigationService).infoBackend;
	/** The effective info content, from the backend if `useInfoBackend` is set `true` or from the configured inputs. */
	readonly effectiveInfo = computed<ObIServiceNavigationBackendInfo>(() => ({
		...this.info(),
		...(this.useInfoBackend() ? this.infoBackend() : {}),
	}));
	private readonly headerControlsService = inject(ObServiceNavigationService);
	private readonly info = computed<ObIServiceNavigationBackendInfo>(() => ({
		links: this.infoLinks(),
		contact: this.infoContact(),
		helpText: this.infoHelpText(),
		contactText: this.infoContactText(),
		description: this.infoDescription(),
	}));

	constructor() {
		this.headerControlsService.connectReturnUrl(this.returnUrl);
		// These inputs are synced to the service via toObservable().subscribe() because the service
		// exposes imperative setters (setHandleLogout / setEportalLanguageSynchronization) that write to
		// plain properties on downstream services (redirectorService.handleLogout and
		// languageSynchronizationService.shouldSynchronize), which are not signals yet. Once those
		// downstream services expose writable signals, these subscriptions can be replaced by passing
		// the signal references directly to the service, as done for returnUrl via connectReturnUrl().
		toObservable(this.handleLogout)
			.pipe(takeUntilDestroyed())
			.subscribe(handleLogout => this.headerControlsService.setHandleLogout(handleLogout));
		toObservable(this.eportalLanguageSynchronization)
			.pipe(takeUntilDestroyed())
			.subscribe(synchronization => this.headerControlsService.setEportalLanguageSynchronization(synchronization));
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
