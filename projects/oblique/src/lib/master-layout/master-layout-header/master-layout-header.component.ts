import {
	Component,
	ElementRef,
	OnDestroy,
	TemplateRef,
	ViewEncapsulation,
	contentChild,
	contentChildren,
	inject,
	input,
	output,
	viewChildren,
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {OB_BANNER, OB_PAMS_CONFIGURATION} from '../../utilities';
import {ObIBanner, ObIPamsConfiguration, ObTBanner} from '../../utilities.model';
import {
	ObEEnvironment,
	ObEMasterLayoutEventValues,
	ObIMasterLayoutEvent,
	ObINavigationLink,
	ObIServiceNavigationConfig,
} from '../master-layout.model';
import {ObEColor} from '../../style/colors.model';
import {ObLoginState} from '../../service-navigation/service-navigation.model';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';

@Component({
	selector: 'ob-master-layout-header',
	standalone: false,
	templateUrl: './master-layout-header.component.html',
	styleUrls: ['./master-layout-header.component.scss', './master-layout-header-controls.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.ob-master-layout-header-small]': 'isSmall',
		class: 'ob-master-layout-header',
	},
})
export class ObMasterLayoutHeaderComponent implements OnDestroy {
	home$: Observable<string>;
	isCustom: boolean;
	banner: ObIBanner;
	serviceNavigationConfig: ObIServiceNavigationConfig;
	hasMainNavigation: boolean;
	readonly navigation = input<ObINavigationLink[]>(undefined);
	readonly navigationChanged = output<ObINavigationLink[]>();
	isSmall: boolean;
	readonly obLogo = contentChild<TemplateRef<unknown>>('obHeaderLogo');
	readonly templates = contentChildren<TemplateRef<unknown>>('obHeaderControl');
	readonly mobileTemplates = contentChildren<TemplateRef<unknown>>('obHeaderMobileControl');
	readonly headerControl = viewChildren<ElementRef>('headerControl');
	readonly headerMobileControl = viewChildren<ElementRef>('headerMobileControl');
	readonly pamsConfiguration = inject<ObIPamsConfiguration>(OB_PAMS_CONFIGURATION, {optional: true});
	private readonly unsubscribe = new Subject<void>();
	private readonly masterLayout = inject(ObMasterLayoutService);
	private readonly config = inject(ObMasterLayoutConfig);

	constructor() {
		this.isCustom = this.masterLayout.header.isCustom;
		this.isSmall = this.masterLayout.header.isSmall;
		const bannerToken = inject<ObIBanner>(OB_BANNER, {optional: true});
		this.customChange();
		this.smallChange();
		this.serviceNavigationConfiguration();
		this.banner = this.initializeBanner(bannerToken);
		this.home$ = this.masterLayout.homePageRouteChange$;
		this.serviceNavigationConfig = this.config.header.serviceNavigation;
		this.hasMainNavigation = this.config.layout.hasMainNavigation;

		inject(ObMasterLayoutComponentService)
			.configEvents$.pipe(
				takeUntil(this.unsubscribe),
				filter(events => events.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION),
				map(event => event.value)
			)
			.subscribe(hasMainNavigation => {
				this.hasMainNavigation = hasMainNavigation;
			});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	emitLoginState(loginState: ObLoginState): void {
		this.masterLayout.header.emitLoginState(loginState);
	}

	emitLogoutUrl(logoutUrl: string): void {
		this.masterLayout.header.emitLogoutUrl(logoutUrl);
	}

	emitNavigation(navigation: ObINavigationLink[]): void {
		this.navigationChanged.emit(navigation);
	}

	private customChange(): void {
		this.masterLayout.header.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_CUSTOM),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.isCustom = event.value;
			});
	}

	private smallChange(): void {
		this.masterLayout.header.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_SMALL),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.isSmall = event.value;
			});
	}

	private serviceNavigationConfiguration(): void {
		this.masterLayout.header.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.SERVICE_NAVIGATION_CONFIGURATION),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.serviceNavigationConfig = event.config;
			});
	}

	private initializeBanner(bannerToken: ObTBanner): ObIBanner {
		const obIBanner: ObIBanner = typeof bannerToken === 'string' ? {text: bannerToken} : bannerToken;

		switch (obIBanner?.text as ObEEnvironment) {
			case ObEEnvironment.LOCAL:
				return {color: '#fff', bgColor: ObEColor.ENV_LOCAL, ...obIBanner};
			case ObEEnvironment.DEV:
				return {color: ObEColor.DEFAULT, bgColor: ObEColor.ENV_DEV, ...obIBanner};
			case ObEEnvironment.REF:
				return {color: ObEColor.DEFAULT, bgColor: ObEColor.ENV_REF, ...obIBanner};
			case ObEEnvironment.TEST:
				return {color: '#fff', bgColor: ObEColor.ENV_TEST, ...obIBanner};
			case ObEEnvironment.ABN:
				return {color: '#fff', bgColor: ObEColor.ENV_ABN, ...obIBanner};
			default:
				return {color: '#fff', bgColor: ObEColor.ENV_LOCAL, ...obIBanner};
		}
	}
}
