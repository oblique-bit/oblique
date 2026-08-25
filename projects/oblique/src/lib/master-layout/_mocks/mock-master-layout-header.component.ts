import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	ModelSignal,
	Signal,
	TemplateRef,
	computed,
	contentChild,
	contentChildren,
	model,
	output,
	signal,
	viewChildren,
} from '@angular/core';
import {ObINavigationLink} from '../master-layout.module';
import {Observable, of} from 'rxjs';
import {
	ObEPamsEnvironment,
	ObIPamsConfiguration,
	ObLoginState,
} from '../../service-navigation/service-navigation.model';
import {ObIBanner} from '../../banner';
import {ObIServiceNavigationConfig} from '../master-layout.model';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout-header',
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	exportAs: 'obMasterLayoutHeader',
})
export class ObMockMasterLayoutHeaderComponent {
	home$: Observable<string> = of('');
	banner: ObIBanner = {};
	readonly navigation: ModelSignal<ObINavigationLink[]> = model<ObINavigationLink[]>([]);
	/** @deprecated since Oblique 16. Will be removed in Oblique 17. Use `navigationChange` instead. */
	readonly navigationChanged = output<ObINavigationLink[]>();
	readonly serviceNavigationConfig: Signal<
		ObIServiceNavigationConfig & {
			environment: ObEPamsEnvironment;
			rootUrl: string;
		}
	> = computed(() => ({environment: ObEPamsEnvironment.TEST, rootUrl: ''}));
	readonly obLogo = contentChild<TemplateRef<unknown>>('obHeaderLogo');
	readonly templates = contentChildren<TemplateRef<unknown>>('obHeaderControl');
	readonly mobileTemplates = contentChildren<TemplateRef<unknown>>('obHeaderMobileControl');
	readonly hasMainNavigation: Signal<boolean> = signal(true);
	readonly headerControl = viewChildren<ElementRef>('headerControl');
	readonly headerMobileControl = viewChildren<ElementRef>('headerMobileControl');
	readonly isCustom: Signal<boolean> = signal(true);
	readonly isSmall: Signal<boolean> = signal(false);
	readonly pamsConfiguration: ObIPamsConfiguration | null = null;

	emitLoginState(loginState: ObLoginState): void {}
	emitLogoutUrl(logoutUrl: string): void {}
	emitNavigation(navigation: ObINavigationLink[]): void {}
}
