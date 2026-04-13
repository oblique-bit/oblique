import {
	Component,
	ContentChild,
	ContentChildren,
	ElementRef,
	EventEmitter,
	Input,
	OnDestroy,
	Output,
	QueryList,
	TemplateRef,
	ViewChildren,
	ViewEncapsulation,
	inject,
} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {OB_BANNER, OB_PAMS_CONFIGURATION} from '../../utilities';
import {ObIBanner, ObIPamsConfiguration} from '../../utilities.model';
import {
	ObEEnvironment,
	ObEMasterLayoutEventValues,
	ObIMasterLayoutEvent,
	ObINavigationLink,
	ObIServiceNavigationConfig,
} from '../master-layout.model';
import {ObEColor} from '../../style/colors.model';
import {ObLoginState} from '../../service-navigation/service-navigation.model';

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
	@Input() navigation: ObINavigationLink[];
	@Output() readonly navigationChanged = new EventEmitter<ObINavigationLink[]>();
	isSmall: boolean;
	@ContentChild('obHeaderLogo') readonly obLogo: TemplateRef<unknown>;
	@ContentChildren('obHeaderControl') readonly templates: QueryList<TemplateRef<unknown>>;
	@ContentChildren('obHeaderMobileControl') readonly mobileTemplates: QueryList<TemplateRef<unknown>>;
	@ViewChildren('headerControl') readonly headerControl: QueryList<ElementRef>;
	@ViewChildren('headerMobileControl') readonly headerMobileControl: QueryList<ElementRef>;
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

	private initializeBanner(bannerToken): ObIBanner {
		switch (bannerToken?.text) {
			case ObEEnvironment.LOCAL:
				return {color: '#fff', bgColor: ObEColor.ENV_LOCAL, ...bannerToken};
			case ObEEnvironment.DEV:
				return {color: ObEColor.DEFAULT, bgColor: ObEColor.ENV_DEV, ...bannerToken};
			case ObEEnvironment.REF:
				return {color: ObEColor.DEFAULT, bgColor: ObEColor.ENV_REF, ...bannerToken};
			case ObEEnvironment.TEST:
				return {color: '#fff', bgColor: ObEColor.ENV_TEST, ...bannerToken};
			case ObEEnvironment.ABN:
				return {color: '#fff', bgColor: ObEColor.ENV_ABN, ...bannerToken};
			default:
				return {color: '#fff', bgColor: ObEColor.ENV_LOCAL, ...bannerToken};
		}
	}
}
