import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Signal,
	TemplateRef,
	ViewEncapsulation,
	computed,
	contentChild,
	contentChildren,
	inject,
	model,
	output,
	viewChildren,
} from '@angular/core';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {OB_BANNER, ObIBanner, buildBannerObject} from '../../banner';
import {
	ObEMasterLayoutEventValues,
	ObIMasterLayoutEvent,
	ObINavigationLink,
	ObIServiceNavigationConfig,
} from '../master-layout.model';
import {
	ObEPamsEnvironment,
	ObIPamsConfiguration,
	ObLoginState,
} from '../../service-navigation/service-navigation.model';
import {OB_PAMS_CONFIGURATION} from '../../service-navigation/service-navigation.provider';
import {ObMasterLayoutComponentService} from '../master-layout/master-layout.component.service';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
	selector: 'ob-master-layout-header',
	standalone: false,
	templateUrl: './master-layout-header.component.html',
	styleUrls: ['./master-layout-header.component.scss', './master-layout-header-controls.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.ob-master-layout-header-small]': 'isSmall()',
		class: 'ob-master-layout-header',
	},
})
export class ObMasterLayoutHeaderComponent {
	home$: Observable<string>;
	banner: ObIBanner;
	readonly navigation = model<ObINavigationLink[]>([]);
	/** @deprecated since Oblique 16. Will be removed in Oblique 17. Use `navigationChange` instead. */
	readonly navigationChanged = output<ObINavigationLink[]>();
	readonly serviceNavigationConfig: Signal<
		ObIServiceNavigationConfig & {environment: ObEPamsEnvironment; rootUrl: string}
	>;
	readonly obLogo = contentChild<TemplateRef<unknown>>('obHeaderLogo');
	readonly templates = contentChildren<TemplateRef<unknown>>('obHeaderControl');
	readonly mobileTemplates = contentChildren<TemplateRef<unknown>>('obHeaderMobileControl');
	readonly hasMainNavigation: Signal<boolean>;
	readonly headerControl = viewChildren<ElementRef>('headerControl');
	readonly headerMobileControl = viewChildren<ElementRef>('headerMobileControl');
	readonly isCustom: Signal<boolean>;
	readonly isSmall: Signal<boolean>;
	readonly pamsConfiguration = inject<ObIPamsConfiguration>(OB_PAMS_CONFIGURATION, {optional: true});
	private readonly masterLayout = inject(ObMasterLayoutService);
	private readonly config = inject(ObMasterLayoutConfig);

	constructor() {
		const bannerToken = inject<ObIBanner>(OB_BANNER, {optional: true});
		this.isCustom = toSignal(
			this.masterLayout.header.configEvents$.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_CUSTOM),
				map((event: ObIMasterLayoutEvent) => !!event.value)
			),
			{initialValue: this.masterLayout.header.isCustom}
		);
		this.isSmall = toSignal(
			this.masterLayout.header.configEvents$.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_SMALL),
				map((event: ObIMasterLayoutEvent) => !!event.value)
			),
			{initialValue: this.masterLayout.header.isSmall}
		);
		this.banner = buildBannerObject(bannerToken);
		this.home$ = this.masterLayout.homePageRouteChange$;
		this.serviceNavigationConfig = computed(() => ({
			...this.masterLayout.header.serviceNavigationConfiguration(),
			environment: this.pamsConfiguration?.environment ?? ObEPamsEnvironment.PROD,
			rootUrl: this.pamsConfiguration?.rootUrl ?? '',
		}));
		this.hasMainNavigation = toSignal(
			inject(ObMasterLayoutComponentService).configEvents$.pipe(
				filter(events => events.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION),
				map(event => !!event.value)
			),
			{initialValue: this.config.layout.hasMainNavigation}
		);
	}

	emitLoginState(loginState: ObLoginState): void {
		this.masterLayout.header.emitLoginState(loginState);
	}

	emitLogoutUrl(logoutUrl: string): void {
		this.masterLayout.header.emitLogoutUrl(logoutUrl);
	}

	/** @deprecated since Oblique 16. Will be removed in Oblique 17.
	 *
	 * Use the `navigation` model with `[(navigation)]`
	 * or update it with `navigation.set(...)` instead.
	 */
	emitNavigation(navigation: ObINavigationLink[]): void {
		this.navigationChanged.emit(navigation);
	}
}
