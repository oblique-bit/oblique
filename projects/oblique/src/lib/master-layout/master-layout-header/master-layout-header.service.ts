import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObLoginState} from '../../service-navigation/service-navigation.model';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent, ObIServiceNavigationConfig} from '../master-layout.model';

@Injectable({providedIn: 'root'})
export class ObMasterLayoutHeaderService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	readonly loginState$: Observable<ObLoginState>;
	readonly logoutUrl$: Observable<string>;
	private readonly events = new Subject<ObIMasterLayoutEvent>();
	private readonly loginState = new Subject<ObLoginState>();
	private readonly logoutUrl = new Subject<string>();
	private isCustomInternal = this.config.header.isCustom;
	private isSmallInternal = this.config.header.isSmall;
	private isStickyInternal = this.config.header.isSticky;
	private reduceOnScrollInternal = this.config.header.reduceOnScroll;
	private serviceNavigationConfigurationInternal = this.config.header.serviceNavigation;

	constructor(private readonly config: ObMasterLayoutConfig) {
		this.configEvents$ = this.events.asObservable();
		this.loginState$ = this.loginState.asObservable();
		this.logoutUrl$ = this.logoutUrl.asObservable();
	}

	get isCustom(): boolean {
		return this.isCustomInternal;
	}

	set isCustom(value: boolean) {
		this.isCustomInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_CUSTOM,
			value
		});
	}

	get isSmall(): boolean {
		return this.isSmallInternal;
	}

	set isSmall(value: boolean) {
		this.isSmallInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_SMALL,
			value
		});
	}

	get isSticky(): boolean {
		return this.isStickyInternal;
	}

	set isSticky(value: boolean) {
		this.isStickyInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_STICKY,
			value
		});
	}

	get reduceOnScroll(): boolean {
		return this.reduceOnScrollInternal;
	}

	set reduceOnScroll(value: boolean) {
		this.reduceOnScrollInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.HEADER_REDUCE_ON_SCROLL,
			value
		});
	}

	get serviceNavigationConfiguration(): ObIServiceNavigationConfig {
		return this.serviceNavigationConfigurationInternal;
	}

	set serviceNavigationConfiguration(value: ObIServiceNavigationConfig) {
		this.serviceNavigationConfigurationInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.SERVICE_NAVIGATION_CONFIGURATION,
			config: value
		});
	}

	emitLoginState(loginState: ObLoginState): void {
		this.loginState.next(loginState);
	}

	emitLogoutUrl(logoutUrl: string): void {
		this.logoutUrl.next(logoutUrl);
	}
}
