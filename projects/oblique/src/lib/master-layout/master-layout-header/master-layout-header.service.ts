import {Injectable, Signal, WritableSignal, inject, signal} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObIServiceNavigationContactBase, ObLoginState} from '../../service-navigation/service-navigation.model';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent, ObIServiceNavigationConfig} from '../master-layout.model';
import {mergeDeep} from '../../utilities';
import {DeepPartial} from '../../utilities.model';

type ObIServiceNavigationConfigurationUpdate = Omit<Partial<ObIServiceNavigationConfig>, 'infoContact'> & {
	infoContact?: ObIServiceNavigationContactBase;
};

@Injectable({providedIn: 'root'})
export class ObMasterLayoutHeaderService {
	readonly configEvents$: Observable<ObIMasterLayoutEvent>;
	readonly loginState$: Observable<ObLoginState>;
	readonly logoutUrl$: Observable<string>;
	readonly serviceNavigationConfiguration: Signal<ObIServiceNavigationConfig>;
	private readonly serviceNavigationConfigurationInternal: WritableSignal<ObIServiceNavigationConfig>;
	private readonly events = new Subject<ObIMasterLayoutEvent>();
	private readonly loginState = new Subject<ObLoginState>();
	private readonly logoutUrl = new Subject<string>();
	private readonly config = inject(ObMasterLayoutConfig);
	private isCustomInternal = this.config.header.isCustom;
	private isSmallInternal = this.config.header.isSmall;
	private isStickyInternal = this.config.header.isSticky;

	constructor() {
		this.serviceNavigationConfigurationInternal = signal(this.config.header.serviceNavigation);
		this.serviceNavigationConfiguration = this.serviceNavigationConfigurationInternal.asReadonly();
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
			value,
		});
	}

	get isSmall(): boolean {
		return this.isSmallInternal;
	}

	set isSmall(value: boolean) {
		this.isSmallInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_SMALL,
			value,
		});
	}

	get isSticky(): boolean {
		return this.isStickyInternal;
	}

	set isSticky(value: boolean) {
		this.isStickyInternal = value;
		this.events.next({
			name: ObEMasterLayoutEventValues.HEADER_IS_STICKY,
			value,
		});
	}

	/**
	 * Updates the service navigation configuration by merging top-level and nested contact properties.
	 * An `undefined` value explicitly clears the corresponding property.
	 */
	updateServiceNavigationConfiguration(configuration: ObIServiceNavigationConfigurationUpdate): void {
		this.serviceNavigationConfigurationInternal.update(current =>
			mergeDeep(current, configuration as DeepPartial<ObIServiceNavigationConfig>, {ignoreUndefined: false})
		);
	}

	emitLoginState(loginState: ObLoginState): void {
		this.loginState.next(loginState);
	}

	emitLogoutUrl(logoutUrl: string): void {
		this.logoutUrl.next(logoutUrl);
	}
}
