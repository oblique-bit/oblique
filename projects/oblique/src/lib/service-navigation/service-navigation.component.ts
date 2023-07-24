import {Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {ObServiceNavigationService} from './service-navigation.service';
import {ObEPamsEnvironment, ObIServiceNavigationContact, ObIServiceNavigationLink, ObLoginState} from './service-navigation.model';
import {ObServiceNavigationApplicationsService} from './applications/service-navigation-applications.service';

@Component({
	selector: 'ob-service-navigation',
	templateUrl: './service-navigation.component.html',
	styleUrls: ['./service-navigation.component.scss'],
	providers: [ObServiceNavigationService, ObServiceNavigationApplicationsService],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-service-navigation'}
})
export class ObServiceNavigationComponent implements OnInit, OnChanges {
	@Input() profileLinks: ObIServiceNavigationLink[] = [];
	@Input() infoLinks: ObIServiceNavigationLink[] = [];
	@Input() infoContact: ObIServiceNavigationContact;
	@Input() maxLastUsedApplications = 3;
	@Input() maxFavoriteApplications = 3;
	@Input() environment: ObEPamsEnvironment;
	@Input() rootUrl: string;
	@Input() returnUrl: string;
	@Input() displayMessage = false;
	@Input() displayInfo = false;
	@Input() displayApplications = false;
	@Input() displayProfile = false;
	@Input() displayAuthentication = false;
	@Input() displayLanguages = true;
	@Input() handleLogout = true;
	@Output()
	readonly loginState: Observable<ObLoginState> = this.headerControlsService.getLoginState$();
	@Output() readonly logoutTriggered = new EventEmitter<string>();
	@ContentChildren('customWidgetTemplate') customWidgetTemplate: QueryList<unknown>;
	readonly loginUrl$ = this.headerControlsService.getLoginUrl$();
	readonly logoutUrl$ = this.headerControlsService.getLogoutUrl$();
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
	}

	ngOnChanges(): void {
		this.headerControlsService.setReturnUrl(this.returnUrl);
	}

	changeLanguage(language: string): void {
		this.headerControlsService.setLanguage(language);
	}

	handleLogoutClick(logoutURL: string): void {
		this.logoutTriggered.emit(logoutURL);
	}
}
